import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';

export async function get({ request, url }) {
	const noteId = url.searchParams.get('note');
	if (noteId === null) {
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

	const note = await prisma.note.findFirst({
		where: { id: noteId, userEmail: jwt.email },
		include: {
			pictures: true,
			user: false,
		}
	});

	if (note === null) {
		return {
			status: 404
		};
	}

	return {
		status: 200,
		body: JSON.stringify(note),
		headers: {
			'content-type': 'application/json'
		}
	};
}
