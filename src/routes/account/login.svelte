<script context="module" lang="ts">
	export async function load({ session }) {
		console.log(import.meta.env.VITE_BASE_ADDRESS);
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import { rememberme } from '$lib/utils/clientAuth';
	import { browser } from '$app/env';
	if (browser) {
		rememberme().then((res) => {
			if (res) {
				window.location.reload();
			}
		});
	}

	import tippy from 'sveltejs-tippy';
	let loginData = {
		email: '',
		password: ''
	};
	let emailEmpty = true;
	let responseData = {
		open: false,
		data: ''
	};

	$: emailEmpty = loginData.email === '';

	const login = async (): Promise<void> => {
		if (emailEmpty) {
			return;
		}
		const res = await fetch('/api/v1/login', {
			method: 'post',
			body: JSON.stringify({
				email: loginData.email,
				password: loginData.password === '' ? undefined : loginData.password
			})
		});
		if (res.status === 200) {
			responseData.data = loginData.password === '' ? 'magic' : 'password';
		} else if (res.status === 404) {
			responseData.data = '404';
		} else {
			responseData.data = 'error';
		}
		responseData.open = true;
	};
</script>

<div class="flex items-center justify-center h-screen px-4">
	<div>
		<div
			class="flex items-center justify-center p-4 text-green-700 border-2 border-current rounded-lg"
			role="alert"
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
				/></svg
			>

			<h3 class="ml-3 text-sm font-medium">
				Password isn't required, because you can login via a magic link!
			</h3>
		</div>
		<span class="p-4" />

		<div
			class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
		>
			<div class="px-6 py-4">
				<h2 class="text-3xl font-bold text-center text-gray-700 dark:text-white">ImNote</h2>

				<h3 class="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
					Welcome Back
				</h3>

				<p class="mt-1 text-center text-gray-500 dark:text-gray-400">
					Login or create account
				</p>

				<form on:submit|preventDefault={login}>
					<div class="w-full mt-4">
						<div class="dark:bg-gray-800 bg-white p-4 rounded-lg">
							<div class="relative bg-inherit w-full">
								<input
									id="username"
									bind:value={loginData.email}
									name="username"
									type="email"
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Email"
								/>
								<label
									for="username"
									class="absolute cursor-text left-0 -top-3 text-sm text-gray-700 dark:text-white bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
								>
									Email
								</label>
							</div>
						</div>
						<div class="dark:bg-gray-800 bg-white p-4 rounded-lg">
							<div
								class="relative bg-inherit w-full"
								use:tippy={{
									content: 'The password is optional!',
									placement: 'bottom'
								}}
							>
								<input
									id="username"
									name="username"
									type="password"
									bind:value={loginData.password}
									class="w-full peer bg-transparent h-10 rounded-lg text-gray-700 dark:text-white placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
									placeholder="Password"
								/>
								<label
									for="username"
									class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
								>
									Password
								</label>
							</div>
						</div>

						<div class="flex items-center justify-between mt-4">
							<a
								href="/account/reset-password"
								class="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
								>Forgot Password?</a
							>

							<button
								class="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
								disabled={emailEmpty}
								class:cursor-not-allowed={emailEmpty}
								class:opacity-50={emailEmpty}
								type="submit">Login</button
							>
						</div>
					</div>
				</form>
			</div>

			<div
				class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700"
			>
				<span class="text-sm text-gray-600 dark:text-gray-200"
					>Don't have an account?
				</span>

				<a
					href="/account/register"
					class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
					>Register</a
				>
			</div>
		</div>
	</div>
</div>

<div
	class="fixed z-10 inset-0 overflow-y-auto"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
	class:hidden={!responseData.open}
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
			class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
		>
			<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div class="sm:flex sm:items-start">
					<div
						class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
					>
						<!-- Heroicon name: outline/exclamation -->
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
						{/if}
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
							{#if responseData.data === 'magic'}
								Login Succeded! Check your mailbox!
							{:else if responseData.data === 'password'}
								Login Succeded!
							{:else if responseData.data === '404'}
								Wrong email or password!
							{:else if responseData.data === 'error'}
								unexpected error!
							{:else}
								You stupid Mawoka!
							{/if}
						</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								{#if responseData.data === 'magic'}
									Please check your mailbox, since you should have received a
									Mail, with a link you can click to login.
								{:else if responseData.data === 'password'}
									You've successfully logged in!
								{:else if responseData.data === '404'}
									Please make sure that your password and your email are correct!
								{:else if responseData.data === 'error'}
									There was the good old unexpected error!
								{:else}
									You stupid Mawoka!
								{/if}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button
					type="button"
					on:click={() => {
						responseData.open = false;
						if (responseData.data === 'magic' || responseData.data === 'password') {
							window.location.reload();
						}
					}}
					class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
