import { v, compile, ValidationError } from 'suretype';
import { sendMagicLink } from '$lib/emails';
import cookie from 'cookie';
import { generateJWT } from '$lib/utils/auth';
const LoginUser = v.object({
	email: v.string().required(),
	password: v.string()
});

interface LoginUser {
	email: string;
	password?: string;
}

export const post = async ({ request }) => {
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
				status: 500
			};
		}
	}
	const jwt = generateJWT(user.email);
	/*
	try {
		res = verifyJWT(jwt);
	} catch (e) {
		if (e instanceof TokenExpiredError) {
			return {
				status: 400,
				body: JSON.stringify({ detail: 'Token expired' })
			};
		} else if (e instanceof JsonWebTokenError) {
			return {
				status: 400,
				body: JSON.stringify({ detail: 'Token malformed' })
			};
		} else if (e instanceof NotBeforeError) {
			return {
				status: 400,
				body: JSON.stringify({ detail: 'Are you coming from the future?!' })
			};
		} else {
			throw e;
		}
	}
    */

	return {
		status: 200,
		headers: {
			'set-cookie': [
				cookie.serialize('token', jwt, {
					httpOnly: true,
					maxAge: 3600,
					sameSite: 'lax'
					// secure: true
				})
			]
		}
	};
};
