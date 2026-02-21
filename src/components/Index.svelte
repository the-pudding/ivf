<script>
	import Title from "$components/Title.svelte";
	import Html from "$components/Html.svelte";
	import World from "$components/World.svelte";
	import DeepDive from "$components/DeepDive.svelte";
	import Bottom from "$components/Bottom.svelte";
	import Methods from "$components/Methods.svelte";
	import Footer from "$components/Footer.svelte";
	import momBeats from "$data/beats-mom.csv";
	import copy from "$data/copy.json";
	import focusTrap from "$actions/focusTrap.js";
	import _ from "lodash";

	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let side = $state("mom");
	let beatI = $state(0);
	let direction = $state("forward");
	let titleHeight = $state(0);
	let started = $state(false);
	let locked = $state(true);
	let showBoth = $state(true);
	let deepDiveOpen = $state(false);
	let deepDiveContent = $state([]);
	let description = $derived(copy.beats[side][beatI - 1]?.description);
	let atTheEnd = $derived(showBoth && beatI === numBeats - 1);

	const switchSides = () => {
		const sideEls = document.querySelectorAll(".overlay .Overlay path");
		sideEls.forEach((el) => {
			el.style.transition = "fill-opacity var(--1s) ease-in-out";
			if (showBoth || Array.from(el.classList).some((d) => d.includes(side))) {
				el.style.fillOpacity = 0;
			} else {
				el.style.fillOpacity = 0.9;
			}
		});
	};

	const next = () => {
		if (beatI >= numBeats - 1) return;
		direction = "forward";
		beatI = Math.min(numBeats - 1, beatI + 1);

		document
			.querySelector(".main")
			.scrollIntoView({ behavior: "instant", block: "end" });

		deepDiveOpen = false;
		deepDiveContent = [];
	};

	const prev = () => {
		if (beatI === 1) return;

		if (beatI === numBeats - 1 || !locked) {
			document
				.querySelector(".main")
				.scrollIntoView({ behavior: "instant", block: "end" });
			locked = true;
		}

		direction = "backward";
		beatI = Math.max(0, beatI - 1);

		deepDiveOpen = false;
		deepDiveContent = [];
	};

	const onKeyDown = (e) => {
		if (!started) return;
		if (e.key === "ArrowDown") {
			next();
		} else if (e.key === "ArrowUp") {
			prev();
		} else if (e.key === "ArrowLeft") {
			side = "mom";
		} else if (e.key === "ArrowRight") {
			side = "baby";
		}
	};

	$effect(() => {
		if (beatI >= numBeats - 1 || !started) {
			showBoth = true;
		} else {
			showBoth = false;
		}
	});

	$effect(() => switchSides(side));
</script>

<svelte:window on:keydown={onKeyDown} />

<article class:locked>
	<div class="main" use:focusTrap={locked && !deepDiveOpen}>
		<Title bind:started bind:side bind:beatI bind:titleHeight />

		<figure
			class="story"
			class:started
			style={`--title-height: ${titleHeight}px`}
		>
			<Html
				visible={started}
				bind:side
				bind:beatI
				bind:deepDiveOpen
				bind:deepDiveContent
				bind:locked
			/>
			<World {side} {showBoth} {direction} {beatI} />

			<figcaption class="sr-only">{description}</figcaption>
		</figure>

		<Bottom
			visible={started}
			{atTheEnd}
			{numBeats}
			{next}
			{prev}
			bind:locked
			bind:side
			bind:beatI
		/>

		<DeepDive bind:open={deepDiveOpen} content={deepDiveContent} {side} />
		<div class="gradient" class:visible={beatI < numBeats - 1}></div>
	</div>

	<Methods />

	<svelte:boundary onerror={(e) => console.error(e)}>
		<Footer recirc={true} recircImages={true} />
	</svelte:boundary>
</article>

<style>
	article {
		overflow: auto;
		height: 100svh;
	}

	article.locked {
		overflow: hidden;
	}

	.main {
		position: relative;
		overflow: hidden;
		height: 100svh;
	}

	.story {
		position: relative;
		overflow: hidden;
		aspect-ratio: 2400 / 6251;
		width: 100%;
		height: 100svh;
		max-width: 1000px;
		margin: 0 auto;
		transform: translate(0, -100px);
		transition:
			transform var(--1s) calc(var(--1s) * 0.5) ease-in-out,
			max-width var(--1s) calc(var(--1s) * 0.5) ease-in-out;
	}

	.story.started {
		max-width: 100vw;
		transform: translate(
			0,
			calc(-1 * (var(--title-height) + var(--header-height)))
		);
	}

	.gradient {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 6rem;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 1) 85%
		);
		z-index: 3;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
	}

	.gradient.visible {
		opacity: 1;
	}

	@media (max-width: 650px) {
		.story {
			transform: translate(0, 0);
		}
	}
</style>
