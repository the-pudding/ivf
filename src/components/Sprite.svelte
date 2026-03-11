<script>
	import _ from "lodash";
	import Force from "$components/Sprite.Force.svelte";
	import spriteData from "$data/sprites.json";
	import { getAngleAtT, findClosestT } from "$utils/spriteHelpers.js";
	import { scenery } from "$utils/scenery.js";
	import { onDestroy } from "svelte";
	import { prefersReducedMotion } from "svelte/motion";

	let {
		id,
		beatId,
		allBeats,
		steps,
		pathEl,
		spritePosition = $bindable(),
		sceneryState,
		active,
		camera,
		worldW,
		worldH
	} = $props();

	const FRAMERATE = 300;
	const SPEED = 0.17;

	const spriteDataForId = spriteData.find((d) => d.id === id);
	const { rows, cols, frameWidth, frameHeight, frames } = spriteDataForId;
	const scaleFactor = spriteDataForId.scaleFactor || 1;

	let lastSteps;
	let cycleInterval = null;
	let rafId = null;

	let isLastStep = $derived(active && beatId === "end");
	let x = $state(0);
	let y = $state(0);
	let currentT = $state(0);
	let currentSpotId = $state("hidden-enter");
	let forceData = $state();
	let frameIndex = $state(0);
	let gray = $state(false);
	let idle = $state(false);
	let flipped = $derived(
		id === "mom"
			? Math.cos(getAngleAtT(currentT, pathEl)) < 0
			: Math.cos(getAngleAtT(currentT, pathEl)) > 0
	);
	let frame = $derived(frames[frameIndex]);
	let svgScaleFactor = $derived(
		Math.min(worldW / camera.current.w, worldH / camera.current.h)
	);
	let yOffset = $derived(
		id === "baby" && beatId === "end" ? 0.65 : spriteDataForId.yOffset || 0
	);

	let scale = $derived(scaleFactor * svgScaleFactor);
	const width = $derived(frameWidth * scale);
	const height = $derived(frameHeight * scale);

	const moveTo = (spotId, duration) => {
		return new Promise((resolve) => {
			if (rafId) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}

			const circle = pathEl
				.closest("svg")
				.querySelector(`.markers .${id} circle.${spotId}`);
			if (!circle) return;

			const cx = circle.cx.baseVal.value;
			const cy = circle.cy.baseVal.value;

			const targetT = findClosestT(cx, cy, pathEl);

			if (duration === 0) {
				currentT = targetT;

				resolve();
				return;
			}

			const startT = currentT;
			const diff = targetT - startT;
			const startTime = performance.now();

			const step = (now) => {
				const elapsed = now - startTime;
				const dist = Math.abs(targetT - startT);
				const dur = duration || dist / SPEED;
				const t = Math.min(elapsed / dur, 1);

				currentT = startT + diff * t;

				if (t < 1) {
					rafId = requestAnimationFrame(step);
				} else {
					resolve();
				}
			};
			rafId = requestAnimationFrame(step);
		});
	};

	const pose = (poseId) => {
		const poseFrame = frames.find((d) => d.pose === poseId);
		if (poseFrame) {
			frameIndex = +poseFrame.index;
		}
	};

	const cycle = (cycleId) => {


		if (prefersReducedMotion.current) return;

		if (cycleInterval) {
			clearInterval(cycleInterval);
			cycleInterval = null;
		}

		let cycleFrames = frames.filter((d) => d.cycle === cycleId);

		if (cycleFrames.length === 0) {
			frameIndex = 0;
			return;
		}

		frameIndex = +cycleFrames[0].index;

		let i = 0;
		cycleInterval = setInterval(() => {
			if (i + 1 >= cycleFrames.length) i = 0;
			else i += 1;

			frameIndex = +cycleFrames[i].index;
		}, FRAMERATE);
	};

	const performSceneryAction = (sceneryId, sceneryAction) => {
		const performed = sceneryState[sceneryId][sceneryAction];
		if (performed) return;

		const els = document.querySelectorAll(`.Foreground .${sceneryId}`);
		const actionHandler = scenery[sceneryId][sceneryAction];
		if (actionHandler) {
			actionHandler(els);
			sceneryState[sceneryId][sceneryAction] = true;
		}
	};

	const prep = async () => {
		// Jump to start
		await moveTo(steps[0].startSpot, 0);

		// Apply previous scenery actions
		const i = allBeats.findIndex((d) => d.id === beatId);
		const previousBeats = i === -1 ? allBeats : allBeats.slice(0, i);
		const previousSceneryActions = previousBeats
			.flatMap((beat) => beat.steps ?? [])
			.filter((step) => step.scenery && step.sceneryAction)
			.map((step) => ({
				scenery: step.scenery,
				sceneryAction: step.sceneryAction
			}));
		previousSceneryActions.forEach((d) => {
			performSceneryAction(d.scenery, d.sceneryAction);
		});

		// Fade out previous scenery
		// previousBeats
		// 	.filter((d) => d.steps.some((s) => s.scenery && s.sceneryAction))
		// 	.forEach((beat) => {
		// 		const actions = beat.steps.filter((s) => s.scenery && s.sceneryAction);
		// 		actions.forEach((step) => {
		// 			const els = document.querySelectorAll(`.Foreground .${step.scenery}`);
		// 			if (scenery[step.scenery].fade) scenery[step.scenery].fade(els);
		// 			else els.forEach((el) => (el.style.opacity = "0.2"));
		// 		});
		// 	});

		// Reset future scenery
		const futureSceneryActions = allBeats
			.slice(i + 1)
			.flatMap((beat) => beat.steps ?? [])
			.filter((step) => step.scenery && step.sceneryAction);
		futureSceneryActions.forEach((d) => {
			const els = document.querySelectorAll(`.Foreground .${d.scenery}`);
			const resetter = scenery[d.scenery].reset;
			if (els && resetter) {
				resetter(els);
				sceneryState[d.scenery][d.sceneryAction] = false;
			}
		});
	};

	const performSteps = async () => {
		idle = false;

		for (const step of steps) {
			if (step.forceSprites) {
				const incomingData = {
					id: step.force,
					sprites: step.forceSprites,
					sizeFactor: step.forceNodeSize,
					config: step.forceConfig
				};
				if (!_.isEqual(incomingData, forceData)) forceData = incomingData;
			} else {
				forceData = undefined;
			}

			if (step.gray === "TRUE") gray = true;
			else gray = false;

			if (step.cycle) cycle(step.cycle);
			else if (step.pose) {
				if (cycleInterval) {
					clearInterval(cycleInterval);
					cycleInterval = null;
				}
				pose(step.pose);
			}
			if (step.scenery && step.sceneryAction)
				performSceneryAction(step.scenery, step.sceneryAction);

			currentSpotId = step.endSpot;

			if (step.position) spritePosition = step.position;
			else spritePosition = "below";

			const dur = prefersReducedMotion.current
				? 0
				: step.duration
					? +step.duration
					: undefined;

			await moveTo(currentSpotId, dur);
		}

		if (beatId !== "start" && beatId !== "end") idle = true;
	};

	// Update camera position when currentT or dimensions changes
	const updatePosition = () => {
		if (!pathEl || !currentT) return;

		const svg = pathEl.ownerSVGElement;
		const svgLocation = pathEl.getPointAtLength(currentT);

		const pt = svg.createSVGPoint();
		pt.x = svgLocation.x;
		pt.y = svgLocation.y;

		const screenPoint = pt.matrixTransform(svg.getScreenCTM());

		const parentEl = document.querySelector(`#side-${id}`);
		const parentRect = parentEl.getBoundingClientRect();

		x = Math.round(screenPoint.x - parentRect.left);
		y = Math.round(screenPoint.y - parentRect.top);
	};

	$effect(() => updatePosition(currentT, camera.current, worldW, worldH));

	// New steps -> perform them
	$effect(async () => {
		if (!pathEl || steps === lastSteps || !active) return;

		await prep();

		lastSteps = steps;
		performSteps();
	});

	onDestroy(() => {
		if (cycleInterval) clearInterval(cycleInterval);
	});
