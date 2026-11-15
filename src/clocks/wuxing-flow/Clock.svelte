<script>
  import { onMount } from "svelte";
  import { phases, phaseAt } from "./phases.js";
  import { createReliefRenderer } from "./relief.js";

  let { time, motion = true } = $props();
  let canvas;
  let draw = $state.raw(null);
  let state = $derived(phaseAt(time.second, time.millisecond));
  let phase = $derived(phases[state.index]);
  let index = $derived(state.index);
  // Quantize only the rendered material. Readouts and boundaries retain the shared clock.
  let sample = $derived(motion ? Math.floor(state.progress * 240) / 240 : 0);
  const ticks = Array.from({ length: 61 }, (_, i) => i);

  onMount(() => {
    draw = createReliefRenderer(canvas);
  });
  $effect(() => {
    draw?.(index, sample, motion);
  });
</script>

<div class="clock" style:--mineral={phase.color}>
  <header>
    <div><b>五行流刻</b><span>Five phases in a minute</span></div>
    <time datetime={`${time.hh}:${time.mm}:${time.ss}`}>{time.hh}:{time.mm}<small>{time.ss}</small></time>
  </header>
  <div class="field">
    <div class="reading">
      <strong>{phase.name}</strong>
      <span lang="en">{phase.english}</span>
      <p>{phase.name}生{phases[state.next].name}</p>
    </div>
    <div class="relief" aria-hidden="true">
      {#if !draw}
        <span class="fallback">{phase.name}</span>
      {/if}
      <canvas bind:this={canvas} width="744" height="540"></canvas>
    </div>
  </div>
  <footer>
    <div class="sequence">
      {#each phases as item, i}
        <span class:current={i === index} aria-current={i === index ? "step" : undefined}>{item.name}</span>
      {/each}
    </div>
    <div class="scale" aria-hidden="true">
      {#each ticks as tick}
        <i class:major={tick % 12 === 0}></i>
      {/each}
      <em style:left={`${time.progress.minute * 100}%`}></em>
    </div>
    <div class="legend"><span>一行十二秒</span><span>一分一循环</span></div>
  </footer>
</div>

<style>
  .clock {
    position: relative;
    isolation: isolate;
    display: grid;
    width: 960px;
    height: 760px;
    padding: 43px 52px 38px;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
    color: #eee9d9;
    font-family: var(--serif);
    background:
      radial-gradient(ellipse at 68% 57%, #3d5046 0%, transparent 52%),
      linear-gradient(115deg, #112724, #233932 73%, #142922);
  }
  header, .legend { display: flex; align-items: center; justify-content: space-between; }
  header { padding-bottom: 20px; border-bottom: 1px solid #afbeb391; }
  header div { display: grid; gap: 5px; }
  header b { font-size: 34px; font-weight: 500; letter-spacing: .13em; }
  header span, .legend, .reading span, time { font-family: var(--mono); }
  header span, .reading span { text-transform: uppercase; letter-spacing: .14em; }
  header span { color: #c4d3c7; font-size: 15px; }
  time { font-size: 40px; font-variant-numeric: tabular-nums; }
  time small { margin-left: 6px; color: var(--mineral); font-size: 21px; vertical-align: top; }
  .field { position: relative; display: flex; align-items: center; }
  .reading { position: relative; z-index: 1; align-self: center; padding: 0 0 14px 8px; }
  .reading strong { display: block; color: var(--mineral); font-size: 132px; font-weight: 500; line-height: 1.22; }
  .reading span { display: block; margin-left: 10px; font-size: 19px; }
  .reading p { margin: 32px 0 0 10px; font-size: 25px; letter-spacing: .16em; }
  .relief { position: absolute; inset: 0 -28px 0 180px; }
  .relief canvas { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
  .fallback { position: absolute; inset: 0; display: grid; place-content: center; color: var(--mineral); font-size: 150px; }
  .sequence { display: grid; grid-template-columns: repeat(5, 1fr); padding-bottom: 12px; }
  .sequence span { color: #b9c8bb; font-size: 25px; }
  .sequence .current { color: var(--mineral); font-weight: 700; }
  .scale { position: relative; display: flex; height: 19px; justify-content: space-between; border-top: 1px solid #aebfb1; }
  .scale i { width: 1px; height: 6px; background-color: #a3b1a4; }
  .scale i.major { width: 2px; height: 13px; background-color: #e0e7d8; }
  .scale em { position: absolute; top: -5px; height: 22px; width: 4px; background: var(--mineral); }
  .legend { margin-top: 8px; color: #d2dcce; font-size: 18px; letter-spacing: .12em; }
  @media (max-width: 520px) {
    header span, .reading span { display: none; }
    header b { font-size: 48px; }
    time { font-size: 56px; }
    time small, .reading p, .legend { font-size: 38px; }
    .sequence span { font-size: 42px; }
    .scale { height: 25px; }
  }
</style>
