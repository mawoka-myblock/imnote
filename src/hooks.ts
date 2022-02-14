import * as cookie from 'cookie';

export async function handle({ event, resolve }) {
	const sth = event.request.headers;
	console.log(sth.get('cookie'));
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');

	event.locals.user = cookies.user;
	event.locals.token = cookies.token;
	event.locals.authenticated = !!cookies.token;

	const response = await resolve(event);

	return response;
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event) {
	let localuser: string;
	try {
		localuser = event.locals.user ? JSON.parse(event.locals.user) : null;
	} catch (e) {
		if (e instanceof SyntaxError) {
			return { authenticated: false, token: null, user: null };
		} else {
			throw e;
		}
	}
	return {
		authenticated: event.locals.authenticated,
		token: event.locals.token,
		user: localuser
	};
}
