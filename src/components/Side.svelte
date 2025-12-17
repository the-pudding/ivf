<script>
	import Sprite from "$components/Sprite.svelte";
	import { scenery } from "$utils/scenery.js";
	import { onMount } from "svelte";
	import _ from "lodash";

	let { id, beats, active, side = $bindable() } = $props();

	const allBeats = Object.entries(_.groupBy(beats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	);
	const allScenery = allBeats.flatMap((beat) =>
		(beat.steps ?? [])
			.filter((step) => step.scenery && step.sceneryAction)
			.map((step) => ({
				scenery: step.scenery,
				sceneryAction: step.sceneryAction
			}))
	);
	const sceneryState = new Map(
		Array.from(new Set(allScenery.map((d) => d.scenery))).map((id) => [
			id,
			false
		])
	);

	let spritePosition = $state("below");
	let pathEl = $state();
	let beatI = $state(0);
	let direction = $state("forward");
	let beatId = $derived(allBeats[beatI].id);
	let spriteIds = $derived(
		beats
			.filter((d) => d.id === beatId)
			.reduce((acc, cur, i) => {
				if (cur.dupe) {
					acc.push(`${cur.sprite}-${cur.dupe}`);
				} else if (!acc.includes(cur.sprite)) {
					acc.push(cur.sprite);
				}
				return acc;
			}, [])
	);

	let steps = $derived(
		direction === "backward"
			? [beats.filter((d) => d.id === beatId).at(-1)]
			: beats.filter((d) => d.id === beatId)
	);

	onMount(() => {
		pathEl = document.querySelector(`.${id}-path path`);

		for (const sceneryId in scenery) {
			const els = document.querySelectorAll(`.Foreground .${sceneryId}`);
			const resetter = scenery[sceneryId].reset;
			if (els && resetter) resetter(els);
		}
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (active) {
			if (e.key === "ArrowRight") {
				direction = "forward";
				beatI = Math.min(allBeats.length - 1, beatI + 1);
			} else if (e.key === "ArrowLeft") {
				direction = "backward";
				beatI = Math.max(0, beatI - 1);
			}
		}
	}}
/>

<div id={`side-${id}`} class={`side ${spritePosition}`} class:active>
	{#if pathEl}
		{#each spriteIds as spriteId (spriteId)}
			<Sprite
				id={spriteId}
				sideId={id}
				{allBeats}
				{beatId}
				steps={steps.filter((d) => d.sprite === spriteId)}
				{pathEl}
				bind:spritePosition
				{sceneryState}
			/>
		{/each}
	{/if}
</div>

<style>
	.side {
		position: absolute;
		top: 0;
		width: 50%;
		height: 100%;
	}

	.side.below {
		z-index: 1;
	}

	.side.above {
		z-index: 3;
	}

	#side-mom {
		left: 0;
	}

	#side-baby {
		right: 0;
	}
</style>
