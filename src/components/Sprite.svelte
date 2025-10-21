<script>
	import Force from "$components/Sprite.Force.svelte";
	import spriteData from "$data/sprites.json";
	import { onDestroy } from "svelte";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";

	let dimensions = new useWindowDimensions();

	let { id, sideId, steps, pathEl, pathLength } = $props();

	const FRAMERATE = 300;
	const Y_OFFSET = 0.87;

	const spriteDataForId = spriteData.find((d) => d.id === id);
	const { rows, cols, frameWidth, frameHeight, frames } = spriteDataForId;

	let lastSteps;
	let cycleInterval;

	let animating = $state(false);
	let x = $state(0);
	let y = $state(0);
	let currentPercent = $state(0);
	let flipped = $state(false);
	let forceData = $state();
	let frameIndex = $state(0);
	let frame = $derived(frames[frameIndex]);
	let scale = $derived(dimensions.width / 3000);
	const width = $derived(frameWidth * scale);
	const height = $derived(frameHeight * scale);

	const percentToCoordinates = (percent) => {
		const lengthAtPercent = (percent / 100) * pathLength;
		const point = pathEl.getPointAtLength(lengthAtPercent);

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

	const moveTo = (targetPercent, duration = 1000) => {
		return new Promise((resolve) => {
			if (animating) return;

			if (duration === 0) {
				currentPercent = targetPercent;

				const coords = percentToCoordinates(currentPercent);
				x = coords.x;
				y = coords.y;

				animating = false;
				resolve();
				return;
			}

			animating = true;
			const start = currentPercent;
			const diff = targetPercent - start;
			const startTime = performance.now();

			const step = (now) => {
				const elapsed = now - startTime;
				const t = Math.min(elapsed / duration, 1);
				const current = start + diff * t;

				currentPercent = current;

				const coords = percentToCoordinates(currentPercent);
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
		const cycleFrames = frames.filter((d) => d.name === cycleId);

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

			if (step.cycle) cycle(step.cycle);

			await moveTo(+step.percent, +step.duration);
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
		if (dimensions.width) {
			moveTo(currentPercent, 0);
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
