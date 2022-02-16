import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';
import { v, compile, ValidationError } from 'suretype';

interface CreateNote {
	description?: string;
	title: string;
	pictures: string[];
}

const CreateNote = v.object({
	description: v.string(),
	title: v.string().required(),
	pictures: v.array().required()
});

export async function post({ request }) {
	const cookies: CookiesInterface | boolean = analyzeCookies(request);
	if (typeof cookies === 'boolean') {
		return {
			status: 403
		};
	}
	const jwt = verifyJWT(cookies.token);
	if (typeof jwt === 'string') {
		return {
			status: 403
		};
	}
	let note: CreateNote;
	try {
		note = compile(CreateNote, { ensure: true, colors: false })(await request.json());
	} catch (e) {
		if (e instanceof ValidationError) {
			return {
				status: 400,
				body: e,
                headers: {
                    "content-type": "application/json"
                }
			};
		} else {
			throw e;
		}
	}
	const testarr = [];
	// eslint-disable-next-line prefer-const
	for (let entry in note.pictures) {
		if ((await prisma.picture.findFirst({ where: { id: note.pictures[entry] } })) === null) {
			return {
				status: 404,
				body: JSON.stringify({ detail: `picture ${note.pictures[entry]} not found` }),
                headers: {
                    "content-type": "application/json"
                }
			};
		}
		testarr.push({ id: note.pictures[entry] });
	}

	console.log(testarr);

	const res = await prisma.note.create({
		data: {
			title: note.title,
			description: note.description,
			pictures: { connect: testarr },
			userEmail: jwt.email
		},
		include: {
			user: false
		}
	});

	return {
		status: 200,
		body: JSON.stringify(res),
        headers: {
            "content-type": "application/json"
        }
	};
}
