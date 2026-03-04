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
		margin: 0rem auto;
		padding: 5rem 1rem 1rem;
	}

	h4 {
		font-weight: bold;
	}

	p {
		font-size: var(--14px);
	}

	@media (max-width: 600px) {
		h4 {
			font-size: var(--20px);
		}

		p {
			font-size: var(--12px);
		}
	}
</style>
