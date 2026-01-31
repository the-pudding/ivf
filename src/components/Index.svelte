<script>
	import Title from "$components/Title.svelte";
	import Text from "$components/Text.svelte";
	import World from "$components/World.svelte";
	import Footer from "$components/Footer.svelte";
	import momBeats from "$data/beats-mom.csv";
	import chevronUpSvg from "$svg/chevron-up.svg";
	import chevronDownSvg from "$svg/chevron-down.svg";
	import parentSvg from "$svg/parent-preview.svg";
	import babySvg from "$svg/baby-preview.svg";
	import _ from "lodash";

	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let started = $state(false);
	let locked = $state(true);
	let side = $state("mom");
	let showBoth = $state(true);
	let beatI = $state(0);
	let direction = $state("forward");
	let titleHeight = $state(0);

	const switchSides = () => {
		const sideEls = document.querySelectorAll(".mask .Overlay path");
		sideEls.forEach((el) => {
			el.style.transition = "fill-opacity 1s ease-in-out";
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
	};

	const prev = () => {
		if (beatI === 1) return;
		direction = "backward";
		beatI = Math.max(0, beatI - 1);
		locked = true;
	};

	const restart = (newSide) => {
		locked = true;
		document
			.querySelector(".main")
			.scrollIntoView({ behavior: "instant", block: "end" });
		side = newSide;
		beatI = 1;
	};

	const showCredits = () => {
		locked = false;
		document.querySelector("footer").scrollIntoView({ behavior: "smooth" });
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
	<div class="main">
		<Title bind:started bind:side bind:beatI bind:titleHeight />

		<div class="story" class:started style={`--title-height: ${titleHeight}px`}>
			<Text visible={started} bind:side bind:beatI />
			<World {side} {showBoth} {direction} {beatI} />
		</div>

		<div class="bottom" class:visible={started}>
			{#if showBoth && beatI === numBeats - 1}
				<button class="restart parent" onclick={() => restart("mom")}>
					<span>{@html parentSvg}</span>
					Restart as Parent
				</button>
				<button class="restart baby" onclick={() => restart("baby")}>
					Restart as baby
					<span>{@html babySvg}</span>
				</button>
				<button onclick={showCredits}>Credits</button>
			{:else}
				<span class="desktop-instructions">Tap here to navigate the story</span>
				<button class="nav" onclick={prev}
					><span>{@html chevronUpSvg}</span> Prev</button
				>
				<span class="mobile-instructions">Tap to navigate</span>
				<button class="nav" onclick={next}
					><span>{@html chevronDownSvg}</span> Next</button
				>
				<span class="desktop-instructions">Or use your keyboard arrows</span>
			{/if}
		</div>

		<div class="gradient" class:visible={beatI < numBeats - 1}></div>
	</div>

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
			transform 1s 0.5s ease-in-out,
			max-width 1s 0.5s ease-in-out;
	}

	.story.started {
		max-width: 100vw;
		transform: translate(
			0,
			calc(-1 * (var(--title-height) + var(--header-height)))
		);
	}

	.bottom {
		display: none;
		align-items: center;
		justify-content: center;
		gap: 4px;
		height: 4rem;
		background: rgba(0, 0, 0, 5);
		border-top: 1px solid #4c5c8f;
		position: absolute;
		bottom: 0;
		z-index: 4;
		width: 100%;
		text-transform: uppercase;
		font-size: var(--12px);
		font-weight: bold;
		padding: 0 1rem;
	}

	.bottom.visible {
		display: flex;
	}

	button.nav,
	button.restart {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		height: 2.25rem;
	}

	button.nav span {
		height: 18px;
		width: 18px;
	}

	button.restart span {
		height: 20px;
		width: 20px;
	}

	button.restart.parent span {
		height: 16px;
		width: 16px;
	}

	.mobile-instructions {
		display: none;
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
		.mobile-instructions {
			display: flex;
		}

		.desktop-instructions {
			display: none;
		}

		.bottom {
			justify-content: space-between;
		}

		.story {
			transform: translate(0, 0);
		}
	}
</style>
