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

	$effect(() => {
		console.log(beatI)
	})
</script>

<div class="bottom" class:end={atTheEnd} class:visible>
	{#if atTheEnd}
		<div class="counter left" class:visible={side === "mom"}>
			{beatI}/{numBeats - 1}
		</div>

		<button class="nav" disabled={beatI === 1} onclick={prev}>
			<span>{@html chevronUpSvg}</span>
			Prev
		</button>

		<button class="credit-btn" onclick={showCredits}>Go to Credits</button>

		<button class="nav" disabled={atTheEnd} onclick={next}>
			<span>{@html chevronDownSvg}</span>
			Next
		</button>

		<div class="counter right" class:visible={side === "baby"}>
			{beatI}/{numBeats - 1}
		</div>
	{:else}
		<div class="counter left" class:visible={side === "mom"}>
			{beatI}/{numBeats - 1}
		</div>

		<span class="desktop-instructions left">Tap to navigate</span>

		<button class="nav" disabled={beatI === 1} onclick={prev}>
			<span>{@html chevronUpSvg}</span>
			Prev
		</button>

		<span class="mobile-instructions">
			Tap to navigate
			{#if dimensions.width < 650}
				<br />{beatI}/{numBeats - 1}
			{/if}
		</span>

		<button class="nav" disabled={atTheEnd} onclick={next}>
			<span>{@html chevronDownSvg}</span>
			Next
		</button>

		<span class="desktop-instructions right">Or use arrow key</span>

		<div class="counter right" class:visible={side === "baby"}>
			{beatI}/{numBeats - 1}
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

	.desktop-instructions.left {
		font-size: var(--12px);
		text-align: right;
	}

	.desktop-instructions.right {
		font-size: var(--12px);
		text-align: left;
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

	.credit-btn {
		border: 2px solid var(--ivf-mid-purple);
		color: var(--ivf-mid-purple);
    	background: var(--color-bg); 
		box-shadow: 0 2px 16px rgba(76, 92, 143, 0.5);
		line-height: 1;
	}

	.credit-btn:hover {
		background: var(--ivf-mid-yellow);
		border: 2px solid var(--ivf-mid-yellow);
		box-shadow: 0 2px 16px rgba(76, 92, 143, 0.5);
		color: var(--color-bg); 
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

	@media (max-width: 600px) {
		button {
			font-size: var(--12px);
		}

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
