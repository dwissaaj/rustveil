<script lang="ts" >
  import Footer from '../../components/Footer.svelte';
  import Header from '../../components/Header.svelte';




let { children } = $props();

</script>

<div class="flex flex-col h-screen">
  
  <Header />


  <main class="flex-1 overflow-auto">
    {@render children()}
  </main>


  <Footer />
</div>
