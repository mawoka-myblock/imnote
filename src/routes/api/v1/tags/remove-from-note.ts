import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';

export async function del({ request, url }) {
	const tagId = url.searchParams.get('tag');
	const noteId = url.searchParams.get('note');
	if (tagId === null || noteId === null) {
		return {
			status: 404
		};
	}
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
	const oldTags = await prisma.note.findFirst({
		where: { id: noteId },
		select: {
			tags: true
		}
	});
	const newTags = oldTags.tags.filter((item) => item !== tagId);

	const updateRes = await prisma.note.update({
		data: {
			tags: {
				set: newTags
			}
		},
		where: {
			id: noteId
		},
		include: {
			pictures: true
		}
	});

	if (updateRes === null) {
		return {
			status: 404
		};
	}

	return {
		status: 200,
		body: JSON.stringify(updateRes),
		headers: {
			'content-type': 'application/json'
		}
	};
}
