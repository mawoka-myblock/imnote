import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { deta, prisma } from '$lib/utils/clients';
import cuid from 'cuid';

export async function post({ request }) {
	const cookies: CookiesInterface | boolean = analyzeCookies(request);
	const content_type = request.headers.get('content-type');
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
	const drive = deta.Drive('imnote');
	const data: Buffer = Buffer.from(await request.arrayBuffer());
	await drive.put(id, { data: data, contentType: content_type });
	await prisma.picture.create({
		data: { userEmail: jwt.email, id: id }
	});

	return {
		status: 200,
		body: id
	};
}
