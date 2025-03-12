<script>
  import {t, locale, locales} from "$lib/locales/i18n"
  import { active } from "../routes/main/active.svelte";

  
</script>

<footer class="absolute inset-x-0 bottom-0 p-2">
  
    <div role="tablist" class="tabs tabs-lift bg-amber-50 p-2">
      <button role="tab" class="tab" class:tab-active={$active === "edges"} onclick={() => active.set("edges")}>{$t("footer.edges")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "vertices"} onclick={() => active.set("vertices")}>{$t("footer.vertices")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "groups"} onclick={() => active.set("groups")}>{$t("footer.groups")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "metrics"} onclick={() => active.set("metrics")}>{$t("footer.metrics")}</button>
      <button role="tab" class="tab" class:tab-active={$active === "nlp"} onclick={() => active.set("nlp")}>{$t("footer.nlp")}</button>
      </div>
 </footer>