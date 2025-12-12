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
	let beatI = $state(0);
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

	let steps = $derived(beats.filter((d) => d.id === beatId));

	onMount(() => {
		pathEl = document.querySelector(`.${id}-path path`);
	});
</script>

<div id={`side-${id}`} class="side" class:active>
	{#if active}
		<div class={`controls ${id === "mom" ? "left" : "right"}`}>
			<strong>{id}</strong>
			<div>{beatId || "not started"}</div>
			<!-- <button onclick={() => (beatI = Math.max(0, beatI - 1))}>prev</button> -->
			<button onclick={() => (beatI = Math.min(allBeats.length - 1, beatI + 1))}
				>next</button
			>

			<button onclick={() => (id === "mom" ? (side = "baby") : (side = "mom"))}
				>switch sides</button
			>
		</div>
	{/if}

	{#if pathEl}
		{#each spriteIds as spriteId (spriteId)}
			<Sprite id={spriteId} sideId={id} {beatId} {steps} {pathEl} />
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

	#side-mom {
		left: 0;
	}

	#side-baby {
		right: 0;
	}

	.controls {
		position: absolute;
		top: 0;
		left: 50%;
		padding: 1rem;
	}
</style>
