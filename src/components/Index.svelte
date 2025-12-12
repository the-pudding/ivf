<script>
	import Side from "$components/Side.svelte";
	import worldSvg from "$svg/world.svg";
	import momBeats from "$data/beats-mom.csv";
	import babyBeats from "$data/beats-baby.csv";

	let side = $state("mom");
</script>

<div class="world">
	{@html worldSvg}

	<Side id="mom" beats={momBeats} active={side === "mom"} bind:side />
	<!-- <Side id="baby" beats={babyBeats} active={side === "baby"} bind:side /> -->
</div>

<style>
	.world {
		position: relative;
		overflow: hidden;
		aspect-ratio: 2400 / 6251;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	img.background {
		width: 100%;
		transform-origin: 50% 50%;
		transform: scale(1) translate(0, 0);
		transition:
			transform 0.8s ease-out,
			transform-origin 0.8s ease-out;
	}

	:global(.world svg#paths) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
