<script>
	import chevronUpSvg from "$svg/chevron-up.svg";
	import chevronDownSvg from "$svg/chevron-down.svg";
	import parentSvg from "$svg/parent-preview.svg";
	import babySvg from "$svg/baby-preview.svg";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	let dimensions = new useWindowDimensions();

	let {
		visible,
		atTheEnd,
		numBeats,
		next,
		prev,
		locked = $bindable(),
		side = $bindable(),
		beatI = $bindable()
	} = $props();

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
</script>

<div class="bottom" class:visible>
	{#if atTheEnd}
		<div class="counter left" class:visible={side === "mom"}>
			step {beatI}/{numBeats - 1}
		</div>

		<button class="restart parent" onclick={() => restart("mom")}>
			<span>{@html parentSvg}</span>
			Restart as Parent
		</button>

		<button class="restart baby" onclick={() => restart("baby")}>
			Restart as baby
			<span>{@html babySvg}</span>
		</button>

		<button onclick={showCredits}>Credits</button>

		<div class="counter right" class:visible={side === "baby"}>
			step {beatI}/{numBeats - 1}
		</div>
	{:else}
		<div class="counter left" class:visible={side === "mom"}>
			step {beatI}/{numBeats - 1}
		</div>

		<span class="desktop-instructions">Tap here to navigate the story</span>

		<button class="nav" onclick={prev}>
			<span>{@html chevronUpSvg}</span>
			Prev
		</button>

		<span class="mobile-instructions">
			Tap to navigate
			{#if dimensions.width < 650}
				<br />(step {beatI}/{numBeats - 1})
			{/if}
		</span>

		<button class="nav" onclick={next}>
			<span>{@html chevronDownSvg}</span>
			Next
		</button>

		<span class="desktop-instructions">Or use your keyboard arrows</span>

		<div class="counter right" class:visible={side === "baby"}>
			step {beatI}/{numBeats - 1}
		</div>
	{/if}
</div>

<style>
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
		text-align: center;
		font-size: var(--12px);
		font-weight: bold;
		padding: 0 1rem;
	}

	.bottom.visible {
		display: flex;
	}

	button {
		height: 2.25rem;
	}

	button.nav,
	button.restart {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
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

	.counter {
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
	}

	.counter.visible {
		opacity: 1;
	}

	.counter.left {
		margin-right: auto;
	}

	.counter.right {
		margin-left: auto;
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

		.counter {
			display: none;
		}
	}
</style>
