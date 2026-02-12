<script>
	import xSvg from "$svg/x.svg";
	import focusTrap from "$actions/focusTrap.js";

	let { open = $bindable(), content, side } = $props();

	const close = () => {
		open = false;
	};
</script>

<div
	class="deep"
	class:open
	class:left={side === "baby"}
	class:right={side === "mom"}
	use:focusTrap={open}
>
	<button
		class="close"
		onclick={close}
		aria-label="close"
		tabindex={open ? "0" : "-1"}
	>
		{@html xSvg}
	</button>

	{#each content as { type, value }}
		{#if type === "text"}
			<p>{@html value}</p>
		{:else if type === "img"}
			<img src={value} alt="" />
		{/if}
	{/each}
</div>

<style>
	.deep {
		height: 100svh;
		position: absolute;
		top: 0;
		width: 40%;
		max-width: 450px;
		background: #090d2e;
		z-index: var(--z-top);
		transition: none;
		padding: 1rem;
	}

	.deep.left {
		left: 0;
		transform: translate(-100%, 0);
		border-right: 2px solid #4c5c8f;
	}

	.deep.right {
		right: 0;
		transform: translate(100%, 0);
		border-left: 2px solid #4c5c8f;
	}

	.deep.open {
		transform: translate(0, 0);
		transition: transform calc(var(--1s) * 0.5) ease-in-out;
	}

	button.close {
		background: none;
		border: none;
		padding: 1rem;
		height: 20px;
		width: 20px;
		padding: 0;
		margin-bottom: 2rem;
		display: block;
	}

	.left button.close {
		margin-left: auto;
	}
</style>
