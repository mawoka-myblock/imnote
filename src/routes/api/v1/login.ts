import { v, compile, ValidationError } from 'suretype';
import { sendMagicLink } from '$lib/emails';
import cookie from 'cookie';
import { randomBytes } from 'crypto';
import { generateJWT } from '$lib/utils/auth';
import { comparePassword } from '$lib/passwords';
import { prisma } from '$lib/utils/clients';
const LoginUser = v.object({
	email: v.string().required(),
	password: v.string()
});

interface LoginUser {
	email: string;
	password?: string;
}

export const post = async ({ request }) => {
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	if (cookies.rememberme !== undefined) {
		const session = await prisma.session.findUnique({
			where: { key: cookies.rememberme }
		});
		if (session !== null) {
			return {
				status: 400,
				body: JSON.stringify({ detail: 'already logged in' })
			};
		}
	}
	let user: LoginUser;
	try {
		user = compile(LoginUser, { ensure: true, colors: false })(await request.json());
	} catch (e) {
		console.error(e);
		if (e instanceof ValidationError) {
			return {
				status: 400,
				body: e
			};
		} else {
			throw e;
		}
	}

	if (user.password === undefined) {
		if (await sendMagicLink(user.email)) {
			return {
				status: 200
			};
		} else {
			return {
				status: 404
			};
		}
	}
	const userinDB = await prisma.user.findFirst({
		where: { email: user.email }
	});
	if (userinDB === null) {
		return {
			status: 404
		};
	}
	if (!(await comparePassword(userinDB.password, user.password))) {
		return {
			status: 404
		};
	}
	const userAgent = request.headers.get('User-Agent');
	const sessionKey = randomBytes(64).toString('hex');
	await prisma.session.create({
		data: { key: sessionKey, userAgent: userAgent, userEmail: user.email }
	});
	const jwt = generateJWT(user.email);

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
				}),
				cookie.serialize('rememberme', sessionKey, {
					httpOnly: true,
					path: '/',
					sameSite: 'strict',
					maxAge: 60 * 60 * 24 * 365
				})
			]
		}
	};
};
