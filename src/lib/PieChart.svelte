<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let data = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [], 
    }],
  };

  let chartCanvas;
  let myChart;

  onMount(() => {
    const ctx = chartCanvas.getContext('2d');

    myChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      myChart.destroy();
    };
  });

  $: {
    if (myChart) {
      myChart.data.labels = data.labels; 
      myChart.data.datasets[0].data = data.datasets[0].data; // Correct data access
      myChart.update(); 
    }
  }
</script>

<canvas bind:this={chartCanvas} class="chart"></canvas>

<style>
  .chart {
    width: 100%;
    height: 100%;
  }
</style>