<script>
	import { fade } from "svelte/transition";
	import parentSvg from "$svg/parent-preview.svg";
	import babySvg from "$svg/baby-preview.svg";
	import copy from "$data/copy.json";

	let { side = $bindable(), beatI } = $props();

	let content = $derived(
		beatI === 0 ? null : (copy.beats?.[side]?.[beatI - 1]?.text ?? "")
	);
</script>

<div class="wrapper">
	<div class="switch mom">
		<span class="switch-text" class:visible={side === "baby"}>Switch to</span>
		<button onclick={() => (side = "mom")} class:inactive={side === "baby"}>
			<span>{@html parentSvg}</span>
			Parent
		</button>
	</div>

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

	<div class="switch baby">
		<span class="switch-text" class:visible={side === "mom"}>Switch to</span>
		<button onclick={() => (side = "baby")} class:inactive={side === "mom"}>
			Baby
			<span>{@html babySvg}</span>
		</button>
	</div>
</div>

<style>
	.wrapper {
		position: absolute;
		z-index: 4;
		width: 100%;
		height: 100%;
		padding: 0 1rem;
		display: grid;
		grid-template-columns: auto 1fr 1fr auto;
		align-items: center;
		gap: 1rem;
	}

	.switch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-weight: bold;
		color: #f7e3bd;
	}

	.switch.mom {
		grid-column: 1;
	}

	.switch.baby {
		grid-column: 4;
	}

	.switch-text {
		opacity: 0;
		font-size: var(--14px);
	}

	.switch-text.visible {
		opacity: 1;
	}

	.copy {
		max-width: 500px;
	}

	.copy.left {
		grid-column: 2;
	}

	.copy.right {
		grid-column: 3;
	}

	.copy p {
		color: var(--color-bg);
		background: rgba(249, 244, 255, 0.95);
		color: var(--color-bg);
		border: 2px solid #4c5c8f;
		border-radius: 8px;
		width: fit-content;
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

	button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	button span {
		width: 20px;
		height: 20px;
	}

	button:hover {
		background: var(--color-button-bg);
	}

	button.inactive {
		font-weight: normal;
		border: 2px solid #4c5c8f;
		color: #4c5c8f;
		background: none;
	}

	button.inactive:hover {
		background: var(--color-gray-900);
	}
</style>
