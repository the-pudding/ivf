<script>
	import { fade } from "svelte/transition";
	import { prefersReducedMotion } from "svelte/motion";
	import parentSvg from "$svg/parent-preview.svg";
	import babySvg from "$svg/baby-preview.svg";
	import momBeats from "$data/beats-mom.csv";
	import copy from "$data/copy.json";
	import _ from "lodash";
	import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
	let dimensions = new useWindowDimensions();

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

	let instructionsNeeded = $state(true);
	let definitionVisible = $state(false);
	let definitionContent = $state("");

	let atTheEnd = $derived(beatI === numBeats - 1);
	let content = $derived(
		beatI === 0 ? [] : (copy.beats?.[side]?.[beatI - 1]?.text ?? "")
	);
	let paragraphs = $derived(
		Array.isArray(content) ? content.map((d) => d.value) : [content]
	);

	const showInstructions = (definitionId) => {
		const firstDefinition = document.querySelector(
			`button#definition-${definitionId}`
		);
		firstDefinition.style.position = "relative";
		const instructionSpan = document.createElement("span");
		instructionSpan.textContent = "Hover over for definitions";
		instructionSpan.classList.add("instructions");
		instructionSpan.classList.add("visible");
		firstDefinition.appendChild(instructionSpan);
	};

	const setUpButtons = () => {
		definitionVisible = false;
		definitionContent = "";

		const deepDiveSpans = document.querySelectorAll('span[id^="deep-"]');
		deepDiveSpans.forEach((span) => {
			const id = span.id;

			const button = document.createElement("button");
			button.id = id;
			button.innerHTML = span.innerHTML;
			button.className = span.className;
			span.replaceWith(button);

			button.addEventListener("click", () => {
				deepDiveOpen = true;
				deepDiveContent = copy.beats[side][beatI - 1][id];
			});
		});

		const definitionSpans = document.querySelectorAll(
			'span[id^="definition-"]'
		);
		definitionSpans.forEach((span) => {
			const id = span.id;
			const button = document.createElement("button");
			button.id = id;
			button.innerHTML = span.innerHTML;
			button.className = span.className;
			span.replaceWith(button);

			const show = (x, y) => {
				const instructionsSpan = document.querySelector("span.instructions");
				if (instructionsSpan) instructionsSpan.classList.remove("visible");

				definitionContent = copy.beats[side][beatI - 1][id];
				const defEl = document.querySelector("p.definition");

				defEl.style.left = `${x}px`;
				defEl.style.top = `${y}px`;
				if (dimensions.width < 1000)
					defEl.style.transform = "translate(0, calc(-100% - 1.5rem))";

				definitionVisible = true;
			};

			button.addEventListener("mouseenter", (e) => {
				const rect = button.getBoundingClientRect();
				const x = rect.left;
				const y = rect.top;
				show(x, y);
			});

			button.addEventListener("click", (e) => {
				if (definitionVisible) {
					definitionVisible = false;
					definitionContent = "";
				} else {
					const rect = button.getBoundingClientRect();
					const x = rect.left;
					const y = rect.top;
					show(x, y);
				}
			});

			button.addEventListener("mouseleave", () => {
				definitionVisible = false;
				definitionContent = "";
			});
		});

		if (
			instructionsNeeded &&
			((side === "mom" && beatI === 4) || (side === "baby" && beatI == 2))
		) {
			showInstructions(side === "mom" ? "retrievals" : "follicles");
			instructionsNeeded = false;
		}
	};

	$effect(() => setUpButtons(paragraphs));
</script>

<div class="html-wrapper" class:visible>
	<div class="switch mom">
		<span class="switch-text" class:visible={side === "baby" || atTheEnd}
			>{atTheEnd ? "Restart as" : "Switch to"}</span
		>
		<button
			class="parent"
			onclick={() => (side = "mom")}
			class:inactive={side === "baby" && !atTheEnd}
			tabindex={visible ? "0" : "-1"}
		>
			<span>{@html parentSvg}</span>
			Parent
		</button>
	</div>

	<div class="copy" class:left={side === "baby"} class:right={side === "mom"}>
		{#each paragraphs as paragraph, i (paragraph)}
			<p
				class:multi={paragraphs.length > 1}
				in:fade={{
					duration: prefersReducedMotion.current ? 0 : 300,
					delay: prefersReducedMotion.current ? 0 : DELAY + i * 800
				}}
			>
				{@html paragraph}
			</p>
		{/each}
	</div>

	<div class="switch baby">
		<span class="switch-text" class:visible={side === "mom" || atTheEnd}
			>{atTheEnd ? "Restart as" : "Switch to"}</span
		>
		<button
			class="baby"
			onclick={() => (side = "baby")}
			class:inactive={side === "mom" && !atTheEnd}
			tabindex={visible ? "0" : "-1"}
		>
			Baby
			<span>{@html babySvg}</span>
		</button>
	</div>

	<p class="definition" class:visible={definitionVisible} role="tooltip">
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

	:global(.copy p a, p.definition a) {
		pointer-events: auto;
		color: var(--color-link-dark);
		text-decoration-color: var(--color-link-dark);
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
		pointer-events: none;
	}

	p.definition.visible {
		visibility: visible;
	}

	:global(span.instructions) {
		position: absolute;
		font-size: var(--12px);
		top: -1.75rem;
		left: 50%;
		transform: translate(-50%, -100%);
		background: var(--color-button-bg);
		padding: 0.5rem;
		border-radius: 4px;
		pointer-events: none;
		opacity: 0;
		transition: opacity calc(var(--1s) * 0.3) ease-in;
	}

	:global(span.instructions.visible) {
		opacity: 1;
	}

	:global(span.instructions)::after {
		content: "";
		position: absolute;
		top: calc(100% - 1px);
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 6px solid var(--color-button-bg);
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

	:global(button[id^="definition-"]) {
		font-weight: bold;
		white-space: nowrap;
		background: none;
		border: none;
		padding: 0;
		text-transform: none;
	}

	:global(button[id^="definition-"]::before, span.instructions::before) {
		content: "";
		display: inline-block;
		width: 14px;
		height: 14px;
		margin-right: 2px;
		vertical-align: middle;
		transform: translate(0, -2px);
		background: url("/assets/svg/info.svg") no-repeat center / contain;
	}

	:global(button[id^="definition-"]:hover) {
		cursor: help;
	}

	:global(button[id^="deep-"]) {
		text-transform: none;
		font-weight: bold;
		border: 2px solid #4c5c8f;
		background: var(--color-button-bg);
		padding: 0.1rem 0.25rem;
		border-radius: 4px;
		white-space: nowrap;
	}

	:global(button[id^="deep-"]:hover) {
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
