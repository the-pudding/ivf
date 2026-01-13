<script>
	import Side from "$components/Side.svelte";
	import worldSvg from "$svg/world.svg";
	import foregroundSvg from "$svg/world-foreground.svg";
	import maskSvg from "$svg/world-mask.svg";
	import momBeats from "$data/beats-mom.csv";
	import babyBeats from "$data/beats-baby.csv";
	import _ from "lodash";
	import copy from "$data/copy.json";

	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let side = $state("mom");
	let beatI = $state(0);
	let beatId = $derived(
		Object.entries(_.groupBy(side === "mom" ? momBeats : babyBeats, "id")).map(
			([id, steps]) => ({
				id,
				steps
			})
		)[beatI].id
	);
	let direction = $state("forward");
	let transform = $state("translate(0, 0)");
	let text = $derived(copy.beats?.[side]?.[beatI]?.text ?? "");

	$inspect({ transform });

	$effect(() => {
		const camera = document.querySelector(".main");
		const world = document.querySelector(".world-view");

		if (!camera || !world) return;

		const cameraHeight = camera.clientHeight;
		const worldHeight = world.scrollHeight;
		const maxCameraY = Math.max(0, worldHeight - cameraHeight);
		const beatIncrement = maxCameraY / numBeats;

		let nextCameraY = beatI * beatIncrement;

		const steps =
			side === "mom"
				? momBeats.filter((d) => d.id === beatId)
				: babyBeats.filter((d) => d.id === beatId);

		const endSpot = steps.at(-1).endSpot;
		const el = document.querySelector(`.${side} circle.${endSpot}`);

		if (el) {
			const elRect = el.getBoundingClientRect();
			const camRect = camera.getBoundingClientRect();

			// element below view
			if (elRect.bottom > camRect.bottom) {
				nextCameraY += elRect.bottom - camRect.bottom;
			}

			// element above view
			if (elRect.top < camRect.top) {
				nextCameraY -= camRect.top - elRect.top;
			}
		}

		// clamp to world bounds
		nextCameraY = Math.max(0, Math.min(nextCameraY, maxCameraY));

		transform = `translate(0, ${-nextCameraY}px)`;
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "ArrowDown") {
			direction = "forward";
			beatI = Math.min(numBeats - 1, beatI + 1);
		} else if (e.key === "ArrowUp") {
			direction = "backward";
			beatI = Math.max(0, beatI - 1);
		} else if (e.key === "ArrowLeft") {
			side = "mom";
		} else if (e.key === "ArrowRight") {
			side = "baby";
		}
	}}
/>

<div class="main">
	<div class="world-view" style:transform>
		{@html worldSvg}

		<div class="foreground">
			{@html foregroundSvg}
		</div>

		<div class="mask">
			{@html maskSvg}
		</div>

		<Side
			id="mom"
			beats={momBeats}
			active={side === "mom"}
			{beatI}
			{direction}
			bind:transform
		/>
		<Side
			id="baby"
			beats={babyBeats}
			active={side === "baby"}
			{beatI}
			{direction}
			bind:transform
		/>
	</div>
</div>

<style>
	.main {
		position: relative;
		overflow: hidden;
		aspect-ratio: 2400 / 6251;
		width: 100%;
		height: 100svh;
		max-width: 1400px;
		margin: 0 auto;
		z-index: 0;
	}

	.world-view {
		transition: transform 2s 0.5s ease-out;
	}

	.foreground {
		position: absolute;
		top: 0;
		z-index: 2;
	}

	.mask {
		position: absolute;
		top: 0;
		z-index: 2;
	}

	:global(.world .mom-path, .world .baby-path, .world .markers) {
		opacity: 0;
	}
</style>
