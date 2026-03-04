<script>
	import xSvg from "$svg/x.svg";
	import focusTrap from "$actions/focusTrap.js";
	import CostTable from "$components/CostTable.svelte";

	let { open = $bindable(), content, side } = $props();

	const close = () => {
		open = false;
	};
	const id = $derived(content?.[1] ? content[1].split("-")[1] : null);
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
	{#if content && content[0]}
		{#each content[0] as { type, value }}
			{#if type === "text"}
				<p>{@html value}</p>
			{:else if type === "table"}
				{#if value[0].title}
					<p class="viz-title">{@html value[0].title}</p>
				{/if}
				<CostTable />
				{#if value[0].credit}
					<p class="viz-credit">{@html value[0].credit}</p>
				{/if}
			{:else if type === "diagram"}
				{#each value as step, i}
					<div class="step-wrapper">
						<div class="img-wrapper">
							<img src="assets/deep/{step.src}" alt="{step.alt}" />
						</div>
						<div class="diagram-deets">
							<p class="diagram-title"><span>{i+1}</span> {@html step.title}</p>
							<p>{@html step.text}</p>
						</div>
					</div>
				{/each}
			{:else if type === "img"}
				<div class="img-wrapper">
					{#if value[0].title}
						<p class="viz-title">{@html value[0].title}</p>
					{/if}
					<img src="assets/deep/{value[0].src}" alt="{value[0].alt}" />
					{#if value[0].credit}
						<p class="viz-credit">{@html value[0].credit}</p>
					{/if}
				</div>
			{:else if type === "list"}
				<ul>
					{#each value as item}
						<li>{@html item.value}</li>
					{/each}
				</ul>
			{:else if type === "quotes"}
				<div class="quotes">
					{#each value as item, i}
						<p class="quote" id="quote-{i}">{@html item.value}</p>
					{/each}
				</div>
			{/if}
		{/each}
	{/if}
</div>

<style>
	.deep {
		height: 100svh;
		position: absolute;
		top: 0;
		width: 450px;
		background: #090d2e;
		z-index: var(--z-top);
		padding: 1rem 2rem;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.deep.left {
		left: 0;
		transform: translate(-100%, 0);
		border-right: 1px solid #4c5c8f;
	}

	.deep.right {
		right: 0;
		transform: translate(100%, 0);
		border-left: 1px solid #4c5c8f;
	}

	.deep.open {
		transform: translate(0, 0);
		transition: transform calc(var(--1s) * 0.5) ease-in-out;
	}

	button.close {
		background: var(--ivf-yellow);
		border: none;
		height: 32px;
		width: 32px;
		padding: 0;
		margin-bottom: 2rem;
		display: block;
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all calc(var(--1s) * 0.3) ease;
		box-shadow: 0 2px 16px rgba(247, 227, 189, 0.5);
	}

	button.close:hover {
		background: var(--ivf-mid-yellow);
		transform: translateY(-2px);
	}

	:global(button.close svg) {
		width: 16px;
		height: 16px;
	}

	:global(button.close svg path) {
		fill: #090d2e;
	}

	.left button.close {
		margin-left: auto;
	}

	p, ul {
		margin: 2rem 0;
		line-height: 1.5;
	}

	.img-wrapper {
		width: 100%;
		margin: 3rem 0;
	}

	.viz-credit {
		font-size: var(--12px);
		margin: 1rem 0 0 0;
	}

	.viz-title, .diagram-title {
		font-size: var(--20px);
		font-weight: 700;
		margin: 0 0 1rem 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.diagram-title span {
		background: var(--ivf-yellow);
		color: var(--color-bg);
		font-size: var(--14px);
		width: 24px;
		height: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	img {
		width: 100%;
	}

	.step-wrapper {
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
		padding: 2rem 0;
		border-bottom: 1px solid #191F54;
	}

	.step-wrapper:last-of-type {
		border-bottom: none;
	}

	.step-wrapper p {
		margin: 0;
	}

	.step-wrapper .img-wrapper {
		width: 80px;
		height: 80px;
		margin: 0.25rem 0 0 0;
	}

	.step-wrapper .img-wrapper img {
		width: 100%;
	}

	.step-wrapper .diagram-deets {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	:global(.orange-span) {
		color: var(--ivf-orange);
		font-weight: 700;
	}

	:global(.yellow-span) {
		color: var(--ivf-yellow);
		font-weight: 700;
	}

	:global(.purple-span) {
		color: var(--ivf-x-light-purple);
		font-weight: 700;
	}

	.quotes {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 1rem 0;
	}

	.quote {
		background-color: var(--ivf-yellow);
		color: var(--color-bg);
		padding: 0.5rem;
		border-radius: 4px;
		display: inline-block;
		position: relative;
		max-width: 80%;
		margin: 0;
	}

	p.quote:last-of-type {
		font-size: var(--16px);
	}

	#quote-0, #quote-2 {
		align-self: flex-start;
		margin-left: 2rem;
	}

	#quote-1, #quote-3 {
		align-self: flex-end;
		margin-right: 2rem;
	}

	#quote-0::before, #quote-2::before {
		content: "";
		position: absolute;
		width: 3.5rem;
		height: 3.5rem;
		top: -2rem;
		left: -2rem;
		background-repeat: no-repeat;
		background-size: contain;
		z-index: 99;
	}

	#quote-0::before {
		background-image: url('/assets/sprites/floating-head-mom-5.png');
	}

	#quote-2::before {
		background-image: url('/assets/sprites/floating-head-mom-4.png');
	}

	#quote-1::before, #quote-3::before {
		content: "";
		position: absolute;
		width: 3.5rem;
		height: 3.5rem;
		top: -2rem;
		right: -2rem;
		background-repeat: no-repeat;
		background-size: contain;
		z-index: 99;
		transform: scaleX(-1);
	}

	#quote-1::before {
		background-image: url('/assets/sprites/floating-head-baby-2.png');
	}

	#quote-3::before {
		background-image: url('/assets/sprites/floating-head-baby-3.png');
	}


	@media (max-width: 600px) {
		.deep {
			width: 90%;
			padding: 1rem;
		}
	}
</style>
