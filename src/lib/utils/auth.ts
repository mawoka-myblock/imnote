import jwt from 'jsonwebtoken';

export const generateJWT = (email: string): string => {
	return jwt.sign({ email: email }, String(import.meta.env.VITE_SECRET_KEY), {
		algorithm: 'HS512',
		expiresIn: 3600
	});
};

export const verifyJWT = (token: string): any => {
	const res = jwt.verify(token, String(import.meta.env.VITE_SECRET_KEY), {
		algorithms: ['HS512']
	});
	console.log(res)
};
