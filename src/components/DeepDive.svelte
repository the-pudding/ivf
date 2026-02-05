<script>
	let { open = $bindable(), side } = $props();

	const close = () => {
		open = false;
	};
</script>

<div
	class="deep"
	class:open
	class:left={side === "baby"}
	class:right={side === "mom"}
>
	<button onclick={close}>close</button>
</div>

<style>
	.deep {
		background: var(--color-fg);
		color: var(--color-bg);
		height: 100svh;
		position: absolute;
		top: 0;
		width: 40%;
		max-width: 450px;
		z-index: 4;
		transition: none;
	}

	.deep.left {
		left: 0;
		transform: translate(-100%, 0);
	}

	.deep.right {
		right: 0;
		transform: translate(100%, 0);
	}

	.deep.open {
		transform: translate(0, 0);
		transition: transform 0.5s ease-in-out;
	}
</style>
