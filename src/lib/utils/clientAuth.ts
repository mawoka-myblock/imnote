import Cookies from 'js-cookie';

export const rememberme = async (): Promise<boolean> => {
	const cookies = Cookies.get('remember');
	console.log(cookies);
	if (cookies === undefined) {
		return false;
	}
	let result: boolean;
	const res = await fetch('/api/v1/getAccessToken');
	if (res.status === 200) {
		result = true;
	} else {
		result = false;
	}

	return result;
};
