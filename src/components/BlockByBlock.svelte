<script>
	import Block from "$components/Block.svelte";
	import architectureData from "$data/architecture.csv";

	const convertToList = (data) => {
		const STACK_WEIGHT = 10000;
		const ROW_WEIGHT = 100;
		const COL_WEIGHT = 1;

		return data.flatMap((rowObj, rowIndex) => {
			const row = parseInt(rowObj[""]) || rowIndex + 1;

			return Object.entries(rowObj)
				.filter(([key, value]) => key !== "" && value !== "")
				.map(([colStr, id]) => {
					const col = parseInt(colStr);
					const stack = 0; // default for now

					const zIndex =
						stack * STACK_WEIGHT - row * ROW_WEIGHT + col * COL_WEIGHT;

					return { id, row, col, stack, zIndex };
				});
		});
	};

	const blocks = convertToList(architectureData);

	$inspect(convertToList(architectureData), "blocks");
</script>

<div class="wrapper">
	<div class="grid">
		{#each blocks as { id, row, col, zIndex }, i}
			<Block {id} {row} {col} {zIndex} />
		{/each}
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		overflow: hidden;
		padding: 1rem;
	}

	.grid {
		display: grid;
		width: 100%;
		height: 100%;
		position: relative;
	}
</style>
