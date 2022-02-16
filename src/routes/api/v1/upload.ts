import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { deta, prisma } from '$lib/utils/clients';
import cuid from 'cuid';

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
	const id = cuid();
	console.log('Uploading now...');
	const drive = deta.Drive('imnote');
	await drive.put(id, { data: await request.arrayBuffer().toString('base64') });
	const pic = await prisma.picture.create({
		data: { id: id, userEmail: jwt.email }
	});
	console.log(pic);

	return {
		status: 200,
		body: id
	};
}
