<script>
	import Sprite from "$components/Sprite.svelte";
	import { scenery } from "$utils/scenery.js";
	import { onMount } from "svelte";
	import _ from "lodash";
	import { browser } from "$app/environment";

	let {
		id,
		beats,
		active,
		beatI,
		direction,
		transform = $bindable()
	} = $props();

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
	let beatId = $derived(active ? allBeats[beatI].id : allBeats[0].id);
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

	// // TODO: fix
	// let endY = $derived.by(() => {
	// 	if (!browser) return 0;

	// 	const endSpot = steps.at(-1).endSpot;
	// 	const el = document.querySelector(`.${id} circle.${endSpot}`);

	// 	if (!el) return 0;

	// 	const rect = el.getBoundingClientRect();
	// 	return rect.top + rect.height / 2;
	// });

	// $effect(() => {
	// 	const vh = window.innerHeight;
	// 	const totalHeight = document
	// 		.querySelector(".world-view")
	// 		?.getBoundingClientRect().height;

	// 	if (endY > vh * 0.8) {
	// 		const currentTranslateY = parseFloat(
	// 			transform.match(/translate\(0,\s*(-?\d+\.?\d*)px\)/)?.[1] || "0"
	// 		);
	// 		transform = `translate(0, ${(totalHeight * 0.5 - endY) * -1}px)`;
	// 	}
	// });

	onMount(() => {
		pathEl = document.querySelector(`.${id}-path path`);

		for (const sceneryId in scenery) {
			const els = document.querySelectorAll(`.Foreground .${sceneryId}`);
			const resetter = scenery[sceneryId].reset;
			if (els && resetter) resetter(els);
		}
	});
</script>

<div
	id={`side-${id}`}
	class="side"
	class:active
	class:above={spritePosition === "above" || !active}
	class:below={spritePosition === "below" && active}
>
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

	<div class="fade" class:visible={!active}></div>
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

	.fade {
		height: 100%;
		width: 100%;
		background: var(--color-bg);
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.3);
	}

	.fade.visible {
		opacity: 0.9;
	}
</style>
