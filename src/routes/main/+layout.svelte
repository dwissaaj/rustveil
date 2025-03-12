<script lang="ts" >
    import Footer from '../../components/Footer.svelte';
    import Header from '../../components/Header.svelte';

  


  let { children } = $props();

</script>

<div class="relative h-screen">

      <Header />
      <main class="">
        {@render children()}
      </main>
      
      
     
      <Footer />
</div>