<script>
	import Sprite from "$components/Sprite.svelte";
	import { onMount } from "svelte";
	import beats from "$data/beats.csv";
	import _ from "lodash";

	let { id } = $props();

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

<div class={`side-${id}`}>
	<div class="controls">
		<strong>{beatId || "not started"}</strong>
		<br />
		<button onclick={() => (beatI = Math.max(0, beatI - 1))}>prev</button>
		<button onclick={() => (beatI = Math.min(allBeats.length - 1, beatI + 1))}
			>next</button
		>
	</div>

	{#each spriteIds as id (id)}
		<Sprite {id} {steps} {pathEl} {pathLength} />
	{/each}
</div>

<style>
	.controls {
		position: absolute;
		top: 0;
		left: 50%;
	}
</style>
