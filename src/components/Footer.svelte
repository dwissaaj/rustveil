<script>
  
  import { active } from "../routes/main/active.svelte";

  
</script>

<footer class="absolute inset-x-0 bottom-0 p-2">
    <div role="tablist" class="tabs tabs-lift bg-amber-50 p-2">
      <button role="tab" class="tab" class:tab-active={$active === "edges"} onclick={() => active.set("edges")}>Edges</button>
      <button role="tab" class="tab" class:tab-active={$active === "vertices"} onclick={() => active.set("vertices")}>Vertices</button>
      <button role="tab" class="tab" class:tab-active={$active === "groups"} onclick={() => active.set("groups")}>Groups</button>
      <button role="tab" class="tab" class:tab-active={$active === "metrics"} onclick={() => active.set("metrics")}>Metrics</button>
      <button role="tab" class="tab" class:tab-active={$active === "nlp"} onclick={() => active.set("nlp")}>NLP</button>
      </div>
 </footer>