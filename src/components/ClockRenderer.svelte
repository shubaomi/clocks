<script>
  let { slug, time, fit = false } = $props();

  const clockModules = import.meta.glob("../clocks/*/Clock.svelte", {
    eager: true,
  });

  const components = Object.fromEntries(
    Object.entries(clockModules).map(([path, module]) => {
      const match = path.match(/\/clocks\/([^/]+)\/Clock\.svelte$/);
      return [match?.[1], module.default];
    }),
  );

  let Component = $derived(components[slug]);

  const canvasSizes = {
    "twelve-shichen": { width: 800, height: 1200 },
    "zodiac-seal-almanac": { width: 800, height: 800 },
  };

  let host;
  let scale = $state(1);
  let canvas = $derived(canvasSizes[slug] ?? { width: 800, height: 800 });

  $effect(() => {
    if (!fit || !host) return;

    const resize = () => {
      scale = Math.min(
        host.clientWidth / canvas.width,
        host.clientHeight / canvas.height,
      );
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    return () => observer.disconnect();
  });
</script>

<div class:fit class="clock-renderer" bind:this={host}>
  {#if Component}
    {#if fit}
      <div
        class="fit-canvas"
        style:width={`${canvas.width}px`}
        style:height={`${canvas.height}px`}
        style:transform={`translate(-50%, -50%) scale(${scale})`}
      >
        <Component {time} />
      </div>
    {:else}
      <Component {time} />
    {/if}
  {/if}
</div>

<style>
  .clock-renderer {
    width: 100%;
    height: 100%;
  }

  .clock-renderer.fit {
    position: relative;
    overflow: hidden;
  }

  .fit-canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
  }
</style>
