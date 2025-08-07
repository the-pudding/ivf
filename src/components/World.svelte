<script>
	import { onMount } from "svelte";
	import worldSvg from "$svg/monument-valley.svg";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import copy from "$data/copy.json";

	let currentPercent = 0;
	let characterEl;
	let pathEls = [];
	let fadeEl;
	let pathLength = 0;
	let animating = $state(false);
	let side = $state("left");
	let sideName = $derived(side === "left" ? "mom" : "baby");
	let scrollStep = $state();

	const moveTo = (targetPercent, duration = 1000) => {
		if (animating) return; // prevent overlapping animations
		animating = true;

		const start = currentPercent;
		const diff = targetPercent - start;
		const startTime = performance.now();

		const step = (now) => {
			const elapsed = now - startTime;
			const t = Math.min(elapsed / duration, 1); // normalize (0–1)

			const current = start + diff * t;
			currentPercent = current;

			const pt = pathEls[side === "left" ? 0 : 1].getPointAtLength(
				current * pathLength
			);
			characterEl.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);

			if (t < 1) {
				requestAnimationFrame(step);
			} else {
				animating = false;
			}
		};

		requestAnimationFrame(step);
	};

	$effect(() => {
		if (scrollStep === undefined) {
			moveTo(0);
			return;
		}
		const targetPercent = (scrollStep + 1) / copy[sideName].length;
		moveTo(targetPercent);
	});

	onMount(() => {
		characterEl = document.getElementById("character");
		pathEls[0] = document.getElementById("left");
		pathEls[1] = document.getElementById("right");
		fadeEl = document.getElementById("fade");
		pathLength = pathEls[0].getTotalLength();

		const pt = pathEls[0].getPointAtLength(0);
		characterEl.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
	});
</script>

<section id="scrolly" class={side}>
	<div class="sticky">
		<div class="svg-wrapper">
			{@html worldSvg}
		</div>
	</div>

	<div class="steps">
		<Scrolly bind:value={scrollStep}>
			{#each copy[sideName] as { type, value }, i}
				{@const active = scrollStep === i}
				<div class="step" class:active>
					<p>{value}</p>
				</div>
			{/each}
		</Scrolly>
	</div>
</section>

<button onclick={() => (side = "left")}>mom</button>
<button onclick={() => (side = "right")}>baby</button>

<style>
	:global(body) {
		background: black;
	}

	#scrolly {
		display: flex;
		flex-direction: column;
	}

	.sticky {
		position: sticky;
		top: 0;
	}

	.steps {
		position: relative;
		z-index: 2;
		width: 50%;
		padding: 0 4rem;
	}

	#scrolly.left .steps {
		align-self: end;
	}

	#scrolly.right .steps {
		align-self: start;
	}

	.step {
		margin: 80dvh auto;
		padding: 1rem;
		width: 100%;
		max-width: 600px;
		background: var(--color-gray-100);
		text-align: center;
	}

	.svg-wrapper {
		height: 100dvh;
	}

	:global(svg) {
		width: 100%;
		height: 100%;
	}

	:global(#scrolly.left svg #fade) {
		transform: translate(50%, 0);
	}

	:global(#scrolly.right svg #fade) {
		transform: translate(0, 0);
	}

	button {
		position: fixed;
		top: 50%;
		z-index: 1000;
	}

	button:first-child {
		left: 2rem;
	}

	button:last-child {
		right: 2rem;
	}

	/* :global(svg #left, svg #right) {
		display: none;
	} */
</style>
