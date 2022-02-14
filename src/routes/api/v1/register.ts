import { v, compile, ValidationError } from 'suretype';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '$lib/passwords';
import { sendConfirmationEmail } from '$lib/emails';

const CreateUser = v.object({
	email: v.string().required(),
	password: v.string().required()
});

interface CreateUser {
	email: string;
	password: string;
}

/** @type {import('@sveltejs/kit').Load} */
export async function post({ request }) {
	let user: CreateUser;
	try {
		user = compile(CreateUser, { ensure: true })(await request.json());
	} catch (e) {
		if (e instanceof ValidationError) {
			return {
				status: 400
			};
		} else {
			throw e;
		}
	}
	const prisma = new PrismaClient();
	if (
		(await prisma.user.findFirst({
			where: { email: { equals: user.email } }
		})) !== null
	) {
		return {
			status: 409,
			body: JSON.stringify({ detail: 'A user with this email already exists.' })
		};
	} else {
		const res = await prisma.user.create({
			data: { email: user.email, password: await hashPassword(user.password) }
		});
		console.log(res);
		await sendConfirmationEmail(user.email, res.verify_key);
	}
	prisma.$disconnect;
	return {
		status: 200
	};
}
