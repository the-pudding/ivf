<script>
	import { fade, fly } from "svelte/transition";
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
		showBoth,
		side = $bindable(),
		beatI = $bindable(),
		deepDiveOpen = $bindable(),
		deepDiveContent = $bindable(),
		locked = $bindable()
	} = $props();

	const DELAY = 2000;
	const numBeats = Object.entries(_.groupBy(momBeats, "id")).map(
		([id, steps]) => ({
			id,
			steps
		})
	).length;

	let instructionsNeededDef = $state(true);
	let instructionsNeededDeep = $state(true);
	let definitionVisible = $state(false);
	let definitionContent = $state("");
	let finalFaded = $state(false);
	let lastTriggerEl = $state(null);

	let atTheEnd = $derived(beatI === numBeats - 1);
	let content = $derived(
		beatI === 0 ? [] : (copy.beats?.[side]?.[beatI - 1]?.text ?? "")
	);
	let paragraphs = $derived(
		Array.isArray(content) ? content.map((d) => d.value) : [content]
	);

	const showInstructionsDef = (definitionId) => {
		const firstDefinition = document.querySelector(
			`button#definition-${definitionId}`
		);
		firstDefinition.style.position = "relative";
		const instructionSpan = document.createElement("span");
		instructionSpan.textContent = "Hover for definitions";
		instructionSpan.classList.add("instructionsDef");
		instructionSpan.classList.add("visible");
		firstDefinition.appendChild(instructionSpan);
	};

	const showInstructionsDeep = (deepId) => {
		const firstDeep = document.querySelector(
			`button#deep-${deepId}`
		);
		firstDeep.style.position = "relative";
		const instructionSpan = document.createElement("span");
		instructionSpan.textContent = "Tap for more info";
		instructionSpan.classList.add("instructionsDeep");
		instructionSpan.classList.add("visible");
		firstDeep.appendChild(instructionSpan);
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
			button.classList.add("btn-deep-dive");
			span.replaceWith(button);

			button.addEventListener("click", () => {
				instructionsNeededDeep = false;
				lastTriggerEl = button;
				deepDiveOpen = true;
				deepDiveContent = [copy.beats[side][beatI - 1][id], button.id];
			});

			button.addEventListener("mouseenter", (e) => {
				instructionsNeededDeep = false;
			});

			button.addEventListener("mouseleave", (e) => {
				instructionsNeededDeep = false;
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
			button.classList.add("btn-definition");
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
				instructionsNeededDef = false;
				const rect = button.getBoundingClientRect();
				const x = rect.left;
				const y = rect.top;
				show(x, y);
			});

			button.addEventListener("click", (e) => {
				instructionsNeededDef = false;
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

		$effect(() => {
			document.querySelectorAll('.instructionsDef, .instructionsDeep').forEach(el => el.remove());

			if (instructionsNeededDef && ((side === "mom" && beatI === 4) || (side === "baby" && beatI == 2))) {
				showInstructionsDef(side === "mom" ? "retrievals" : "follicles");
			}

			if (instructionsNeededDeep && ((side === "mom" && beatI === 5) || (side === "baby" && beatI == 3))) {
				showInstructionsDeep(side === "mom" ? "needles" : "births");
			}
		});
	};

	const switchSides = (toSide) => {
		if (atTheEnd) {
			locked = true;
			document
				.querySelector(".main")
				.scrollIntoView({ behavior: "instant", block: "end" });
			side = toSide;
			beatI = 1;
		} else {
			side = toSide;
		}
	};

	$effect(() => setUpButtons(paragraphs));

	$effect(() => {
		const pauseForSecs = 12;
		if (showBoth && atTheEnd) {
			const timer = setTimeout(() => {
				finalFaded = true;
			}, pauseForSecs * 1000);
			
			return () => {
				clearTimeout(timer);
				finalFaded = false;
			};
		} else {
			finalFaded = false;
		}
	});

	$effect(() => {
        if (!deepDiveOpen && lastTriggerEl) {
            setTimeout(() => {
                lastTriggerEl.focus();
                lastTriggerEl = null;
            }, 10);
        }
    });
</script>

<div class="html-wrapper" class:visible>
	<div class="switch mom">
		<span class="switch-text" class:visible={side === "baby" || atTheEnd}
			>{atTheEnd ? "Restart as" : "Switch to"}</span
		>
		<button
			class="parent"
			onclick={() => switchSides("mom")}
			class:inactive={side === "baby" && !atTheEnd}
			class:final={atTheEnd}
			tabindex={visible ? "0" : "-1"}
		>
			<span>{@html parentSvg}</span>
			Parent
		</button>
	</div>

	<div
		class="copy"
		class:finalStep={atTheEnd}
		class:finalFaded={finalFaded}
		class:left={side === "baby"}
		class:right={side === "mom"}
	>
		{#each paragraphs as paragraph, i (paragraph)}
			<p
				class:multi={paragraphs.length > 1}
				in:fly|local={{
					duration: prefersReducedMotion.current ? 0 : 250,
					delay: prefersReducedMotion.current ? 0 : DELAY + i * 250,
					y: 50
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
			onclick={() => switchSides("baby")}
			class:inactive={side === "mom" && !atTheEnd}
			class:final={atTheEnd}
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
		grid-template-columns: minmax(100px, auto) repeat(4, 1fr) minmax(100px, auto);
		align-items: center;
		gap: 3rem;
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
		grid-column: 6;
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
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
	}

	.copy.left {
		grid-column: 2 / 4;
		justify-self: start;
	}

	.copy.right {
		grid-column: 4 / 6;
		justify-self: end;
	}

	.copy.finalStep {
		grid-column: 3 / 5;
		margin-top: 15rem;
		justify-self: end;
	}

	.copy.finalFaded {
		opacity: 0;
	}

	.copy p {
		color: var(--color-bg);
		background: rgba(249, 244, 255, 0.95);
		color: var(--color-bg);
		border-radius: 8px;
		width: fit-content;
		padding: 1rem;
		backdrop-filter: blur(2px);
		box-shadow: 0 2px 16px rgba(249, 244, 255, 0.5);
	}

	:global(.copy p a, p.definition a) {
		pointer-events: auto;
		color: var(--color-link-dark);
		text-decoration-color: var(--color-link-dark);
	}

	:global(.copy p a:hover) {
		color: var(--color-bg);
		text-decoration-color: var(--color-bg);
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
		background: var(--color-button-bg);
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

	:global(span.instructionsDef, span.instructionsDeep) {
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
		animation: subtle-shift-relative calc(var(--1s) * 0.5) ease-in-out infinite;
	}

	@keyframes subtle-shift-relative {
		0%   { transform: translate(-50%, -100%); }
		25%  { transform: translate(calc(-50% + 1px), -100%); }
		50%  { transform: translate(-50%, -100%); }
		75%  { transform: translate(calc(-50% - 1px), -100%); }
		100% { transform: translate(-50%, -100%); }
	}

	:global(span.instructionsDef.visible, span.instructionsDeep.visible) {
		opacity: 1;
	}

	:global(span.instructionsDef::after, span.instructionsDeep::after) {
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
		justify-content: center;
		gap: 4px;
		height: 2.25rem;
		border: none;
		box-shadow: 0 2px 16px rgba(247, 227, 189, 0.5);
		transition: all calc(var(--1s) * 0.3) ease;
		cursor: not-allowed;
		border: 2px solid var(--ivf-yellow);
		width: 100%;
	}

	button:hover {
		background: var(--ivf-yellow);
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
		border: 2px solid var(--ivf-mid-purple);
		color: var(--ivf-mid-purple);
		background: var(--color-bg);
		box-shadow: 0 2px 16px rgba(76, 92, 143, 0.5);
		pointer-events: all;
		cursor: pointer;
	}

	button.inactive:hover, button.final:hover {
		background: var(--ivf-yellow);
		border: 2px solid var(--ivf-yellow);
		transform: translateY(-2px);
		font-weight: 700;
		color: var(--color-bg);
	}

	button.final {
		pointer-events: all !important;
		cursor: pointer;
	}

	:global(button[id^="definition-"]) {
		font-weight: bold;
		white-space: nowrap;
		background: none;
		border: none;
		border-radius: 0;
		background-image: linear-gradient(to right, var(--ivf-mid-purple) 70%, rgba(255,255,255,0) 0%);
		background-position: bottom;
		background-size: 8px 2px; /* 12px = total dash+gap width | 2px = thickness */
		background-repeat: repeat-x;
		padding: 0 0 2px 0;
		text-transform: none;
	}

	:global(button[id^="definition-"]::before, span.instructionsDef::before) {
		content: "";
		display: inline-block;
		width: 14px;
		height: 14px;
		margin: 1px 2px 0 0;
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
		background: var(--color-button-bg);
		padding: 0.25rem;
		border: none;
		border-radius: 4px;
		white-space: nowrap;
		transition: all calc(var(--1s) * 0.3) ease;
		box-shadow: 0 2px 16px rgba(247, 227, 189, 0.5);
	}

	:global(button[id^="deep-"]::before, span.instructionsDeep::before) {
		content: "";
		display: inline-block;
		width: 14px;
		height: 14px;
		margin: 1px 2px 0 0;
		vertical-align: middle;
		transform: translate(0, -2px);
		background: url("/assets/svg/add.svg") no-repeat center / contain;
	}

	:global(button[id^="deep-"]:hover) {
		cursor: pointer;
		background-color: var(--ivf-mid-yellow);
		transform: translateY(-2px);
	}

	:global(.icon-armor, .icon-egg, .icon-embryo, .icon-baby, .icon-follicle, .icon-fertilized, .icon-ab-embryo) {
		position: relative;
		font-weight: 700;
		margin-left: 1.25rem;
	}

	:global(.icon-armor::before, .icon-egg::before, .icon-embryo::before, .icon-baby::before, .icon-follicle::before, .icon-fertilized::before, .icon-ab-embryo::before) {
		content: "";
		position: absolute;
		width: 1.5rem;
		height: 1.5rem;
		left: -1.5rem;
		background-repeat: no-repeat;
		background-size: contain;
		z-index: 99;
	}

	:global(.icon-armor::before) {
		background-image: url('/assets/sprites/icon-armor.png');
	}

	:global(.icon-egg::before) {
		background-image: url('/assets/sprites/icon-egg.png');
	}

	:global(.icon-embryo::before) {
		background-image: url('/assets/sprites/icon-embryo.png');
	}

	:global(.icon-ab-embryo::before) {
		background-image: url('/assets/sprites/icon-embryo.png');
		filter: grayscale(100%);
		opacity: 0.75;
	}

	:global(.icon-baby::before) {
		background-image: url('/assets/sprites/icon-baby.png');
	}

	:global(.icon-follicle::before) {
		background-image: url('/assets/sprites/icon-follicle.png');
	}

	:global(.icon-fertilized::before) {
		background-image: url('/assets/sprites/icon-fertilized.png');
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
		.copy.left, .copy.finalStep {
			position: absolute;
			bottom: 6rem;
			left: 50%;
			transform: translate(-50%, 0);
			grid-column: none;
			width: 100%;
			max-width: 600px;
			padding: 0 1.25rem;
		}

		.copy.finalStep {
			margin-top: 0;
		}

		.copy p {
			margin: 0.25rem 0;
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
		.html-wrapper {
			gap: 0;
		}

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
