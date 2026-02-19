<script>
	import copy from "$data/copy.json";
</script>

<section id="methods">
	{#each copy.methods as { type, value }}
		{#if type === "header"}
			<h4>{value}</h4>
		{:else if type === "text"}
			<p>{@html value}</p>
		{/if}
	{/each}
</section>

<style>
	section {
		max-width: 600px;
		margin: 5rem auto;
	}

	h4 {
		font-weight: bold;
	}
</style>
