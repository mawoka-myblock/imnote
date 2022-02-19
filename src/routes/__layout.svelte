<script>
	import '../app.css';
	import * as Sentry from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';

	Sentry.init({
		dsn: 'https://38da707ee523431d9c4638c4e8c8b886@o661934.ingest.sentry.io/6219725',
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0
	});
</script>

<slot />
