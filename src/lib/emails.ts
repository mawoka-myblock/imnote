import nodemailer from 'nodemailer';
import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import { prisma } from '$lib/utils/clients';

const getTransporter = async (): Promise<nodemailer.Transporter> => {
	let transporter: nodemailer.Transporter;
	if (import.meta.env.DEV) {
		const account = await nodemailer.createTestAccount();
		transporter = nodemailer.createTransport({
			host: account.smtp.host,
			port: account.smtp.port,
			secure: account.smtp.secure,
			auth: {
				user: account.user,
				pass: account.pass
			}
		});
	} else {
		transporter = nodemailer.createTransport({
			host: String(import.meta.env.VITE_EMAIL_HOST),
			port: import.meta.env.VITE_EMAIL_PORT,
			secure: import.meta.env.VITE_EMAIL_SECURE === 'true', // true for 465, false for other ports
			auth: {
				user: import.meta.env.VITE_EMAIL_AUTH_USER, // generated ethereal user
				pass: import.meta.env.VITE_EMAIL_AUTH_PASS // generated ethereal password
			}
		});
	}
	return transporter;
};

export const genRanHex = (size: number): string =>
	[...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const sendConfirmationEmail = async (
	email: string,
	verify_string: string
): Promise<boolean> => {
	const transporter = await getTransporter();
	console.log(import.meta.env.DEV);

	try {
		const info = await transporter.sendMail({
			from: String(import.meta.env.VITE_EMAIL_FROM),
			to: email,
			subject: 'Please confirm your account',
			text: `
            Hey ${email}!
            Please confirm your account by clicking on the following link: ${
				import.meta.env.VITE_BASE_ADDRESS
			}/confirm?code=${verify_string}
            `
		});
		if (import.meta.env.DEV) {
			console.log(info, import.meta.env.VITE_BASE_ADDRESS);
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		}
		return true;
	} catch (e) {
		console.error('Could not send email', e);
		return false;
	}
};

export const sendMagicLink = async (email: string): Promise<boolean> => {
	const transporter = await getTransporter();
	const user = await prisma.user.findFirst({
		where: { email: email }
	});
	console.log(user);
	if (user === null) {
		return false;
	}
	const key = randomBytes(16).toString('hex');
	const redis = new Redis(String(import.meta.env.VITE_REDIS_URL));
	await redis.set(key, email, 'ex', 900);
	const info = await transporter.sendMail({
		from: String(import.meta.env.VITE_EMAIL_FROM),
		to: email,
		subject: 'Please confirm your account',
		text: `
		Hey ${email}!
		You try to log in. If it is you, please click the following link and you're logged in automatically. Be careful, this link will only work for the next 15 minutes!: ${
			import.meta.env.VITE_BASE_ADDRESS
		}/ahoy?code=${key}
		`
	});
	if (import.meta.env.DEV) {
		console.log(info, import.meta.env.VITE_BASE_ADDRESS);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	}
	return true;
};
