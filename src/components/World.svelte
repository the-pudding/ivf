<script>
	import Side from "$components/Side.svelte";
	import worldSvg from "$svg/world.svg";
	import foregroundSvg from "$svg/world-foreground.svg";
	import maskSvg from "$svg/world-mask.svg";
	import momBeats from "$data/beats-mom.csv";
	import babyBeats from "$data/beats-baby.csv";
	import { scaleLinear } from "d3-scale";
	import { Tween, prefersReducedMotion } from "svelte/motion";
	import { cubicInOut } from "svelte/easing";
	import { browser } from "$app/environment";
	import _ from "lodash";

	let { side, showBoth, direction, beatI } = $props();

	let beatId = $derived(
		Object.entries(_.groupBy(side === "mom" ? momBeats : babyBeats, "id")).map(
			([id, steps]) => ({
				id,
				steps
			})
		)[beatI].id
	);

	const svgW = 2755;
	const svgH = 6854;
	const initialZoom = 3;
	const bufferScale = scaleLinear()
		.domain([600, 1000, 1500])
		.range([0.2, 0.4, 0.45])
		.clamp(true);
	const totalBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let worldW = $state(0);
	let worldH = $state(0);
	let worldVisible = $state(false);
	let zoomOut = $state(false);

	const buffer = $derived(bufferScale(worldW));
	const zoom = $derived(
		showBoth && beatI === 0 ? initialZoom : zoomOut ? 1 : 4.5
	);
	const viewboxW = $derived(svgW / zoom);
	const viewboxH = $derived(svgH / zoom);
	const viewboxX = $derived(
		showBoth
			? svgW / 2 - svgW / (2 * zoom)
			: side === "mom"
				? buffer * svgW
				: (1 - buffer) * svgW - viewboxW
	);
	const viewboxY = $derived.by(() => {
		if (!browser || beatI === 0 || zoomOut) return 0;

		const steps =
			side === "mom"
				? momBeats.filter((d) => d.id === beatId)
				: babyBeats.filter((d) => d.id === beatId);
		const endSpot = steps.at(-1).endSpot;
		const el = document.querySelector(`.${side} circle.${endSpot}`);

		const center = 0.45;
		return el.cy.baseVal.value - (svgH / zoom) * center;
	});

	const camera = new Tween(
		{
			x: svgW / 2 - svgW / (2 * initialZoom),
			y: 0,
			w: svgW / initialZoom,
			h: svgH / initialZoom
		},
		{
			duration: prefersReducedMotion.current ? 0 : 2000,
			delay: 0,
			easing: cubicInOut
		}
	);

	const updateCamera = () => {
		camera.set(
			{
				x: viewboxX,
				y: viewboxY,
				w: viewboxW,
				h: viewboxH
			},
			{ duration: prefersReducedMotion.current ? 0 : zoomOut ? 4000 : 2000 }
		);
	};

	const animateViewbox = () => {
		const svgEl = document.querySelector(".world svg");
		const maskEl = document.querySelector(".mask svg");
		const fgEl = document.querySelector(".foreground svg");
		[svgEl, maskEl, fgEl].forEach((el) => {
			if (el) {
				const { x, y, w, h } = camera.current;
				el.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);

				if (!worldVisible) worldVisible = true;
			}
		});
	};

	const setZoomOut = () => {
		zoomOut = false;
		const pauseForSecs = 9;

		if (beatI !== totalBeats - 1) return;

		const timeout = setTimeout(() => {
			zoomOut = true;
		}, pauseForSecs * 1000);

		return () => clearTimeout(timeout);
	};

	$effect(() => updateCamera(beatI));
	$effect(() => animateViewbox(camera));
	$effect(() => setZoomOut(beatI));
</script>

<div
	class="world"
	class:visible={worldVisible}
	class:done={beatI >= totalBeats - 1}
	bind:clientHeight={worldH}
	bind:clientWidth={worldW}
>
	{@html worldSvg}

	<div class="foreground">
		{@html foregroundSvg}
	</div>

	<div class="mask" class:active={beatI === totalBeats - 1 || beatI <= 1}>
		{@html maskSvg}
	</div>

	<Side
		id="mom"
		beats={momBeats}
		active={side === "mom" || showBoth}
		{beatI}
		{direction}
		{camera}
		{worldW}
		{worldH}
	/>
	<Side
		id="baby"
		beats={babyBeats}
		active={side === "baby" || showBoth}
		{beatI}
		{direction}
		{camera}
		{worldW}
		{worldH}
	/>
</div>

<style>
	.world {
		position: relative;
		height: calc(100% - 4rem);
		opacity: 0;
		transition: opacity var(--1s) ease;
	}

	.world.visible {
		opacity: 1;
	}

	.foreground,
	.mask {
		height: 100%;
	}

	:global(.world svg) {
		height: 100%;
	}

	.foreground {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 2;
		pointer-events: none;
	}

	.mask {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 1;
		pointer-events: none;
	}

	.mask.active {
		z-index: 3;
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
		transition: fill calc(var(--1s) * 0.25) ease;
	}

	:global(.needle-jab) {
		animation: jab 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.calendar-flash, .needle-jab) {
			animation: none;
			transition: none;
		}
	}
</style>
