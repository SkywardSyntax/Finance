<script>
  import { Pie } from 'svelte-chartjs';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  import { onMount } from 'svelte';

  // Receive the labels and datasets as props
  export let labels = []; 
  export let datasets = []; 

  ChartJS.register(ArcElement, Tooltip, Legend);

  let pieChart; 

  onMount(() => {
    // No need to update chartData here, as it's received from App.svelte
    if (pieChart && typeof pieChart.update === 'function') { 
      pieChart.update(); 
    } 
  });

</script>

<div class="pie-chart-container">
  <Pie bind:this={pieChart} 
       data={{ labels, datasets }} /> 
</div>

<style>
  .pie-chart-container {
    max-width: 400px;
    margin: 0 auto;
  }
</style>