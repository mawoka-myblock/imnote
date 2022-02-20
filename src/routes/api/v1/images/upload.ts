import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { upload } from '$lib/storage/upload';
import { prisma } from '$lib/utils/clients';

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

	const id = await upload(await request.arrayBuffer());
	await prisma.picture.create({
		data: { userEmail: jwt.email, id: id }
	});

	return {
		status: 200,
		body: id
	};
}
