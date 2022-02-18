import cookie from 'cookie';
import { generateJWT } from '$lib/utils/auth';
import { prisma } from '$lib/utils/clients';
export const get = async ({ request }) => {
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	if (cookies.rememberme == undefined) {
		return {
			status: 403
		};
	}
	const userAgent = request.headers.get('User-Agent');
	const session = await prisma.session.update({
		where: {
			key: cookies.rememberme
		},
		data: { lastSeen: new Date(), userAgent: userAgent }
	});

	if (session === null) {
		return {
			status: 403
		};
	}

	const jwt = generateJWT(session.userEmail);

	return {
		status: 200,
		headers: {
			'set-cookie': [
				cookie.serialize('token', jwt, {
					httpOnly: true,
					maxAge: 3600,
					sameSite: 'strict',
					path: '/'
					// secure: true
				}),
				cookie.serialize('tokenvalid', '', {
					maxAge: 3600,
					path: '/'
				})
			]
		}
	};
};
