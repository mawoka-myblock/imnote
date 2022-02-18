import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { v, compile, ValidationError } from 'suretype';

export const generateJWT = (email: string): string => {
	return jwt.sign({ email: email }, String(import.meta.env.VITE_SECRET_KEY), {
		algorithm: 'HS512',
		expiresIn: 3600
	});
};

export const verifyJWT = (token: string): jwt.JwtPayload | string => {
	let res;
	try {
		res = jwt.verify(token, String(import.meta.env.VITE_SECRET_KEY), {
			algorithms: ['HS512']
		});
	} catch (e) {
		return 'invalid token';
	}
	return res;
};

export interface CookiesInterface {
	token: string;
}

const Cookies = v.object({
	token: v.string().required()
});

export const analyzeCookies = (request: Request): CookiesInterface | boolean => {
	if (request.headers.get('cookie') === null) {
		return false;
	}
	const cookies = cookie.parse(request.headers.get('cookie') || '');
	try {
		return compile(Cookies, { ensure: true })(cookies);
	} catch (e) {
		console.log(e, cookies);
		if (e instanceof ValidationError) {
			return false;
		} else {
			throw e;
		}
	}
};


