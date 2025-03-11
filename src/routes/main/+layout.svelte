<script lang="ts" >
    import Footer from '../../components/Footer.svelte';

  


  let { children } = $props();

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
      
      
     
      <Footer />
</div>