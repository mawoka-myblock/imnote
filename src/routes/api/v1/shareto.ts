import { analyzeCookies, verifyJWT } from '$lib/utils/auth';
import type { CookiesInterface } from '$lib/utils/auth';
import { deta, prisma } from '$lib/utils/clients';
import cuid from 'cuid';

export async function post({ request }) {
	const cookies: CookiesInterface | boolean = analyzeCookies(request);
	const content_type = request.headers.get('content-type');
	if (!content_type.includes('multipart/form-data')) {
		return {
			status: 400,
			body: JSON.stringify({ detail: 'Content-Type must be multipart/form-data' })
		};
	}
	if (typeof cookies === 'boolean') {
		return {
			status: 403
		};
	}
	const jwt = verifyJWT(cookies.token);
	if (typeof jwt === 'string') {
		return {
			status: 403,
			body: JSON.stringify({ detail: 'jwt invalid' })
		};
	}
	let formdata: FormData;
	let data: Buffer;
	try {
		formdata = await request.formData();
		data = Buffer.from(await formdata.get('picture').arrayBuffer());
	} catch (e) {
		return {
			status: 400
		};
	}
	// if (!(formdata.get('picture') instanceof)) {
	// 	return {
	// 		status: 400
	// 	};
	// }
	const id = cuid();
	const drive = deta.Drive('imnote');
	//const data: Buffer = Buffer.from(await request.arrayBuffer());
	await drive.put(id, { data: data });
	await prisma.picture.create({
		data: { userEmail: jwt.email, id: id }
	});

	return {
		status: 302,
		location: `/shareres?image=${id}`
	};
}
