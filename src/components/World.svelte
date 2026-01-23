<script>
	import Side from "$components/Side.svelte";
	import worldSvg from "$svg/world.svg";
	import foregroundSvg from "$svg/world-foreground.svg";
	import maskSvg from "$svg/world-mask.svg";
	import momBeats from "$data/beats-mom.csv";
	import babyBeats from "$data/beats-baby.csv";
	import _ from "lodash";

	let { side, direction, beatI, numBeats } = $props();

	let transform = $state("translate(0, 0)");
	let beatId = $derived(
		Object.entries(_.groupBy(side === "mom" ? momBeats : babyBeats, "id")).map(
			([id, steps]) => ({
				id,
				steps
			})
		)[beatI].id
	);

	$effect(() => {
		if (beatI === numBeats - 1) {
			side = "both";
		}
	});

	$effect(() => {
		const camera = document.querySelector(".camera");
		const world = document.querySelector(".world-view");

		if (!camera || !world) return;

		const cameraHeight = camera.clientHeight;
		const worldHeight = world.scrollHeight;

		const maxCameraY = Math.max(0, worldHeight - cameraHeight);

		const beatIncrement = maxCameraY / (numBeats - 1);

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
		active={side === "mom" || side === "both"}
		{beatI}
		{direction}
		bind:transform
	/>
	<Side
		id="baby"
		beats={babyBeats}
		active={side === "baby" || side === "both"}
		{beatI}
		{direction}
		bind:transform
	/>

	<div class="fade left" class:visible={side === "baby"}></div>
	<div class="fade right" class:visible={side === "mom"}></div>
</div>

<style>
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
		z-index: 4;
	}

	.fade {
		position: absolute;
		top: 0;
		z-index: 5;
		height: 100%;
		width: 50%;
		background: var(--color-bg);
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.3) ease-in-out;
	}

	.fade.left {
		left: 0;
	}

	.fade.right {
		right: 0;
	}

	.fade.visible {
		opacity: 0.9;
	}

	:global(.world .mom-path, .world .baby-path, .world .markers) {
		opacity: 0;
	}

	@keyframes jab {
		0% {
			transform: translateY(0);
		}
		8% {
			transform: translateY(16px);
		}
		70% {
			transform: translateY(-2px);
		}
		100% {
			transform: translateY(0);
		}
	}

	@keyframes flash-loop {
		/* long white stretches */
		0% {
			fill: #ffffff;
		}
		10% {
			fill: #ffffff;
		}
		20% {
			fill: #ffffff;
		}

		/* first soft cluster */
		24% {
			fill: #f0d0d3;
		}
		27% {
			fill: #ffffff;
		}
		30% {
			fill: #f0b49d;
		}
		33% {
			fill: #ffffff;
		}

		/* white again */
		42% {
			fill: #ffffff;
		}

		/* second cluster */
		48% {
			fill: #f0d0d3;
		}
		52% {
			fill: #ffffff;
		}
		56% {
			fill: #f0d0d3;
		}
		59% {
			fill: #ffffff;
		}

		/* breather */
		68% {
			fill: #ffffff;
		}

		/* final accent */
		74% {
			fill: #f0b49d;
		}
		78% {
			fill: #ffffff;
		}

		100% {
			fill: #ffffff;
		}
	}

	:global(.calendar-flash) {
		animation: flash-loop 8s steps(1) infinite;
		transition: fill 0.25s ease;
	}

	:global(.needle-jab) {
		animation: jab 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
	}
</style>
