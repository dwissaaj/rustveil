<script>
  import { active } from "./active.svelte";
  import Edges from "./network/edges/+page.svelte";
  import Vertices from "./network/vertices/+page.svelte";
  import Nlp from "./network/nlp/+page.svelte";
  import Metrics from "./network/metrics/+page.svelte";
  import Groups from "./network/groups/+page.svelte";
</script>

<main>
  {#if $active === "edges"}
    <Edges />
  {:else if $active === "vertices"}
    <Vertices />
  {:else if $active === "groups"}
    <Groups />
  {:else if $active === "metrics"}
    <Metrics />
  {:else if $active === "nlp"}
    <Nlp />
  {/if}

</main>
