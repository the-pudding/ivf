<script>
	import _ from "lodash";
	import {
		forceSimulation,
		forceManyBody,
		forceCenter,
		forceCollide,
		forceX,
		forceY,
		forceRadial
	} from "d3-force";
	import spriteData from "$data/sprites.json";
	import { onDestroy } from "svelte";

	let {
		centerX,
		centerY,
		spriteWidth,
		spriteHeight,
		forceData,
		yOffset,
		svgScaleFactor,
		gray
	} = $props();

	let currentForceId = $state();
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

	const getAboveTargets = (nodes, centerX, centerY, radius) => {
		const n = nodes.length;

		// Special case: single node
		if (n === 1) {
			return [
				{
					x: centerX,
					y: centerY - radius
				}
			];
		}

		return nodes.map((_, i) => {
			const t = i / (n - 1); // 0 → 1
			const angle = -Math.PI + t * Math.PI; // -π → 0

			return {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle)
			};
		});
	};

	const setUpSimulation = () => {
		if (simulation) simulation.stop();

		currentForceId = forceData.id;

		nodes.forEach((d) => {
			d.x ??= centerX;
			d.y ??= centerY;
			d.vx = 0;
			d.vy = 0;
		});

		if (forceData.config === "cluster") {
			simulation = forceSimulation(nodes)
				.force("charge", forceManyBody().strength(-10))
				.force("collision", forceCollide().radius(nodeRadius / 4))
				.on("tick", ticked);
		} else if (forceData.config === "halo") {
			simulation = forceSimulation(nodes)
				.force("charge", forceManyBody().strength(-5))
				.force("collision", forceCollide().radius(nodeRadius / 4))
				.on("tick", ticked);
		} else if (forceData.config === "above") {
			simulation = forceSimulation(nodes)
				.force("charge", forceManyBody().strength(-5))
				.force("collision", forceCollide().radius(nodeRadius / 2))
				.on("tick", ticked);
		}
	};

	const updateSimulation = () => {
		if (!simulation) return;

		if (forceData.config === "cluster") {
			simulation.force("center", forceCenter(centerX, centerY));
			simulation.force("radial", forceRadial(nodeRadius / 2, centerX, centerY));
			simulation.alpha(0.3).restart();
		} else if (forceData.config === "halo") {
			simulation.force("center", forceCenter(centerX, centerY));
			simulation.force("radial", forceRadial(nodeRadius, centerX, centerY));
			simulation.alpha(0.3).restart();
		} else if (forceData.config === "above") {
			const targets = getAboveTargets(nodes, centerX, centerY, nodeRadius);
			simulation
				.force(
					"x",
					forceX((d, i) => {
						if (!targets[i]) return centerX;
						return targets[i].x;
					}).strength(0.15)
				)
				.force(
					"y",
					forceY((d, i) => {
						if (!targets[i]) return centerY;
						return targets[i].y;
					}).strength(0.15)
				);

			simulation.alpha(0.4).restart();
		}
	};

	const updateNodes = () => {
		if (!simulation) return;

		nodes.forEach((d) => {
			d.x ??= centerX;
			d.y ??= centerY;
			d.vx = 0;
			d.vy = 0;
		});

		simulation.nodes(nodes);
		simulation.alphaTarget(0.3).restart();
	};

	$effect(() => {
		if (forceData.id !== currentForceId) {
			setUpSimulation(forceData.id);
		}
	});

	$effect(() => {
		updateSimulation(centerX, centerY);
	});

	$effect(() => {
		updateNodes(nodes);
	});

	onDestroy(() => {
		simulation?.stop();
	});
</script>

{#each nodes as node, i (i)}
	{@const spriteId = node.sprite.split(":")[0]}
	{@const spriteD = spriteData.find((d) => d.id === spriteId)}
	{@const pose =
		node.sprite.split(":").length > 1
			? `${node.sprite.split(":")[1]}-still`
			: undefined}
	{@const frame = pose
		? spriteD.frames.find((f) => f.pose === pose)
		: spriteD.frames[0]}
	{@const scale = (spriteD.scaleFactor || 1) * svgScaleFactor}
	<div
		class="node"
		class:gray
		bind:this={nodeEls[i]}
		style:width={`${nodeRadius}px`}
		style:height={`${nodeRadius}px`}
		style:background-image={`url("assets/sprites/${spriteId}.png")`}
		style:background-size={`calc(${spriteD.cols} * 100%) calc(${spriteD.rows} * 100%)`}
		style:background-position={`-${scale * frame.x}px -${scale * frame.y}px`}
	></div>
{/each}

<style>
	.node {
		position: absolute;
	}

	.gray {
		filter: grayscale(100%);
	}
</style>
