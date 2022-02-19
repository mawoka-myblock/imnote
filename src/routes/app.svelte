<script context="module" lang="ts">
	export async function load({ session, fetch, url }) {
		const create = url.searchParams.get('create');
		console.log('SERVER', create);
		if (!session.authenticated) {
			return {
				status: 302,
				redirect: '/account/login'
			};
		} else {
			const res = await fetch(`${import.meta.env.VITE_BASE_ADDRESS}/api/v1/notes/getall`, {
				credentials: 'include'
				// headers: {
				// 	"cooki"
				// }
			});
			return {
				props: { notes: await res.json(), create: create === null ? false : true }
			};
		}
	}
</script>

<script lang="ts">
	export let notes: any;
	export let create: boolean;
	console.log(create);
	let overviewSelected = !create;
	import Overview from '$lib/components/Overview.svelte';
</script>

<div class="w-full h-full overflow-x-hidden">
	<div class="pb-16">
		{#if overviewSelected}
			<Overview bind:notes />
		{:else}
			{#await import('$lib/components/Create.svelte') then c}
				<svelte:component this={c.default} />
			{/await}
		{/if}
	</div>
	<ul class="flex border-b border-gray-100 bottom-0 fixed w-screen bg-white z-[999999999]">
		<li
			class="flex-1 cursor-pointer group"
			on:click={() => {
				overviewSelected = true;
			}}
		>
			<span class="relative block p-4">
				{#if overviewSelected}
					<span
						class="absolute inset-x-0 w-full h-px bg-green-600 -top-px hover:bg-gray-400 transition-all"
					/>
				{:else}
					<span
						class="absolute inset-x-0 w-full h-px group-hover:bg-gray-400 -top-px transition-all"
					/>
				{/if}

				<div
					class="flex items-center justify-center"
					class:text-green-600={overviewSelected}
					class:font-bold={overviewSelected}
				>
					<svg
						class="flex-shrink-0 w-5 h-5 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						class:text-green-600={overviewSelected}
						class:font-bold={overviewSelected}
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/></svg
					>

					<p
						class="ml-3 text-sm font-medium text-gray-900"
						class:text-green-600={overviewSelected}
						class:font-bold={overviewSelected}
					>
						Overview
					</p>
				</div>
			</span>
		</li>

		<li
			class="flex-1 cursor-pointer group transition-all"
			on:click={() => {
				overviewSelected = false;
			}}
		>
			<span class="relative block p-4">
				{#if !overviewSelected}
					<span
						class="absolute inset-x-0 w-full h-px bg-green-600 -top-px transition-all"
					/>
				{:else}
					<span
						class="absolute inset-x-0 w-full h-px group-hover:bg-gray-400 -top-px transition-all"
					/>
				{/if}
				<div class="flex items-center justify-center">
					<svg
						class="flex-shrink-0 w-5 h-5 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						class:text-green-600={!overviewSelected}
						class:font-bold={!overviewSelected}
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/></svg
					>

					<span
						class="ml-3 text-sm font-medium text-gray-900"
						class:text-green-600={!overviewSelected}
						class:font-bold={!overviewSelected}
					>
						Create
					</span>
				</div>
			</span>
		</li>
	</ul>
</div>
