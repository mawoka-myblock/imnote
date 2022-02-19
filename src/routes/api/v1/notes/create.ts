import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';
import { v, compile, ValidationError } from 'suretype';

interface CreateNote {
	description?: string;
	title: string;
	pictures: string[];
	tags: string[];
}

const CreateNote = v.object({
	description: v.string(),
	title: v.string().required(),
	pictures: v.array().required(),
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
	let note: CreateNote;
	try {
		note = compile(CreateNote, { ensure: true, colors: false })(await request.json());
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
		const lol = await prisma.picture.findFirst({ where: { id: note.pictures[entry] } });
		if (lol === null) {
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
					create: {
						tagId: note.tags[i]
					},
					where: {
						tagId: note.tags[i]
					}
				});
			}
		}
	}

	const res = await prisma.note.create({
		data: {
			title: note.title,
			description: note.description,
			pictures: { connect: picArray },
			userEmail: jwt.email,
			tags: note.tags
		}
	});

	// const res = await prisma.note.create({
	// 	data: {
	// 		title: note.title,
	// 		description: note.description,
	// 		pictures: { connect: picArray },
	// 		userEmail: jwt.email,
	// 		tags: {
	// 			// connectOrCreate: tagArray
	// 			/*
	// 			connectOrCreate: {
	// 				create: {
	// 					tagId: 'a'
	// 				},
	// 				where: {
	// 					tagId: 'a'
	// 				}
	// 			}
	// 			*/
	// 			create: {
	// 				tag: {}
	// 			}
	// 		}
	// 	},
	// 	include: {
	// 		user: false
	// 	}
	// });

	return {
		status: 200,
		body: JSON.stringify(res),
		headers: {
			'content-type': 'application/json'
		}
	};
}
