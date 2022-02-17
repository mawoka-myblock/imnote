import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { deta, prisma } from '$lib/utils/clients';

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
	const drive = deta.Drive('imnote');
	const picture = await (await drive.get(imageId)).arrayBuffer();
	return {
		body: new Uint8Array(picture),
		headers: {
			'Content-Type': 'image/png'
		}
	};
}
