<script>
  import { Pie } from 'svelte-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

  ChartJS.register(ArcElement, Tooltip, Legend);

  export let investmentPercentage;
  export let tagPercentages;
  export let otherPercentage;

  const data = {
    labels: ['Investments', ...Object.keys(tagPercentages), 'Other'],
    datasets: [
      {
        data: [investmentPercentage, ...Object.values(tagPercentages), otherPercentage],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  };
</script>

<div class="pie-chart-container">
  <Pie {data} />
</div>

<style>
  .pie-chart-container {
    max-width: 400px;
    margin: 0 auto;
  }
</style>
