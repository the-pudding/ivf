<script>
	import Force from "$components/Sprite.Force.svelte";
	import spriteData from "$data/sprites.json";
	import {
		getAngleAtT,
		findClosestT,
		coordinatesForT
	} from "$utils/spriteHelpers.js";
	import { sceneryAnimations } from "$utils/sceneryAnimations.js";
	import { onDestroy, untrack } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";

	let dimensions = new useWindowDimensions();

	let {
		id,
		sideId,
		beatId,
		steps,
		pathEl,
		spritePosition = $bindable()
	} = $props();

	const FRAMERATE = 300;
	const Y_OFFSET = 0.87;
	const SPEED = 0.2;

	const spriteDataForId = spriteData.find((d) => d.id === id);
	const { rows, cols, frameWidth, frameHeight, frames } = spriteDataForId;

	let lastSteps;

	let cycleInterval = null;
	let rafId = null;

	let x = $state(0);
	let y = $state(0);
	let currentT = $state(0);
	let currentSpotId = $state();
	let forceData = $state();
	let frameIndex = $state(0);
	let flipped = $derived(Math.cos(getAngleAtT(currentT, pathEl)) < 0);
	let frame = $derived(frames[frameIndex]);
	let scale = $derived(dimensions.width / 3000);
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
				.querySelector(`.markers circle.${spotId}`);
			if (!circle) return;

			const cx = circle.cx.baseVal.value;
			const cy = circle.cy.baseVal.value;

			const targetT = findClosestT(cx, cy, pathEl);

			if (duration === 0) {
				currentT = targetT;

				const coords = coordinatesForT(currentT, pathEl, sideId);
				x = coords.x;
				y = coords.y;

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

				const coords = coordinatesForT(currentT, pathEl, sideId);
				x = coords.x;
				y = coords.y;

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

		const cycleFrames = frames.filter((d) => d.cycle === cycleId);

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

	const scenery = (sceneryId, sceneryAction) => {
		const els = document.querySelectorAll(`.Foreground .${sceneryId}`);
		const handler = sceneryAnimations[sceneryId][sceneryAction];
		if (handler) handler(els);
	};

	const performSteps = async () => {
		for (const step of steps) {
			if (step.forceSprites) {
				forceData = {
					sprites: step.forceSprites,
					n: step.forceN,
					config: step.forceConfig
				};
			} else {
				forceData = undefined;
			}

			if (step.cycle) cycle(step.cycle);
			else if (step.pose) {
				if (cycleInterval) {
					clearInterval(cycleInterval);
					cycleInterval = null;
				}
				pose(step.pose);
			}
			if (step.scenery && step.sceneryAction)
				scenery(step.scenery, step.sceneryAction);

			currentSpotId = step.endSpot;

			if (step.position) spritePosition = step.position;
			else spritePosition = "below";

			await moveTo(currentSpotId, step.duration ? +step.duration : undefined);
		}
	};

	$effect(async () => {
		if (!pathEl || steps === lastSteps) return;

		await moveTo(steps[0].startSpot, 0);
		// TODO: make sure previous scenery actions all happened

		lastSteps = steps;
		performSteps();
	});

	$effect(() => {
		const width = dimensions.width;
		if (width) {
			untrack(() => {
				moveTo(currentSpotId, 0);
			});
		}
	});

	onDestroy(() => {
		if (cycleInterval) clearInterval(cycleInterval);
	});
</script>

<div
	class="sprite"
	class:flipped
	style={`--y-offset: ${Y_OFFSET}`}
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
		centerY={y}
		spriteWidth={width}
		spriteHeight={height}
		{forceData}
		yOffset={Y_OFFSET}
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
</style>
