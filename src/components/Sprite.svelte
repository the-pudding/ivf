<script>
	import spriteData from "$data/sprites.json";
	import { onDestroy } from "svelte";

	let { id, steps, pathEl, pathLength } = $props();

	const rows = spriteData[0].rows;
	const cols = spriteData[0].cols;
	const frameWidth = spriteData[0].frameWidth;
	const frameHeight = spriteData[0].frameHeight;

	const FRAMERATE = 300;

	const scale = 0.25;
	const width = frameWidth * scale;
	const height = frameHeight * scale;

	let lastSteps;
	let cycleInterval;

	let animating = $state(false);
	let x = $state(0);
	let y = $state(0);
	let currentPercent = $state(0);
	let flipped = $state(false);
	let frameIndex = $state(0);
	let frame = $derived(spriteData[0].frames[frameIndex]);

	const percentToCoordinates = (percent) => {
		const lengthAtPercent = (percent / 100) * pathLength;
		const point = pathEl.getPointAtLength(lengthAtPercent);
		const ctm = pathEl.ownerSVGElement.getScreenCTM();
		const svgPoint = pathEl.ownerSVGElement.createSVGPoint();
		svgPoint.x = point.x;
		svgPoint.y = point.y;
		const screenPoint = svgPoint.matrixTransform(ctm);
		const svgRect = pathEl.ownerSVGElement.getBoundingClientRect();
		return {
			x: screenPoint.x - svgRect.left,
			y: screenPoint.y - svgRect.top
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
		const frames = spriteData[0].frames.filter((d) => d.name === cycleId);

		if (frames.length === 0) {
			frameIndex = 0;
			return;
		}

		frameIndex = +frames[0].index;

		let i = 0;
		cycleInterval = setInterval(() => {
			if (i + 1 >= frames.length) i = 0;
			else i += 1;

			frameIndex = +frames[i].index;
		}, FRAMERATE);
	};

	const performSteps = async () => {
		for (const step of steps) {
			flipped = step.flip === "TRUE";

			cycle(step.cycle);

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

	onDestroy(() => {
		if (cycleInterval) clearInterval(cycleInterval);
	});
</script>

<div
	class="sprite"
	class:flipped
	style:width={`${width}px`}
	style:height={`${height}px`}
	style:background-size={`calc(${cols} * 100%) calc(${rows} * 100%)`}
	style:background-position={`${scale * frame.x * -1}px ${scale * frame.y * -1}px`}
	style:left={`${x}px`}
	style:top={`${y}px`}
></div>

<style>
	.sprite {
		position: absolute;
		transform: translate(-50%, -80%);
		background-image: url("assets/sprites/mom.png");
	}

	.flipped {
		transform: translate(-50%, -80%) scaleX(-1);
	}
</style>
