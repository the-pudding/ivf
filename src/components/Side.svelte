<script>
	import Sprite from "$components/Sprite.svelte";
	import { scenery } from "$utils/scenery.js";
	import { onMount } from "svelte";
	import _ from "lodash";

	let { id, beats, active, beatI, direction, camera, worldW, worldH } =
		$props();

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
	const sceneryState = {};
	for (const { scenery, sceneryAction } of allScenery) {
		sceneryState[scenery] ??= {};
		sceneryState[scenery][sceneryAction] ??= false;
	}

	let spritePosition = $state("below");
	let pathEl = $state();
	let beatId = $derived(active ? allBeats[beatI].id : allBeats[0].id);

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

<div
	id={`side-${id}`}
	class="side"
	class:active
	class:above={spritePosition === "above" || !active}
	class:below={spritePosition === "below" && active}
>
	{#if pathEl}
		<Sprite
			{id}
			{allBeats}
			{beatId}
			{steps}
			{pathEl}
			bind:spritePosition
			{sceneryState}
			{active}
			{camera}
			{worldW}
			{worldH}
		/>
	{/if}
</div>

<style>
	.side {
		position: absolute;
		top: 0;
		width: 50%;
		height: 100%;
		opacity: 0;
		transition: opacity 1s ease-in-out;
	}

	.active {
		opacity: 1;
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
