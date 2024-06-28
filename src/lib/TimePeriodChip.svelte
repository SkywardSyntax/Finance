<script>
  export let isMonthly = true;
  export let item; 
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from '../App.svelte'; 

  const handleDndUpdate = ({ detail }) => {
    item.x = detail.x;
    item.y = detail.y;
  };

  const toggleTimePeriod = () => {
    isMonthly = !isMonthly;
  };
</script>

<div
  class="time-period-chip"
  use:dndzone={{
    items: [{ id: item.id }], 
    flipDurationMs: 200, 
  }}
  on:dndzone:reorder={handleDndUpdate} 
  on:click={toggleTimePeriod} 
  style="cursor: {$dragging ? 'grabbing' : 'grab'}" 
>
  <span class="label">{isMonthly ? 'Monthly' : 'Yearly'}</span>
</div>

<style>
  .time-period-chip {
    background-color: #202020;
    border-radius: 15px;
    padding: 10px 20px;
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    width: fit-content;
    z-index: 1;
  }

  .time-period-chip .label {
    font-size: 0.9rem;
    color: #ddd;
    font-weight: bold;
  }
</style>