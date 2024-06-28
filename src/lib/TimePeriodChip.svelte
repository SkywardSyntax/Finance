<script lang="ts">
  export let isMonthly = true;
  export let item: { id: string; x: number; y: number };
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from './store.js';

  const handleDndUpdate = ({ detail }: { detail: { x: number; y: number } }) => {
    item.x = detail.x;
    item.y = detail.y;
  };

  const toggleTimePeriod = () => {
    isMonthly = !isMonthly;
  };
</script>

<button 
  class="time-period-chip"
  role="button"
  use:dndzone={{
    items: [{ id: item.id }],
    flipDurationMs: 200,
  }}
  on:dndzone:reorder={handleDndUpdate}
  on:click={toggleTimePeriod}
  on:mousedown={() => dragging.set(true)}
  on:mouseup={() => dragging.set(false)}
  style="cursor: {$dragging ? 'grabbing' : 'grab'}"
>
  <span class="label">{isMonthly ? 'Monthly' : 'Yearly'}</span>
</button>

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
    border: none; /* Make the button look like a chip */
  }

  .time-period-chip .label {
    font-size: 0.9rem;
    color: #ddd;
    font-weight: bold;
  }
</style>