<script lang="ts">
  let { children } = $props();
  let activeTab = $state("edges");
</script>

<div class="relative h-screen">
    <nav class="p-2 border-b-2 flex flex-row gap-2">
        <button>Home</button>
        <button>Data</button>
        <button>Setting</button>
        <button>Process</button>
      </nav>
      
      <main class="">
        {#if activeTab === "edges"}
          <p>edges</p>
        {:else if activeTab === "vertices"}
          <p>{activeTab} is less than 5</p>
        {:else}
          <p>{activeTab} is between 5 and 10</p>
        {/if}
      </main>
      
      
     <footer class="absolute inset-x-0 bottom-0 p-2 border-t-2">
        <div role="tablist" class="tabs tabs-lift">
            <button role="tab" class="tab tab-active" onclick={() => (activeTab = "edges")}>Edges</button>
            <button role="tab" class="tab" onclick={() => (activeTab = "vertices")}>Vertices</button>
            <button role="tab" class="tab" onclick={() => (activeTab = "vertices")}>Groups</button>
            <button role="tab" class="tab" onclick={() => (activeTab = "vertices")}>Metrics</button>
            <button role="tab" class="tab" onclick={() => (activeTab = "vertices")}>NLP</button>
          </div>
     </footer>
      
</div>