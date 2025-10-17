<script>
	import Side from "$components/Side.svelte";
	import pathSvg from "$svg/paths.svg";
</script>

<div class="world">
	<img class="background" src="assets/images/background.png" alt="Background" />
	{@html pathSvg}

	<Side id="mom" />
	<!-- <Side id="baby" /> -->
</div>

<style>
	.world {
		position: relative;
		overflow: hidden;
		aspect-ratio: 2400 / 6251;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		/* background: var(--color-black); */
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
