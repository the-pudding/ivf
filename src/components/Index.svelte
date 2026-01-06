<script>
	import Side from "$components/Side.svelte";
	import worldSvg from "$svg/world.svg";
	import foregroundSvg from "$svg/world-foreground.svg";
	import maskSvg from "$svg/world-mask.svg";
	import momBeats from "$data/beats-mom.csv";
	import babyBeats from "$data/beats-baby.csv";
	import _ from "lodash";

	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let side = $state("mom");
	let beatI = $state(0);
	let direction = $state("forward");
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

<div class="world">
	{@html worldSvg}

	<div class="foreground">
		{@html foregroundSvg}
	</div>

	<div class="mask">
		{@html maskSvg}
	</div>

	<Side id="mom" beats={momBeats} active={side === "mom"} {beatI} {direction} />
	<Side
		id="baby"
		beats={babyBeats}
		active={side === "baby"}
		{beatI}
		{direction}
	/>
</div>

<style>
	.world {
		position: relative;
		overflow: hidden;
		aspect-ratio: 2400 / 6251;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		z-index: 0;
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
