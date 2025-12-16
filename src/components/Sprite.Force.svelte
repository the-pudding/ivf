<script>
	import _ from "lodash";
	import {
		forceSimulation,
		forceManyBody,
		forceCenter,
		forceCollide,
		forceRadial
	} from "d3-force";
	import spriteData from "$data/sprites.json";

	let { centerX, centerY, spriteWidth, spriteHeight, forceData, yOffset } =
		$props();

	let nodeRadius = $derived(
		Math.max(
			spriteWidth * +forceData.sizeFactor,
			spriteHeight * +forceData.sizeFactor
		)
	);
	let spriteIds = $derived(forceData.sprites.split(",").map((d) => d.trim()));
	let nodes = $derived(
		Array.from({ length: spriteIds.length }, (d, i) => ({
			sprite: spriteIds.length === 1 ? forceData.sprites : spriteIds[i]
		}))
	);

	let simulation;
	let nodeEls = [];

	const ticked = () => {
		nodeEls.forEach((el, i) => {
			const d = nodes[i];
			if (el && d.x != null && d.y != null) {
				el.style.transform = `translate(${d.x - nodeRadius / 2}px, calc(${d.y - nodeRadius / 2}px - ${yOffset * 100 - 50}%))`;
			}
		});
	};

	const setUpSimulation = () => {
		if (simulation) simulation.stop();

		if (forceData.config === "cluster") {
			simulation = forceSimulation(nodes)
				.force("charge", forceManyBody().strength(5))
				.force("center", forceCenter(centerX, centerY))
				.force("collision", forceCollide().radius(nodeRadius / 4))
				.on("tick", ticked);
		} else if (forceData.config === "halo") {
			simulation = forceSimulation(nodes)
				.force("charge", forceManyBody().strength(-5))
				.force("center", forceCenter(centerX, centerY))
				.force("collision", forceCollide().radius(nodeRadius / 4))
				.force("radial", forceRadial(nodeRadius, centerX, centerY))
				.on("tick", ticked);
		}
	};

	$effect(() => {
		setUpSimulation();

		return () => {
			if (simulation) {
				simulation.stop();
				simulation = null;
			}
		};
	});
</script>

{#each nodes as node, i (i)}
	{@const spriteD = spriteData.find((d) => d.id === node.sprite)}
	<div
		class="node"
		bind:this={nodeEls[i]}
		style:width={`${nodeRadius}px`}
		style:height={`${nodeRadius}px`}
		style:background-image={`url("assets/sprites/${node.sprite}.png")`}
		style:background-size={`calc(${spriteD.cols} * 100%) calc(${spriteD.rows} * 100%)`}
		style:background-position={`0px 0px`}
	></div>
{/each}

<style>
	.node {
		position: absolute;
	}
</style>
