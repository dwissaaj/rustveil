<script lang="ts" >
  
  import { active } from "./active.svelte";
  let { children } = $props();
  const activeClass = "tab"
</script>

<div class="relative h-screen">
    <nav class="p-2 border-b-2 flex flex-row gap-2">
        <button>Home</button>
        <button>Data</button>
        <button>Setting</button>
        <button>Process</button>
      </nav>
      
      <main class="">
        {@render children()}
      </main>
      
      
     <footer class="absolute inset-x-0 bottom-0 p-2 border-t-2">
        <div role="tablist" class="tabs tabs-lift">
          <button role="tab" class="tab" class:tab-active={$active === "edges"} onclick={() => active.set("edges")}>Edges</button>
          <button role="tab" class="tab" class:tab-active={$active === "vertices"} onclick={() => active.set("vertices")}>Vertices</button>
          <button role="tab" class="tab" class:tab-active={$active === "groups"} onclick={() => active.set("groups")}>Groups</button>
          <button role="tab" class="tab" class:tab-active={$active === "metrics"} onclick={() => active.set("metrics")}>Metrics</button>
          <button role="tab" class="tab" class:tab-active={$active === "nlp"} onclick={() => active.set("nlp")}>NLP</button>
          </div>
     </footer>
      
</div>