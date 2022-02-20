import { deta } from '$lib/utils/clients';
import { SpaceService } from 'm3o/space';

export const download = async (id: string): Promise<Uint8Array> => {
	if (process.env.STORAGE_BACKEND === 'deta') {
		const drive = deta.Drive('imnote');
		const picture = await (await drive.get(id)).arrayBuffer();
		return new Uint8Array(picture);
	} else if (process.env.STORAGE_BACKEND === 'm3o') {
		const spaceService = new SpaceService(process.env.M3O_KEY);
		const rsp = await spaceService.read({
			name: id
		});
		const data = rsp.object.data;
		const buf = Buffer.from(data, 'base64');
		return new Uint8Array(buf);
		//return rsp.object.data
	} else {
		throw new Error('STORAGE BACKEND NOT FOUND!!!');
	}
};
