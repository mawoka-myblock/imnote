import Cookies from "js-cookie";

export const rememberme = (): boolean => {
	const cookies = Cookies.get('remember');
    console.log(cookies)
	if (cookies === undefined) {
		return false;
	}
    let result: boolean
	fetch('/api/v1/getAccessToken').then((res) => {
		if (res.status === 200) {
			result = true;
		} else {
			result=  false;
		}
	});
    return result
};