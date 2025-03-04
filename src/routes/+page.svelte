<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let name = $state("");
  let greetMsg = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name });
  }
</script>

<main class="w-screen h-screen flex items-center justify-center">
  <div class="flex flex-col gap-2">
    <div>
      <img class="size-20" src="/icon.png" alt="RustVeil Logo" />
    </div>
    <div class="flex flex-col gap-2">
     <p class="text-5xl">Rust Veil</p>
      <p>Unlock the Secrets of Connections.</p>
      
    </div>
    <div>
      <a class="btn btn-primary" href="/main">Start Now</a>
    </div>
  </div>
</main>

