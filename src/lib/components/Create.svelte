<script lang="ts">
	import ImageUploader from './create/ImageUploader.svelte';
	import '@uppy/core/dist/style.css';
	import '@uppy/dashboard/dist/style.css';
	let images: Array<string>;
	let inputData = {
		title: '',
		description: ''
	};
	let inputValid = false;
	$: inputValid = inputData.title !== '';
	$: console.log(inputValid);
</script>

<h1>HELLO CREATE</h1>
<div class="flex justify-center">
	<form>
		<div class=" bg-white pt-4 rounded-lg flex justify-center">
			<div class="w-5/6 sm:w-11/12 space-y-0.5">
				<label for="basic" class="text-xs font-medium text-gray-500"> Title </label>
				<input
					bind:value={inputData.title}
					type="text"
					placeholder="Enter the title"
					class="block w-screen rounded-md text-sm transition focus:border-green-600 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
					class:bg-red-300={!inputValid}
				/>
			</div>
		</div>
		<div class=" bg-white pt-4 rounded-lg flex justify-center">
			<div class="w-5/6 sm:w-11/12 space-y-1">
				<label for="basic" class="text-xs font-medium text-gray-500"> Description </label>
				<textarea
					rows="4"
					bind:value={inputData.description}
					placeholder="Enter your description here"
					class="block w-screen rounded-md border-gray-200 text-sm transition focus:border-green-600 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
				/>
			</div>
		</div>
		<div
			class="bg-white mt-4 rounded-lg flex justify-center pb-40 transition"
			class:pointer-events-none={!inputValid}
			class:opacity-50={!inputValid}
		>
			<div class="w-screen flex justify-center">
				<ImageUploader bind:images />
			</div>
		</div>
	</form>
</div>
