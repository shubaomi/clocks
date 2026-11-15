<script>
  import { onMount } from "svelte";
  import ClockRenderer from "./ClockRenderer.svelte";

  let { clock, time, spatialEnabled } = $props();
  let host;
  let visible = $state(false);

  onMount(() => {
    if (!("IntersectionObserver" in window)) {
      visible = true;
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visible = true;
        observer.disconnect();
      }
    }, { rootMargin: "180px" });
    observer.observe(host);
    return () => observer.disconnect();
  });
</script>

<div class="preview" inert bind:this={host} style={`aspect-ratio:${clock.canvas.width}/${clock.canvas.height}`}>
  {#if visible}<ClockRenderer slug={clock.slug} {time} {spatialEnabled} fit />{:else}<span>等待入场 · {clock.number}</span>{/if}
</div>

<style>
  .preview{display:grid;width:100%;overflow:hidden;place-items:center;background:#d8cfbd;color:#827866;font:8px monospace;letter-spacing:.12em}
</style>
