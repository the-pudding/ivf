<script>
	import _ from "lodash";
	import {
		forceSimulation,
		forceManyBody,
		forceCenter,
		forceCollide
	} from "d3-force";
	import { onMount } from "svelte";

	let { centerX = 0, centerY = 0 } = $props();

	const n = 10;
	const nodeRadius = 32;

	let width = 200,
		height = 200;
	let nodes = Array.from({ length: n }, () => ({}));

	let simulation;
	let nodeEls = [];

	function ticked() {
		nodeEls.forEach((el, i) => {
			const d = nodes[i];
			if (el && d.x != null && d.y != null) {
				el.style.transform = `translate(${d.x}px, ${d.y}px)`;
			}
		});
	}

	onMount(() => {
		simulation = forceSimulation(nodes)
			.force("charge", forceManyBody().strength(5))
			.force("center", forceCenter(centerX + width / 2, centerY + height / 2))
			.force("collision", forceCollide().radius(nodeRadius / 4))
			.on("tick", ticked);
	});
</script>

<div
	class="container"
	style:left={`${centerX}px`}
	style:top={`${centerY}px`}
	style:width={`${width}px`}
	style:height={`${height}px`}
>
	{#each _.range(n) as i (i)}
		<div
			class="node"
			bind:this={nodeEls[i]}
			style:width={`${nodeRadius}px`}
			style:height={`${nodeRadius}px`}
		></div>
	{/each}
</div>

<style>
	.container {
		position: absolute;
		pointer-events: none;
		transform: translate(-50%, -50%);
		background: lightgray;
		opacity: 0.5;
	}

	.node {
		position: absolute;
		background-image: url("assets/sprites/embryo.png");
		background-size: calc(400%) calc(800%);
		background-position: 0px 0px;
		border-radius: 50%;
	}
</style>
