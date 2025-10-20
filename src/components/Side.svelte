<script>
	import Sprite from "$components/Sprite.svelte";
	import { onMount } from "svelte";
	import _ from "lodash";

	let { id, beats, active, side = $bindable() } = $props();

	const allBeats = Object.entries(_.groupBy(beats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	);

	let pathEl = $state();
	let pathLength = $state(0);

	let beatI = $state(0);
	let beatId = $derived(allBeats[beatI].id);
	let spriteIds = $derived([
		...new Set(beats.filter((d) => d.id === beatId).map((d) => d.sprite))
	]);
	let steps = $derived(beats.filter((d) => d.id === beatId));

	onMount(() => {
		pathEl = document.querySelector(`#${id}-path path`);
		pathLength = pathEl.getTotalLength();
	});
</script>

<div
	class={`bg ${id === "mom" ? "left" : "right"}`}
	class:visible={!active}
	onclick={() => (side = id)}
></div>

<div class={`side-${id}`}>
	{#if active}
		<div class={`controls ${id === "mom" ? "left" : "right"}`}>
			<strong>{id}</strong>
			<div>{beatId || "not started"}</div>
			<button onclick={() => (beatI = Math.max(0, beatI - 1))}>prev</button>
			<button onclick={() => (beatI = Math.min(allBeats.length - 1, beatI + 1))}
				>next</button
			>
		</div>
	{/if}

	{#if pathEl}
		{#each spriteIds as id (id)}
			<Sprite {id} {steps} {pathEl} {pathLength} />
		{/each}
	{/if}
</div>

<style>
	.controls {
		position: absolute;
		top: 0;
		left: 50%;
		padding: 1rem;
	}

	.controls.left {
		transform: translate(-100%, 0);
	}

	.bg {
		background: var(--color-gray-500);
		opacity: 0;
		height: 100%;
		position: absolute;
		top: 0;
		width: 50%;
		pointer-events: none;
	}

	.bg.visible {
		opacity: 0.8;
		pointer-events: all;
	}

	.bg:hover {
		opacity: 0.9;
		cursor: pointer;
	}

	.bg.left {
		left: 0;
	}

	.bg.right {
		right: 0;
	}
</style>
