<script>
	import { fade } from "svelte/transition";
	import copy from "$data/copy.json";

	let { side, beatI } = $props();

	let content = $derived(
		beatI === 0 ? null : (copy.beats?.[side]?.[beatI - 1]?.text ?? "")
	);
</script>

{#if content}
	<div class="copy" class:left={side === "baby"} class:right={side === "mom"}>
		{#if Array.isArray(content)}
			{#each content as { value }, i (value)}
				<p class="multi" in:fade={{ duration: 300, delay: i * 1000 }}>
					{@html value}
				</p>
			{/each}
		{:else}
			{#key content}
				<p in:fade={{ duration: 300 }}>{@html content}</p>
			{/key}
		{/if}
	</div>
{/if}

<style>
	.copy {
		position: absolute;
		width: 40%;
		max-width: 500px;
		z-index: 4;
		top: 50%;
		transform: translate(0, -50%);
	}

	.copy p {
		color: var(--color-bg);
		background: rgba(249, 244, 255, 0.95);
		color: var(--color-bg);
		border: 2px solid #4c5c8f;
		border-radius: 8px;
		padding: 1rem;
	}

	.left p.multi:nth-of-type(1) {
		transform: translate(10%, 0);
	}

	.left p.multi:nth-of-type(3) {
		transform: translate(5%, 0);
	}

	.right p.multi:nth-of-type(1) {
		transform: translate(-10%, 0);
	}

	.right p.multi:nth-of-type(3) {
		transform: translate(-5%, 0);
	}

	.copy.left {
		left: 2rem;
	}

	.copy.right {
		right: 2rem;
	}
</style>
