<script>
  import {t} from "$lib/locales/i18n"
  import { active } from "../routes/main/active.svelte";

  
</script>

<footer class="">
    <div role="tablist" class="tabs tabs-lift bg-neutral-50 p-2 border-2 border-neutral-100 rounded-2xl font-comm">
      <button role="tab" class="tab" class:tab-active={$active === "edges"} onclick={() => active.set("edges")}>{$t("footer.edges")}</button>
      <button role="tab" class="tab font-display" class:tab-active={$active === "vertices"} onclick={() => active.set("vertices")}>{$t("footer.vertices")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "groups"} onclick={() => active.set("groups")}>{$t("footer.groups")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "metrics"} onclick={() => active.set("metrics")}>{$t("footer.metrics")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "nlp"} onclick={() => active.set("nlp")}>{$t("footer.nlp")}</button>
      </div>
 </footer>