<script context="module" lang="ts">
	export async function load({ session, params, fetch }) {
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/account/login'
			};
		} else {
			const res = await fetch(
				`${import.meta.env.VITE_BASE_ADDRESS}/api/v1/notes/getone?note=${params.slug}`,
				{
					credentials: 'include'
					// headers: {
					// 	"cooki"
					// }
				}
			);
			if (res.status === 404) {
				const error = new Error(`The note with ID ${params.slug} was not found`);

				return {
					status: 404,
					error
				};
			}
			if (res.status === 200) {
				return {
					props: { note: await res.json() }
				};
			} else {
				return {
					status: 500
				};
			}
		}
	}
</script>

<script lang="ts">
	import '@uppy/core/dist/style.css';
	import '@uppy/dashboard/dist/style.css';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import { Autoplay, Pagination } from 'swiper';
	import 'swiper/css';
	let images: Array<string>;
	let complete: boolean;
	interface Note {
		id: string;
		userEmail: string;
		description: string;
		title: string;
		createdAt: string;
		updatedAt: string;
		tags: string[];
		pictures: Picture[];
	}
	interface Picture {
		userEmail: string;
		id: string;
		noteId: string;
		createdAt: string;
	}
	export let note: Note;
	let inputData = {
		description: note.description,
		title: note.title
	};

	let change = false;
	let NewuploadOpen = false;
	let loading = false;
	$: {
		change = inputData.description !== note.description || inputData.title !== note.title;
	}

	$: if (complete) {
		submit().then();
	}

	const submit = async () => {
		const res = await fetch('/api/v1/notes/update', {
			method: 'POST',
			body: JSON.stringify({
				id: note.id,
				pictures: images
			})
		});
		if (res.status === 200) {
			window.location.reload();
		} else if (res.status === 403) {
			window.location.reload();
		} else if (res.status === 404) {
			console.error("Pictures weren't found, which should be impossible!", await res.json());
		} else {
			console.error(await res.json());
		}
	};

	const saveChanges = async () => {
		await fetch('/api/v1/notes/update', {
			method: 'POST',
			body: JSON.stringify({
				id: note.id,
				title: inputData.title === note.title ? undefined : inputData.title,
				description:
					inputData.description === note.description ? undefined : inputData.description
			})
		});
	};
</script>

<div>
	<div class="flex justify-center pt-4">
		<input
			class="text-3xl text-center py-8 h-8 border-2 border-gray-200 rounded-lg"
			bind:value={inputData.title}
			class:border-green-600={inputData.title !== note.title}
		/>
	</div>
	<div>
		<Swiper
			modules={[Autoplay, Pagination]}
			centeredSlides={true}
			loop={true}
			slidesPerView="auto"
			autoplay={{
				delay: 2500,
				disableOnInteraction: false
			}}
		>
			{#each note.pictures as picture}
				<SwiperSlide>
					<img
						loading="lazy"
						class="object-cover h-56"
						src="/api/v1/images/get?id={picture.id}"
						alt=""
					/>
				</SwiperSlide>
			{/each}
		</Swiper>
	</div>
	<div class=" bg-white pt-4 rounded-lg flex justify-center">
		<div class="w-5/6 sm:w-11/12 space-y-1 justify-center">
			<label for="basic" class="text-xs font-medium text-gray-500"> Description </label>
			<textarea
				rows="4"
				bind:value={inputData.description}
				placeholder="Enter your description here"
				class="block w-full border-2 border-gray-200 rounded-lg text-sm transition disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
				class:border-green-600={inputData.description !== note.description}
			/>
		</div>
	</div>

	<div class="flex justify-center pt-8 flex-col">
		<button
			on:click={saveChanges}
			disabled={!change}
			class="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>{#if loading}
				<svg class="h-4 w-4 animate-spin" viewBox="3 3 18 18">
					<path
						class="fill-blue-800"
						d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
					/>
					<path
						class="fill-blue-100"
						d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
					/>
				</svg>
			{:else}
				Save
			{/if}</button
		>

		<button
			on:click={() => {
				NewuploadOpen = true;
			}}
			class="px-4 py-2 my-8 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>Add Image</button
		>
	</div>
</div>

<div
	class="fixed z-10 inset-0 overflow-y-auto"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
	class:hidden={!NewuploadOpen}
>
	<div
		class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
	>
		<!--
        Background overlay, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			aria-hidden="true"
		/>

		<!-- This element is to trick the browser into centering the modal contents. -->
		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
			>&#8203;</span
		>

		<!--
        Modal panel, show/hide based on modal state.
  
        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
		<div
			class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
		>
			<div class="bg-whitept-5 pb-4 sm:p-6 sm:pb-4">
				<div class="sm:flex sm:items-start">
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
							a
						</h3>
						<div class="mt-2">
							{#await import('$lib/components/create/ImageUploader.svelte') then c}
								<div class="max-w-full">
									<svelte:component this={c.default} bind:images bind:complete />
								</div>
							{/await}
						</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button
					type="button"
					on:click={() => {
						NewuploadOpen = false;
					}}
					class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
