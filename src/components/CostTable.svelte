<script>
  import { scaleLinear } from "d3-scale";

  const data = [
    { city: "Boston", ivf: 8267, meds: 5000, consult: 352, total: 13619 },
    { city: "New York", ivf: 9705, meds: 5000, consult: 408, total: 15113 },
    { city: "Atlanta", ivf: 11363, meds: 5000, consult: 282, total: 16645 },
    { city: "Chicago", ivf: 11666, meds: 5000, consult: 438, total: 17104 },
    { city: "San Francisco", ivf: 12246, meds: 5000, consult: 410, total: 17656 },
    { city: "Seattle", ivf: 12450, meds: 5000, consult: 312, total: 17762 },
    { city: "Los Angeles", ivf: 13325, meds: 5000, consult: 320, total: 18645 },
  ];


const totals = data.map(d => d.total);
const minTotal = Math.min(...totals);
const maxTotal = Math.max(...totals);
const avgTotal = (minTotal + maxTotal) / 2;

const customColorScale = scaleLinear()
  .domain([minTotal, avgTotal, maxTotal])
  .range(["#D1C3E3", "#F7E3BD", "#F0B49D"]);

const getTotalStyle = (value) => {
  const bg = customColorScale(value);

  return `background-color: ${bg}; color: #000000; font-weight: bold;`;
};
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th class="city-cell">City</th>
        <th>IVF</th>
        <th>Meds</th>
        <th>Consult</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {#each data as d}
        <tr>
          <td class="city-cell">{d.city}</td>
          <td>${d.ivf.toLocaleString()}</td>
          <td>${d.meds.toLocaleString()}</td>
          <td>${d.consult.toLocaleString()}</td>
          <td style={getTotalStyle(d.total)}>
            ${d.total.toLocaleString()}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
    margin: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--12px);
    color: var(--color-fg);
  }

  th, td {
    padding: 10px 6px;
    text-align: right;
    border: 1px solid #4c5c8f;
  }

  th {
    text-transform: uppercase;
    white-space: nowrap;
  }

  th:first-of-type, 
  .city-cell {
    text-align: left;
    background: #090d2e;
    position: sticky;
    left: 0;
    z-index: 2;
    width: 96px; 
    min-width: 96px;
    white-space: nowrap; 
  }

  td:not(.city-cell), th:not(:first-of-type) {
    min-width: 80px;
  }
</style>