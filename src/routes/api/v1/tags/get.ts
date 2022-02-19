import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';

export async function get({ request, url }) {
	const tagId = url.searchParams.get('tag');
	if (tagId === null) {
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

	const notes = await prisma.note.findMany({
		where: {
			tags: {
				has: tagId
			},
			userEmail: jwt.email
		},
		include: {
			pictures: true
		}
	});


	if (notes === null) {
		return {
			status: 404
		};
	}

	return {
		status: 200,
		body: JSON.stringify(notes),
		headers: {
			'content-type': 'application/json'
		}
	};
}
