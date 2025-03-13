<script>
      import {t} from "$lib/locales/i18n"
    
  </script>
  
  <nav class="bg-neutral-50 p-2 border-2 border-neutral-100 flex flex-col gap-2 justify-start items-start font-comm">
      <div class="flex flex-row gap-2"> 
        <img class="size-10" src="/icon.png" alt="RustVeil Logo" />
          <h1 class="text-3xl">Social</h1>
      </div>
      <div role="tablist" class="tabs tabs-lift border-2 w-full border-neutral-200 rounded-2xl ">
        <ul class="menu menu-horizontal lg:menu-horizontal bg-base-200 rounded-box gap-4">
            <li>{$t("nav.home")}</li>
            <li>{$t("nav.setting")}</li>
            <li>{$t("nav.process")}</li>
          </ul>
        </div>
   </nav>