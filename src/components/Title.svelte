<script>
	import { onMount } from "svelte";
	import copy from "$data/copy.json";
	import parentSvg from "$svg/parent-preview.svg";
	import babySvg from "$svg/baby-preview.svg";

	let {
		started = $bindable(),
		side = $bindable(),
		beatI = $bindable(),
		titleHeight = $bindable()
	} = $props();

	let visible = $state(false);

	const start = (id) => {
		started = true;
		side = id;
		beatI = 1;
		visible = false;

		const links = document.querySelectorAll(".bylines a");
		links.forEach((link) => {
			link.setAttribute("tabindex", "-1");
		});
	};

	onMount(() => {
		visible = true;
	});
</script>

<div id="title" class:visible bind:clientHeight={titleHeight}>
	<h1>{copy.hed}</h1>

	<div class="bylines" class:visible>
		<div class="byline">{@html copy.byline}</div>
		<div class="byline">{@html copy.byline2}</div>
		<div class="byline">{@html copy.byline3}</div>
	</div>

	<div class="instructions" class:visible>
		<div class="text">{@html copy.landing.text}</div>

		<div class="buttons">
			<button
				class="parent"
				onclick={() => start("mom")}
				tabindex={started ? -1 : 0}
			>
				<span>{@html parentSvg}</span>
				Parent</button
			>
			<span>and</span>
			<button
				class="baby"
				onclick={() => start("baby")}
				tabindex={started ? -1 : 0}
			>
				Baby
				<span>{@html babySvg}</span>
			</button>
		</div>

		<div class="select">Select one to continue</div>
	</div>
</div>

<style>
	#title {
		margin-top: var(--header-height);
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: var(--z-top);
		padding: 0 1rem;
		pointer-events: none;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
	}

	#title.visible {
		pointer-events: all;
		opacity: 1;
	}

	h1 {
		font-family: var(--serif);
		margin: 2rem 0;
		text-align: center;
		font-size: var(--80px);
		max-width: 800px;
		max-width: 600px;
		line-height: 1.1;
	}

	.bylines {
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) calc(var(--1s) * 0.5) ease-in-out;
	}

	.bylines.visible {
		opacity: 1;
	}

	.byline:nth-of-type(1) {
		font-size: var(--18px);
	}

	.byline:nth-of-type(2) {
		font-size: var(--14px);
		margin-top: 0.5rem;
	}

	.byline:nth-of-type(3) {
		font-size: var(--14px);
		margin-top: 0.25rem;
	}

	.instructions {
		font-size: var(--18px);
		background: rgba(249, 244, 255, 0.95);
		color: var(--color-bg);
		border: 2px solid #4c5c8f;
		border-radius: 8px;
		font-weight: 300;
		position: absolute;
		top: calc(100% + 3rem);
		max-width: 550px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		margin: 0 1rem;
		padding: 1.5rem;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) var(--1s) ease-in-out;
	}

	.instructions.visible {
		opacity: 1;
	}

	:global(.instructions strong) {
		white-space: pre;
	}

	.buttons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: var(--14px);
	}

	button {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 2.25rem;
	}

	button span {
		width: 20px;
		height: 20px;
	}

	button.parent span {
		width: 16px;
		height: 16px;
	}

	.select {
		text-transform: uppercase;
		font-size: var(--12px);
		font-weight: bold;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: var(--48px);
		}

		.byline:nth-of-type(1) {
			font-size: var(--16px);
		}

		.byline:nth-of-type(2),
		.byline:nth-of-type(3) {
			font-size: var(--12px);
		}

		.instructions {
			font-size: var(--16px);
		}

		button {
			font-size: var(--12px);
		}
	}

	@media (max-width: 400px) {
		h1 {
			font-size: var(--40px);
		}
	}
</style>
