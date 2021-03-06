import { prisma } from '$lib/utils/clients';
import cookie from 'cookie';
import Redis from 'ioredis';
import { generateJWT } from '$lib/utils/auth';

export async function get({ url }) {
	const code = url.searchParams.get('code');
	if (code === null) {
		return {
			status: 404
		};
	}
	const redis = new Redis(String(process.env.REDIS_URL));
	const magicLink = await redis.get(code);
	if (magicLink == null) {
		return {
			status: 404
		};
	}
	const user = await prisma.user.findFirst({
		where: { email: magicLink }
	});
	const jwt = generateJWT(user.email);
	await redis.del(code);
	return {
		status: 302,
		headers: {
			'set-cookie': [
				cookie.serialize('token', jwt, {
					httpOnly: true,
					maxAge: 3600,
					sameSite: 'lax',
					secure: true
				})
			],
			Location: '/'
		}
	};
}
