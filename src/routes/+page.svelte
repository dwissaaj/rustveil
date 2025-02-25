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

<main class="container">
  <div class="bg-red-500">
    <p class="text-blue-500 text-6xl">asdsd</p>
    <button class="btn btn-secondary">chec</button>
  </div>
</main>

