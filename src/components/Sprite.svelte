<script>
	import Force from "$components/Sprite.Force.svelte";
	import spriteData from "$data/sprites.json";
	import { onDestroy, untrack } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";

	let dimensions = new useWindowDimensions();

	let { id, sideId, beatId, steps, pathEl, pathLength } = $props();

	const FRAMERATE = 300;
	const Y_OFFSET = 0.87;
	const SPEED = 0.2;

	const spriteDataForId = spriteData.find((d) => d.id === id);
	const { rows, cols, frameWidth, frameHeight, frames } = spriteDataForId;

	let lastSteps;
	let cycleInterval;

	let animating = $state(false);
	let x = $state(0);
	let y = $state(0);
	let currentT = $state(0);
	let currentSpotId = $state();
	let flipped = $state(false);
	let forceData = $state();
	let frameIndex = $state(0);
	let frame = $derived(frames[frameIndex]);
	let scale = $derived(dimensions.width / 3000);
	const width = $derived(frameWidth * scale);
	const height = $derived(frameHeight * scale);

	const findClosestT = (pathEl, cx, cy, samples = 2000) => {
		const total = pathEl.getTotalLength();
		let best = { dist: Infinity, t: 0 };

		for (let i = 0; i <= samples; i++) {
			const t = (i / samples) * total;
			const p = pathEl.getPointAtLength(t);

			const dx = p.x - cx;
			const dy = p.y - cy;
			const d = dx * dx + dy * dy;

			if (d < best.dist) {
				best = { dist: d, t };
			}
		}
		return best.t;
	};

	const coordinatesForT = (t) => {
		const point = pathEl.getPointAtLength(t);

		const svg = pathEl.ownerSVGElement;
		const ctm = svg.getScreenCTM();
		const svgPoint = svg.createSVGPoint();
		svgPoint.x = point.x;
		svgPoint.y = point.y;

		const screenPoint = svgPoint.matrixTransform(ctm);
		const parentEl = document.querySelector(`#side-${sideId}`);
		const parentRect = parentEl.getBoundingClientRect();

		return {
			x: screenPoint.x - parentRect.left,
			y: screenPoint.y - parentRect.top
		};
	};

	const getCircleById = (spotId) => {
		const circle = pathEl
			.closest("svg")
			.querySelector(`.markers circle.${spotId}`);

		return circle;
	};

	const moveTo = (spotId, duration) => {
		return new Promise((resolve) => {
			if (animating) return;

			const circle = getCircleById(spotId);
			if (!circle) return;

			const cx = circle.cx.baseVal.value;
			const cy = circle.cy.baseVal.value;

			const targetT = findClosestT(pathEl, cx, cy);

			if (duration === 0) {
				currentT = targetT;

				const coords = coordinatesForT(currentT);
				x = coords.x;
				y = coords.y;

				animating = false;
				resolve();
				return;
			}

			animating = true;
			const startT = currentT;
			const diff = targetT - startT;
			const startTime = performance.now();

			const step = (now) => {
				const elapsed = now - startTime;
				const dist = Math.abs(targetT - startT);
				const dur = duration || dist / SPEED;
				const t = Math.min(elapsed / dur, 1);

				currentT = startT + diff * t;

				const coords = coordinatesForT(currentT);
				x = coords.x;
				y = coords.y;

				if (t < 1) {
					requestAnimationFrame(step);
				} else {
					animating = false;
					resolve();
				}
			};
			requestAnimationFrame(step);
		});
	};

	const cycle = (cycleId) => {
		if (cycleInterval) clearInterval(cycleInterval);
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

	const pose = (poseId) => {
		const poseFrame = frames.find((d) => d.pose === poseId);
		if (poseFrame) {
			frameIndex = +poseFrame.index;
		}
	};

	const performSteps = async () => {
		for (const step of steps) {
			flipped = step.flip === "TRUE";
			if (step.forceSprites) {
				forceData = {
					sprites: step.forceSprites,
					n: step.forceN,
					config: step.forceConfig
				};
			} else {
				forceData = undefined;
			}

			if (step.pose) pose(step.pose);
			if (step.cycle) cycle(step.cycle);

			currentSpotId = step.toSpot ? `${beatId}-${step.toSpot}` : beatId;
			await moveTo(currentSpotId, step.duration ? +step.duration : undefined);

			if (cycleInterval) clearInterval(cycleInterval);
		}
	};

	$effect(() => {
		if (pathEl && steps !== lastSteps) {
			lastSteps = steps;
			performSteps();
		}
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
		/* outline: 3px dashed lightgreen; */
	}

	.flipped {
		transform: translate(-50%, calc(-100% * var(--y-offset))) scaleX(-1);
	}
</style>
