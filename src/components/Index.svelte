<script>
	import Title from "$components/Title.svelte";
	import World from "$components/World.svelte";
	import Footer from "$components/Footer.svelte";
	import momBeats from "$data/beats-mom.csv";
	import _ from "lodash";
	import copy from "$data/copy.json";

	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let started = $state(false);
	let side = $state("both");
	let beatI = $state(0);
	let direction = $state("forward");
	let titleHeight = $state(0);

	let text = $derived(
		beatI === 0 ? "" : (copy.beats?.[side]?.[beatI - 1]?.text ?? "")
	);
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "ArrowDown") {
			direction = "forward";
			beatI = Math.min(numBeats - 1, beatI + 1);
		} else if (e.key === "ArrowUp") {
			direction = "backward";
			beatI = Math.max(0, beatI - 1);
		} else if (e.key === "ArrowLeft") {
			side = "mom";
		} else if (e.key === "ArrowRight") {
			side = "baby";
		}
	}}
/>

<div class="main">
	<Title bind:started bind:side bind:beatI bind:titleHeight />

	<div class="camera" class:started style={`--title-height: ${titleHeight}px`}>
		{#if text !== ""}
			<div
				class="copy"
				class:left={side === "baby"}
				class:right={side === "mom"}
			>
				{#if Array.isArray(text)}
					{#each text as { value: paragraph }}
						<p>{@html paragraph}</p>
					{/each}
				{:else}
					<p>{@html text}</p>
				{/if}
			</div>
		{/if}

		<World {started} {side} {direction} {beatI} {numBeats} />
	</div>

	<div class="gradient" class:visible={beatI < numBeats - 1}></div>
	<Footer />
</div>

<style>
	.main {
		overflow: hidden;
		height: 100svh;
	}

	.camera {
		position: relative;
		overflow: hidden;
		aspect-ratio: 2400 / 6251;
		width: 100%;
		height: 100svh;
		max-width: 1400px;
		margin: 0 auto;
		transition: transform 1s 0.5s ease-in-out;
	}

	.camera.started {
		transform: translate(
			0,
			calc(-1 * (var(--title-height) + var(--header-height)))
		);
	}

	.copy {
		position: absolute;
		top: 50%;
		transform: translate(0, -50%);
		background: rgba(249, 244, 255, 0.95);
		color: var(--color-bg);
		border: 2px solid #4c5c8f;
		border-radius: 8px;
		color: var(--color-bg);
		padding: 0.5rem 1rem;
		z-index: 1;
		width: 45%;
	}

	.copy.left {
		left: 1rem;
	}

	.copy.right {
		right: 1rem;
	}

	.gradient {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 200px;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0),
			rgba(0, 0, 0, 1) 85%
		);
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
	}

	.gradient.visible {
		opacity: 1;
	}
</style>
