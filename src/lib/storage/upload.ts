import { deta, } from '$lib/utils/clients';
// import { SpaceService } from 'm3o/space';
import cuid from 'cuid';

export const upload = async (data: ArrayBuffer): Promise<string> => {
	const id = cuid();
	if (process.env.STORAGE_BACKEND === 'deta') {
		const drive = deta.Drive('imnote');
		const data_buf: Buffer = Buffer.from(data);
		await drive.put(id, { data: data_buf });

	} else if (process.env.STORAGE_BACKEND === 'm3o') {
		// const spaceService = new SpaceService(process.env.M3O_KEY);
		// await spaceService.create({
		// 	name: id,
		// 	object: Buffer.from(new Uint8Array(data)).toString('base64'),
		// 	visibility: 'private'
		// });
		return
	} else {
		throw new Error('STORAGE BACKEND NOT FOUND!!!');
	}
	return id;
};
