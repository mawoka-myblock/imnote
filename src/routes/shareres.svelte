<script context="module" lang="ts">
	export async function load({ session, url }) {
		const create = url.searchParams.get('image');
		console.log('SERVER', create);
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/account/login'
			};
		} else {
			return {
				props: { image: create }
			};
		}
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	export let image: string;
	let inputData = {
		title: '',
		description: ''
	};
	let isLoading = false;
	let responseModelOpen = false;
	let inputValid = false;
	$: inputValid = inputData.title !== '';
	const submit = async () => {
		isLoading = true;
		const res = await fetch('/api/v1/notes/create', {
			method: 'POST',
			body: JSON.stringify({
				description: inputData.description === '' ? undefined : inputData.description,
				title: inputData.title,
				pictures: [image],
				tags: []
			})
		});
		if (res.status === 200) {
			responseModelOpen = true;
		} else if (res.status === 403) {
			window.location.reload();
		} else if (res.status === 404) {
			console.error("Pictures weren't found, which should be impossible!", await res.json());
		} else {
			console.error(await res.json());
		}
		isLoading = false;
	};
</script>

<div class="flex justify-center w-screen overflow-x-hidden">
	<form class="flex justify-center flex-col" on:submit|preventDefault={submit}>
		<div class=" bg-white pt-4 rounded-lg flex justify-center">
			<div class="space-y-0.5">
				<label for="basic" class="text-xs font-medium text-gray-500"> Title </label>
				<input
					bind:value={inputData.title}
					type="text"
					placeholder="Enter the title"
					class="block w-fit rounded-md text-sm transition focus:border-green-600 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
					class:bg-red-300={!inputValid}
				/>
			</div>
		</div>
		<div class=" bg-white pt-4 rounded-lg flex justify-center">
			<div class="space-y-1 justify-center">
				<label for="basic" class="text-xs font-medium text-gray-500"> Description </label>
				<textarea
					rows="4"
					bind:value={inputData.description}
					placeholder="Enter your description here"
					class="block w-fit rounded-md border-gray-200 text-sm transition focus:border-green-600 focus:ring-green-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
				/>
			</div>
		</div>
		<button
			class="mt-4 mx-2 px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-center justify-center flex"
			disabled={!inputValid}
			type="submit"
		>
			{#if isLoading}
				<svg class="h-4 animate-spin text-center justify-self-center" viewBox="3 3 18 18">
					<path
						class="fill-green-600"
						d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
					/>
					<path
						class="fill-blue-100"
						d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
					/>
				</svg>
			{:else}
				Create
			{/if}
		</button>
	</form>
</div>

<div
	class="fixed z-[9999999999] inset-0 overflow-y-auto"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
	class:hidden={!responseModelOpen}
>
	<div
		class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
	>
		<div
			class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
			aria-hidden="true"
		/>

		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
			>&#8203;</span
		>
		<div
			class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
		>
			<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div class="sm:flex sm:items-start">
					<div
						class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
					>
						<!-- Heroicon name: outline/exclamation -->

						<!--
						{#if responseData.data === '404' || responseData.data === 'error'}
							<svg
								class="h-6 w-6 text-red-600"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						{:else}
						-->
						<svg
							class="w-6 h-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<!--
						{/if}
						-->
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
							Success!
						</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								You've successfully created your note!
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse z-0">
				<button
					type="button"
					on:click={() => {
						responseModelOpen = false;
						goto('/app');
					}}
					class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
