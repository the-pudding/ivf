<script>
	import _ from "lodash";
	import Force from "$components/Sprite.Force.svelte";
	import spriteData from "$data/sprites.json";
	import { getAngleAtT, findClosestT } from "$utils/spriteHelpers.js";
	import { scenery } from "$utils/scenery.js";
	import { onDestroy } from "svelte";

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
	const yOffset = spriteDataForId.yOffset || 0;
	const scaleFactor = spriteDataForId.scaleFactor || 1;

	let lastSteps;
	let cycleInterval = null;
	let rafId = null;

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
		Math.max(worldW / camera.current.w, worldH / camera.current.h)
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
		previousBeats
			.filter((d) => d.steps.some((s) => s.scenery && s.sceneryAction))
			.forEach((beat) => {
				const actions = beat.steps.filter((s) => s.scenery && s.sceneryAction);
				actions.forEach((step) => {
					const els = document.querySelectorAll(`.Foreground .${step.scenery}`);
					if (scenery[step.scenery].fade) scenery[step.scenery].fade(els);
					else els.forEach((el) => (el.style.opacity = "0.2"));
				});
			});

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

			await moveTo(currentSpotId, step.duration ? +step.duration : undefined);
		}

		if (beatId !== "start" && beatId !== "end") idle = true;
	};

	// Update camera position when currentT or dimensions changes
	$effect(() => {
		if (!pathEl || !currentT) return;
		const svgLocation = pathEl.getPointAtLength(currentT);

		const screenScale = Math.max(
			worldW / camera.current.w,
			worldH / camera.current.h
		);

		const parentEl = document.querySelector(`#side-${id}`);

		const screenX =
			(svgLocation.x - camera.current.x) * screenScale - parentEl.offsetLeft;
		const screenY = (svgLocation.y - camera.current.y) * screenScale;

		x = screenX;
		y = screenY;
	});

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
	class="sprite"
	class:flipped
	class:gray
	class:idle
	style={`--y-offset: ${yOffset}`}
	style:width={`${width}px`}
	style:height={`${height}px`}
	style:background-image={`url("assets/sprites/${id}.png")`}
	style:background-size={`calc(${cols} * 100%) calc(${rows} * 100%)`}
	style:background-position={`${scale * frame.x * -1}px ${scale * frame.y * -1}px`}
	style:left={`${x}px`}
	style:top={`${y}px`}
></div>

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
	.sprite {
		position: absolute;
		transform: translate(-50%, calc(-100% * var(--y-offset)));
	}

	.flipped {
		transform: translate(-50%, calc(-100% * var(--y-offset))) scaleX(-1);
	}

	.gray {
		filter: grayscale(100%);
	}

	.idle {
		animation: bounce 1s infinite;
	}

	.idle.flipped {
		animation: bounce-flipped 1s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translate(-50%, calc(-100% * var(--y-offset))) translateY(0);
		}
		50% {
			transform: translate(-50%, calc(-100% * var(--y-offset))) translateY(-2px);
		}
	}

	@keyframes bounce-flipped {
		0%,
		100% {
			transform: translate(-50%, calc(-100% * var(--y-offset))) scaleX(-1)
				translateY(0);
		}
		50% {
			transform: translate(-50%, calc(-100% * var(--y-offset))) scaleX(-1)
				translateY(-2px);
		}
	}
</style>
