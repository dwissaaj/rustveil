<script lang="ts" >
  import Footer from '../../components/twitter/Footer.svelte';
  import Header from '../../components/twitter/Header.svelte';




let { children } = $props();

</script>

<div class="flex flex-col h-screen">
  
  <Header />


  <main class="flex  overflow-scroll">
    {@render children()}
  </main>


  <Footer />
</div>
