<script>
	// shadow, plain, line, bubble
	import wordmark from "$svg/wordmark-shadow.svg";
	import dollarSign from "$svg/tip.svg";
	import { projectState } from "$runes/misc.svelte.js";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>
	{#if !projectState.started}
		<a class="tip" href="https://buy.stripe.com/aFa3cu96qapa4vOfaL4Vy09" aria-label="Support this project" target="_blank">
			<span>Tip us!</span>
			<span class="img">{@html dollarSign}</span>
		</a>
	{/if}
</header>

<style>
	header {
		position: fixed;
		top: 0;
		height: var(--header-height);
		width: 100%;
		z-index: 99;
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

	:global(header .wordmark svg .text path) {
		fill: var(--ivf-x-light-purple);
	}

	:global(header .wordmark svg .shadow path) {
		fill: rgba(0, 0, 0, 0.8);
	}

	:global(a .tip) {
		text-decoration: none !important;
		border: none;
	}

	.tip {
		z-index: 1000;
		position: fixed;
		right: 1rem;
		top: 1rem;
		border-bottom: 2px solid var(--ivf-x-light-purple);
		color: var(--ivf-x-light-purple);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		gap: 0.25rem;
		padding: 0.25rem;
		font-family: var(--sans);
		font-weight: 700;
		font-size: var(--12px);
		pointer-events: all;
	}

	.tip span {
		text-decoration: none;
	}

	.tip .img {
		transition: all calc(var(--1s) * 0.3) ease;
		perspective: 1000px;
        transform-style: preserve-3d;
        display: inline-block;
	}

	.tip:hover .img {
		animation: coin-spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	:global(.tip span svg) {
		width: 16px;
		height: 16px;
		margin-bottom: 2px;
	}

	:global(.tip span svg path) {
		fill: var(--ivf-x-light-purple);
	}

	@keyframes coin-spin {
        from {
            transform: translateY(-4px) rotateY(0deg);
        }
        to {
            /* A full 360-degree flip */
            transform: translateY(-4px) rotateY(360deg);
        }
    }
</style>
