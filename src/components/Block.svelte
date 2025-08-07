<script>
	import defaultSvg from "$svg/blocks/Default.svg";
	import flatSvg from "$svg/blocks/Flat.svg";
	import topHoleSvg from "$svg/blocks/Top Hole.svg";
	import leftWindowSvg from "$svg/blocks/Left Window.svg";
	import rightWindowSvg from "$svg/blocks/Right Window.svg";
	import leftStairsSvg from "$svg/blocks/Left Stairs.svg";
	import rightStairsSvg from "$svg/blocks/Right Stairs.svg";
	import leftLArchSvg from "$svg/blocks/Left (L) Arch.svg";
	import leftRArchSvg from "$svg/blocks/Left (R) Arch.svg";
	import rightLArchSvg from "$svg/blocks/Right (L) Arch.svg";
	import rightRArchSvg from "$svg/blocks/Right (R) Arch.svg";
	import leftDoorSvg from "$svg/blocks/Left Door.svg";
	import rightDoorSvg from "$svg/blocks/Right Door.svg";
	import leftOpeningSvg from "$svg/blocks/Left Opening.svg";
	import rightOpeningSvg from "$svg/blocks/Right Opening.svg";
	import leftHoleSvg from "$svg/blocks/Left Hole.svg";
	import rightHoleSvg from "$svg/blocks/Right Hole.svg";

	const { id = "default", row, col, zIndex } = $props();

	const svgMap = {
		default: defaultSvg,
		flat: flatSvg,
		"top-hole": topHoleSvg,
		"left-window": leftWindowSvg,
		"right-window": rightWindowSvg,
		"left-stairs": leftStairsSvg,
		"right-stairs": rightStairsSvg,
		"left-l-arch": leftLArchSvg,
		"left-r-arch": leftRArchSvg,
		"right-l-arch": rightLArchSvg,
		"right-r-arch": rightRArchSvg,
		"left-door": leftDoorSvg,
		"right-door": rightDoorSvg,
		"left-opening": leftOpeningSvg,
		"right-opening": rightOpeningSvg,
		"left-hole": leftHoleSvg,
		"right-hole": rightHoleSvg
	};

	const xShift = -50;
	const yShift = (row, col) => -25 * (2 * row - col - 1);
</script>

<div
	class="block"
	class:big={id === "left-opening"}
	style:grid-column={col}
	style:grid-row={row}
	style:z-index={zIndex}
	style:transform={`translate(${(col - 1) * xShift}%, ${yShift(row, col)}%)`}
>
	<div class="svg-wrapper">
		{@html svgMap[id]}
	</div>
</div>

<style>
	.block {
		width: 100%;
		height: 100%;
		aspect-ratio: 174 / 200;
	}

	.big {
		aspect-ratio: 174 / 300;
	}

	.svg-wrapper {
		width: 100%;
		height: 100%;
	}

	.svg-wrapper svg {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
