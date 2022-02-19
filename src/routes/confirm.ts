import { prisma } from "$lib/utils/clients";
export const get = async ({ url }) => {
	const code = url.searchParams.get('code');
	if (code === null) {
		return {
			status: 404
		};
	} else {
		const res = await prisma.user.updateMany({
			where: { verify_key: code, verified: false },
			data: { verified: true }
		});
		console.log(res);
		if (res.count === 0) {
			return {
				status: 404
			};
		} else {
			return {
				status: 302,
				headers: { Location: `/email-success` }
			};
		}
	}

	return {
		status: 200
	};
};