</script>

<div
    class="sprite-container"
    class:active={active}
    class:flipped={flipped}
	class:gray={gray}
    style:transform={`translate3d(${x}px, ${y}px, 0) ${flipped ? 'scaleX(-1)' : ''}`}
>
    <div
        class="sprite"
        class:idle={idle && !prefersReducedMotion.current}
        class:last={isLastStep}
        style={`--y-offset: ${yOffset}`}
        style:width={`${width}px`}
        style:height={`${height}px`}
        style:background-image={`url("assets/sprites/${id}.png")`}
        style:background-size={`calc(${cols} * 100%) calc(${rows} * 100%)`}
        style:background-position={`${scale * frame.x * -1}px ${scale * frame.y * -1}px`}
    ></div>
</div>

{#if forceData && x && y}
	<Force
		centerX={x}
		centerY={y - (yOffset - 0.5) * height}
		spriteWidth={width}
		spriteHeight={height}
		{forceData}
		{yOffset}
		{svgScaleFactor}
		{gray}
	/>
{/if}

<style>
	.sprite-container {
		position: absolute;
		top: 0;
		left: 0;
		/* Ensure the container itself has no size so (0,0) is the center */
		width: 0;
		height: 0;
		will-change: transform;
		transition: opacity var(--1s) ease-in-out;
		opacity: 0;
		z-index: 1;
	}

	.sprite-container.active {
		opacity: 1;
		/* Move the transition delay here if you want the fade-in delayed */
		transition-delay: 0.5s;
	}

	.sprite-container.gray {
		filter: grayscale(100%);
		transition: filter var(--1s) ease-in-out;
		transition-delay: 0s !important;
	}

	.sprite {
		/* This handles the centering relative to the container's (0,0) */
		position: absolute;
		transform: translate(-50%, calc(-100% * var(--y-offset)));
		will-change: transform;
		filter: grayscale(0%);
	}

	.idle {
		/* Only one animation needed now! */
		animation: bounce 1s infinite ease-in-out;
	}

	@keyframes bounce {
		0%, 100% {
			transform: translate(-50%, calc(-100% * var(--y-offset))) translateY(0);
		}
		50% {
			transform: translate(-50%, calc(-100% * var(--y-offset))) translateY(-4px);
		}
	}
</style>
