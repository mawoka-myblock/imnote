<script lang="ts">
	import { Dashboard } from '@uppy/svelte';
	import XHRUpload from '@uppy/xhr-upload';
	import Compressor from '@uppy/compressor';
	import Uppy from '@uppy/core';
	export let images: Array<string> = [];
	export let complete = false;
	const uppy = new Uppy()
		.use(XHRUpload, {
			endpoint: '/api/v1/images/upload',
			formData: false,
			getResponseData: (responseText) => {
				return responseText;
			}
		})
		.use(Compressor);
	uppy.on('upload-success', (file, response) => {
		images.push(response.body);
		console.log(response.body, 'BODY');
	});
	uppy.on('complete', () => {
		complete = true;
	});
</script>

<div class="w-screen">
	<Dashboard {uppy} props={{ inline: true }} />
</div>
