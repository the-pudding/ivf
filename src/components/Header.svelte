<script>
	// shadow, plain, line, bubble
	import wordmark from "$svg/wordmark-plain.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		height: var(--header-height);
		width: 100%;
		z-index: var(--z-top);
		pointer-events: none;
	}

	.wordmark {
		height: 100%;
		width: max-content;
		margin: 0 auto;
	}

	.wordmark a {
		height: 100%;
		padding: 1.25rem 0;
		border: none;
		display: block;
		color: var(--color-fg);
		pointer-events: all;
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(header .wordmark svg) {
		height: 100%;
		width: auto;
	}

	:global(header .wordmark svg path) {
		fill: rgba(209, 195, 227, 0.8);
	}
</style>
