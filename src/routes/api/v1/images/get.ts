import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';
import { download } from '$lib/storage/download';

export async function get({ request, url }) {
	const imageId = url.searchParams.get('id');
	if (imageId === null) {
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
	// const pic = await prisma.picture.findFirst({
	// 	where: { id: imageId, userEmail: jwt.email }
	// });
	const pic = await prisma.picture.findFirst({
		where: {
			id: imageId,
			userEmail: jwt.email
		}
	});
	if (pic === null) {
		return {
			status: 404
		};
	}

	return {
		body: await download(imageId),
		headers: {
			'Content-Type': 'image/png'
		}
	};
}
