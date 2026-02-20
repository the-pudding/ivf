<script>
	import Side from "$components/Side.svelte";
	import worldSvg from "$svg/world.svg";
	import foregroundSvg from "$svg/world-foreground.svg";
	import maskSvg from "$svg/world-mask.svg";
	import momBeats from "$data/beats-mom.csv";
	import babyBeats from "$data/beats-baby.csv";
	import { Tween, prefersReducedMotion } from "svelte/motion";
	import { cubicInOut } from "svelte/easing";
	import { scaleLinear } from "d3-scale";
	import { browser } from "$app/environment";
	import _ from "lodash";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	let dimensions = new useWindowDimensions();

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
	const zoomScale = scaleLinear()
		.domain([600, 1000, 2000])
		.range([3, 1.5, 1])
		.clamp(true);
	const totalBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	const buffer = $derived(dimensions.width > 1500 ? 0 : svgW * 0.15);

	let worldW = $state(0);
	let worldH = $state(0);

	const zoom = $derived(showBoth ? 1 : zoomScale(dimensions.width));
	const cameraH = $derived(dimensions.height);
	const viewboxW = $derived(svgW / zoom);
	const viewboxH = $derived(svgH / zoom);
	const viewboxX = $derived(
		showBoth
			? svgW / 2 - svgW / (2 * zoom)
			: side === "mom"
				? buffer
				: svgW - svgW / zoom - buffer
	);
	const viewboxY = $derived.by(() => {
		if (!browser || beatI === 0 || beatI >= totalBeats - 1) return 0;

		const steps =
			side === "mom"
				? momBeats.filter((d) => d.id === beatId)
				: babyBeats.filter((d) => d.id === beatId);
		const endSpot = steps.at(-1).endSpot;
		const el = document.querySelector(`.${side} circle.${endSpot}`);

		const min = 0;
		const max = svgH - (cameraH * (svgH / worldH)) / zoom;

		const center = dimensions.width < 600 ? 0.3 : 0.45;

		const centeredY =
			el.cy.baseVal.value - ((cameraH * (svgH / worldH)) / zoom) * center;

		return Math.min(Math.max(centeredY, min), max);
	});

	const camera = new Tween(
		{ x: 0, y: 0, w: svgW, h: svgH },
		{
			duration: prefersReducedMotion.current ? 0 : 2000,
			delay: 0,
			easing: cubicInOut
		}
	);

	const updateCamera = () => {
		camera.set({
			x: viewboxX,
			y: viewboxY,
			w: viewboxW,
			h: viewboxH
		});
	};

	const animateViewbox = () => {
		const svgEl = document.querySelector(".world svg");
		const maskEl = document.querySelector(".mask svg");
		const fgEl = document.querySelector(".foreground svg");
		[svgEl, maskEl, fgEl].forEach((el) => {
			if (el) {
				const { x, y, w, h } = camera.current;
				el.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
			}
		});
	};

	$effect(() => updateCamera(beatI));
	$effect(() => animateViewbox(camera));
</script>

<div
	class="world"
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
	}

	.world.done {
		height: calc(100% - 5rem);
	}

	.done .foreground,
	.done .mask {
		height: 100%;
	}

	:global(.world.done svg) {
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

	@media (max-width: 1000px) {
		.world.done {
			height: calc(100% - 12rem);
		}
	}
</style>
