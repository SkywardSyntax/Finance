<script>
  import { Pie } from 'svelte-chartjs';
  import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
  import { onMount } from 'svelte'; 

  export let investmentAmount = 10000; 
  export let tagPercentages = {
    Food: 4,
    Housing: 20,
    Bills: 3
  };
  export let otherAmount = 1500;

  Chart.register(ArcElement, Tooltip, Legend, PieController); 

  // Hardcoded chart data (for testing) 
  let chartData = {
    labels: ['Investments', 'Food', 'Housing', 'Bills', 'Other'],
    datasets: [
      {
        data: [investmentAmount, tagPercentages.Food, tagPercentages.Housing, 
               tagPercentages.Bills, otherAmount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    ]
  };

  let pieChart; 

  onMount(() => { 
    const canvas = document.getElementById('pieChartCanvas'); 
    
    if (canvas instanceof HTMLCanvasElement) { 
      const ctx = canvas.getContext('2d'); 

      pieChart = new Chart(ctx, {
        type: 'pie', 
        data: chartData,
        options: {
          responsive: true, 
          maintainAspectRatio: false
        }
      });
    } else {
      console.error("Element with ID 'pieChartCanvas' is not a canvas element.");
    }
  });
</script>

<div class="pie-chart-container" style="width: 400px; height: 400px;">
  <canvas bind:this={pieChart} id="pieChartCanvas"></canvas>
</div>

<style>
  .pie-chart-container {
    margin: 0 auto;
  }
</style>