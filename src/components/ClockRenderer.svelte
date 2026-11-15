<script>
  import { getClock } from "../lib/catalog.js";
  import { onMount } from "svelte";

  let { slug, time, fit = false, spatialEnabled = true, dayDuration = 86400 } = $props();

  const clockModules = import.meta.glob("../clocks/*/Clock.svelte");
  let Component = $state();
  let failed = $state(false);

  let host = $state();
  let reducedMotion = $state(false);
  let parkedTime = $state.raw(null);
  let renderedTime = $derived(parkedTime ?? time);
  let motion = $derived(spatialEnabled && !reducedMotion && !parkedTime);
  let scale = $state(1);
  let canvas = $derived(getClock(slug)?.canvas ?? { width: 800, height: 800 });

  onMount(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => { reducedMotion = preference.matches; };
    let inView = true;
    const syncVisibility = () => {
      parkedTime = inView && !document.hidden ? null : parkedTime ?? time;
    };
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          syncVisibility();
        })
      : null;
    syncMotion();
    syncVisibility();
    observer?.observe(host);
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  });

  $effect(() => {
    const loader = clockModules[`../clocks/${slug}/Clock.svelte`];
    let current = true;
    Component = undefined;
    failed = false;
    if (!loader) {
      failed = true;
      return;
    }
    loader()
      .then((module) => { if (current) Component = module.default; })
      .catch(() => { if (current) failed = true; });
    return () => { current = false; };
  });

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

<div class:fit class="clock-renderer" data-motion={motion ? "on" : "off"} bind:this={host}>
  {#if Component}
    {#if fit}
      <div
        class="fit-canvas"
        style:width={`${canvas.width}px`}
        style:height={`${canvas.height}px`}
        style:transform={`translate(-50%, -50%) scale(${scale})`}
      >
        <Component time={renderedTime} {motion} {dayDuration} />
      </div>
    {:else}
      <Component time={renderedTime} {motion} {dayDuration} />
    {/if}
  {:else if failed}
    <p class="state">这座时钟暂时无法打开</p>
  {:else}
    <div class="loading" aria-label="正在装载时钟"><i></i><span>LOADING TIME</span></div>
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

  .loading,
  .state {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 12px;
    color: #777064;
    font: 9px monospace;
    letter-spacing: .14em;
  }

  .loading i {
    width: 18px;
    height: 18px;
    border: 1px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(1turn); } }
  @media (prefers-reduced-motion: reduce) { .loading i { animation: none; } }
</style>
