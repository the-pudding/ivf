<script>
	import chevronUpSvg from "$svg/chevron-up.svg";
	import chevronDownSvg from "$svg/chevron-down.svg";
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

	const showCredits = () => {
		locked = false;
		document.querySelector("#methods").scrollIntoView({ behavior: "smooth" });
	};
</script>

<div class="bottom" class:end={atTheEnd} class:visible>
	{#if atTheEnd}
		<div class="counter left" class:visible={side === "mom"}>
			step {beatI}/{numBeats - 1}
		</div>

		<button class="nav" onclick={prev}>
			<span>{@html chevronUpSvg}</span>
			Prev
		</button>

		<button onclick={showCredits}>Go to Credits</button>

		<button class="nav" onclick={next}>
			<span>{@html chevronDownSvg}</span>
			Next
		</button>

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
		gap: 0.5rem;
		height: 4rem;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(2px);
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

	.desktop-instructions {
		font-size: var(--12px);
	}

	button {
		height: 2.25rem;
		font-size: var(--16px);
		transition: all calc(var(--1s) * 0.3) ease;
		border: none;
		box-shadow: 0 2px 16px rgba(247, 227, 189, 0.5);
	}

	button:hover {
		background: var(--ivf-mid-yellow);
		transform: translateY(-2px);
	}

	button.nav,
	button.restart {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		border: none;
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
