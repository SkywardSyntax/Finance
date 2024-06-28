<script lang="ts">
  export let isMonthly = true;
  export let item: { id: string; x: number; y: number };
  import { dndzone } from 'svelte-dnd-action';
  import { dragging } from './store.js';
    import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const handleDndUpdate = ({ detail }: { detail: { x: number; y: number } }) => {
    item.x = detail.x;
    item.y = detail.y;
    dispatch('dragend');
  };

  const toggleTimePeriod = () => {
    isMonthly = !isMonthly;
  };

  const handleMouseDown = (event: MouseEvent) => {
    dragging.set(true);
  };

  const handleMouseUp = (event: MouseEvent) => {
    dragging.set(false);
    dispatch('dragend');
  };
</script>

<div
  class="time-period-chip"
  use:dndzone={{
    items: [{ id: item.id }],
    flipDurationMs: 200,
  }}
  on:dndzone:reorder={handleDndUpdate}
  on:mousedown={handleMouseDown} 
  on:mouseup={handleMouseUp} 
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