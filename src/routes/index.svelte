<script context="module" lang="ts">
	export async function load({ session }) {
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/app'
			};
		}
		return {};
	}
</script>

<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />
