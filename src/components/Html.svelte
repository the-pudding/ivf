<script>
	import { fade } from "svelte/transition";
	import parentSvg from "$svg/parent-preview.svg";
	import babySvg from "$svg/baby-preview.svg";
	import momBeats from "$data/beats-mom.csv";
	import copy from "$data/copy.json";
	import _ from "lodash";

	let {
		visible,
		side = $bindable(),
		beatI,
		deepDiveOpen = $bindable(),
		deepDiveContent = $bindable()
	} = $props();

	const DELAY = 2000;
	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let definitionVisible = $state(false);
	let definitionContent = $state("");

	let content = $derived(
		beatI === 0 ? [] : (copy.beats?.[side]?.[beatI - 1]?.text ?? "")
	);
	let paragraphs = $derived(
		Array.isArray(content) ? content.map((d) => d.value) : [content]
	);

	const setUpButtons = () => {
		const deepDiveButtons = document.querySelectorAll('span[id^="deep-"]');
		deepDiveButtons.forEach((button) => {
			const id = button.id;
			button.addEventListener("click", () => {
				deepDiveOpen = true;
				deepDiveContent = copy.beats[side][beatI - 1][id];
			});
		});

		const definitionSpans = document.querySelectorAll(
			'span[id^="definition-"]'
		);
		definitionSpans.forEach((span) => {
			span.addEventListener("mouseenter", (e) => {
				const mouseX = e.clientX;
				const mouseY = e.clientY;
				const id = span.id;
				definitionContent = copy.beats[side][beatI - 1][id];
				const defEl = document.querySelector("p.definition");
				defEl.style.left = `${mouseX}px`;
				defEl.style.top = `${mouseY}px`;
				definitionVisible = true;
			});

			span.addEventListener("mouseleave", () => {
				definitionVisible = false;
				definitionContent = "";
			});
		});
	};

	$effect(() => setUpButtons(paragraphs));
</script>

<div class="html-wrapper" class:visible>
	<div class="switch mom" class:visible={beatI < numBeats - 1}>
		<span class="switch-text" class:visible={side === "baby"}>Switch to</span>
		<button
			class="parent"
			onclick={() => (side = "mom")}
			class:inactive={side === "baby"}
		>
			<span>{@html parentSvg}</span>
			Parent
		</button>
	</div>

	<div class="copy" class:left={side === "baby"} class:right={side === "mom"}>
		{#each paragraphs as paragraph, i (paragraph)}
			<p
				class:multi={paragraphs.length > 1}
				in:fade={{ duration: 300, delay: DELAY + i * 800 }}
			>
				{@html paragraph}
			</p>
		{/each}
	</div>

	<div class="switch baby" class:visible={beatI < numBeats - 1}>
		<span class="switch-text" class:visible={side === "mom"}>Switch to</span>
		<button
			class="baby"
			onclick={() => (side = "baby")}
			class:inactive={side === "mom"}
		>
			Baby
			<span>{@html babySvg}</span>
		</button>
	</div>

	<p class="definition" class:visible={definitionVisible}>
		{@html definitionContent}
	</p>
</div>

<style>
	.html-wrapper {
		position: absolute;
		z-index: 4;
		width: 100%;
		height: 100%;
		padding: 0 1rem;
		display: grid;
		grid-template-columns: auto 1fr 1fr auto;
		align-items: center;
		gap: 1rem;
		opacity: 0;
		pointer-events: none;
		transition: opacity calc(var(--1s) * 0.5) calc(var(--1s) * 1.5) ease-in-out;
	}

	.html-wrapper.visible {
		pointer-events: all;
		opacity: 1;
	}

	.switch {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-weight: bold;
		color: #f7e3bd;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
	}

	.switch.visible {
		opacity: 1;
	}

	.switch.mom {
		grid-column: 1;
	}

	.switch.baby {
		grid-column: 4;
	}

	.switch-text {
		opacity: 0;
		font-size: var(--14px);
	}

	.switch-text.visible {
		opacity: 1;
	}

	.copy {
		max-width: 500px;
	}

	.copy.left {
		grid-column: 2;
		justify-self: start;
	}

	.copy.right {
		grid-column: 3;
		justify-self: end;
	}

	.copy p {
		color: var(--color-bg);
		background: rgba(249, 244, 255, 0.95);
		color: var(--color-bg);
		border: 2px solid #4c5c8f;
		border-radius: 8px;
		width: fit-content;
		padding: 1rem;
	}

	.left p.multi:nth-of-type(1) {
		transform: translate(10%, 0);
	}

	.left p.multi:nth-of-type(3) {
		transform: translate(5%, 0);
	}

	.right p.multi:nth-of-type(1) {
		transform: translate(-10%, 0);
	}

	.right p.multi:nth-of-type(3) {
		transform: translate(-5%, 0);
	}

	p.definition {
		position: fixed;
		background: #f9f4ff;
		font-size: var(--14px);
		border: 2px solid var(--color-black);
		border-radius: 4px;
		color: var(--color-bg);
		padding: 1rem;
		visibility: hidden;
		z-index: var(--z-top);
		max-width: 360px;
	}

	p.definition.visible {
		visibility: visible;
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

	button.inactive {
		font-weight: normal;
		border: 2px solid #4c5c8f;
		color: #4c5c8f;
		background: var(--color-bg);
	}

	button.inactive:hover {
		background: var(--color-gray-900);
	}

	:global(span[id^="definition-"]) {
		font-weight: bold;
	}

	/* :global(span[id^="definition-"]::before) {
		content: "";
		display: inline-block;
		width: 14px;
		height: 14px;
		margin-right: 2px;
		vertical-align: middle;
		transform: translate(0, -2px);
		background: url("assets/svg/info.svg") no-repeat center / contain;
	} */

	:global(span[id^="definition-"]:hover) {
		cursor: help;
	}

	:global(span[id^="deep-"]) {
		font-weight: bold;
		border: 2px solid #4c5c8f;
		background: var(--color-button-bg);
		padding: 0.1rem 0.25rem;
		border-radius: 4px;
	}

	:global(span[id^="deep-"]:hover) {
		cursor: pointer;
		background-color: var(--color-button-hover);
	}

	@media (min-width: 1800px) {
		.copy.left,
		.copy.right {
			justify-self: center;
		}
	}

	@media (max-width: 1000px) {
		.html-wrapper {
			align-items: start;
		}

		.switch {
			transform: translate(0, 4rem);
		}

		.copy.right,
		.copy.left {
			position: absolute;
			bottom: 6rem;
			left: 50%;
			transform: translate(-50%, 0);
			grid-column: none;
			width: 100%;
			max-width: 600px;
			padding: 0 1.25rem;
		}

		.copy p {
			margin: 0.15rem 0;
		}

		.left p.multi:nth-of-type(1) {
			transform: translate(1rem, 0);
		}

		.left p.multi:nth-of-type(3) {
			transform: translate(0.5rem, 0);
		}

		.right p.multi:nth-of-type(1) {
			transform: translate(-1rem, 0);
		}

		.right p.multi:nth-of-type(3) {
			transform: translate(-0.5rem, 0);
		}
	}

	@media (max-width: 600px) {
		button,
		.switch-text {
			font-size: var(--12px);
		}
	}

	@media (max-width: 400px) {
		.copy p {
			font-size: var(--14px);
			line-height: 1.3;
			padding: 0.75rem;
		}
	}
</style>
