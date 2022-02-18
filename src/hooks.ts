import * as cookie from 'cookie';
import { verifyJWT } from '$lib/utils/auth';

export async function handle({ event, resolve }) {
	// const sth = event.request.headers;
	// console.log(sth.get('cookie'));
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	event.locals.token = cookies.token;

	const response = await resolve(event);

	return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	let localuser = verifyJWT(event.locals.token);
	let authenticated = true;
	if (typeof localuser === 'string') {
		authenticated = false;
		localuser = null;
	}
	return {
		authenticated: authenticated,
		token: event.locals.token,
		email: localuser
	};
}
