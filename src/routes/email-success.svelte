<script context="module" lang="ts">
	export async function load({ session }) {
		if (session.authenticated) {
			return {
				status: 302,
				redirect: '/app'
			};
		} else {
			return {
				status: 302,
				redirect: '/account/login'
			};
		}
	}
</script>
