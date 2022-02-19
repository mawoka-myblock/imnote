import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';
import { v, compile, ValidationError } from 'suretype';

interface UpdateNote {
	id: string;
	description?: string;
	title?: string;
	pictures?: string[];
	tags?: string[];
}

const UpdateNote = v.object({
	id: v.string().required(),
	description: v.string(),
	title: v.string(),
	pictures: v.array(),
	tags: v.array()
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
	let note: UpdateNote;
	try {
		note = compile(UpdateNote, { ensure: true, colors: false })(await request.json());
	} catch (e) {
		if (e instanceof ValidationError) {
			return {
				status: 400,
				body: e,
				headers: {
					'content-type': 'application/json'
				}
			};
		} else {
			throw e;
		}
	}
	const picArray = [];
	// eslint-disable-next-line prefer-const
	for (let entry in note.pictures) {
		if ((await prisma.picture.findFirst({ where: { id: note.pictures[entry] } })) === null) {
			return {
				status: 404,
				body: JSON.stringify({ detail: `picture ${note.pictures[entry]} not found` }),
				headers: {
					'content-type': 'application/json'
				}
			};
		}
		picArray.push({ id: note.pictures[entry] });
	}

	const tagArray = [];
	if (note.tags !== undefined) {
		if (note.tags.length !== 0) {
			// eslint-disable-next-line prefer-const
			for (let i in note.tags) {
				// tagArray.push({
				// 	id: note.tags[i],
				// });
				tagArray.push({
					where: {
						id: note.tags[i]
					},
					create: {
						id: note.tags[i]
					}
				});
			}
		}
	}

	const oldTags = await prisma.note.findFirst({
		where: { id: note.id },
		select: {
			tags: true
		}
	});
	let newTags: string[];
	if (note.tags === undefined) {
		newTags = oldTags.tags;
	} else {
		newTags = [...oldTags.tags, ...note.tags];
	}
	console.log(oldTags);
	newTags = newTags.filter((item, pos) => newTags.indexOf(item) === pos);

	const res = await prisma.note.update({
		where: {
			id: note.id
		},
		data: {
			description: note.description,
			pictures: {
				connect: picArray
			},
			tags: {
				set: newTags
			},
			title: note.title
		},
		include: {
			pictures: true,
			user: false
		}
	});

	return {
		status: 200,
		body: JSON.stringify(res),
		headers: {
			'content-type': 'application/json'
		}
	};
}
