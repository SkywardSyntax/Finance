<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import TagSelectionModal from './TagSelectionModal.svelte';

    export let transactions: { description: string; amount: number, tags?: string[] }[] = [];
    const dispatch = createEventDispatcher();

    function deleteTransaction(index) {
        transactions = transactions.filter((_, i) => i !== index);
    }

    function handleTagSelected(event, index) {
        const { tag } = event.detail;
        transactions[index].tags = [...(transactions[index].tags || []), tag];
    }
</script>

<style>
    .transaction-chip {
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 8px;
        transition: background-color 0.3s, opacity 0.3s;
        position: relative;
        cursor: pointer;
    }

    .transaction-chip:hover {
        background-color: red;
    }

    .content {
        opacity: 1;
    }

    .transaction-chip:hover .content {
        opacity: 0;
    }

    .delete-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
    }

    .transaction-chip:hover .delete-icon {
        display: block;
    }

    .tags-container {
        margin-top: 8px;
    }

    .tag {
        display: inline-block;
        background-color: #e2e8f0;
        border-radius: 9999px;
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
</style>

<div class="bg-gray-800 p-4 rounded-md">
    <h2 class="text-lg font-semibold mb-2">Transactions</h2>
    <div class="divide-y divide-gray-700">
        {#each transactions as transaction, index}
            <div class="transaction-chip" on:click={() => deleteTransaction(index)}>
                <div class="delete-icon">🗑️</div>
                <div class="content">
                    <h3>{transaction.description}</h3>
                    <p class={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                        {transaction.amount.toFixed(2)}
                    </p>
                    <div class="tags-container">
                        {#each transaction.tags || [] as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                        <span class="tag" on:click|stopPropagation={() => dispatch('openTagModal', index)}>+ Add Tag</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    {#if $openTagModal !== null}
        <TagSelectionModal on:tagSelected={(event) => handleTagSelected(event, $openTagModal)} />
    {/if}
</div>
