/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
	// interface Locals {}

	// interface Platform {}

	interface Session {
		authenticated: boolean;
		token: string | null;
		email: string | null;
	}

	// interface Stuff {}
}
