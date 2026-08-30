<script>
  import ClockRenderer from "./ClockRenderer.svelte";
  import SpatialExhibit from "./SpatialExhibit.svelte";
  import {
    advanceDaySecond,
    createClockTimeAtDaySecond,
    formatDaySecond,
  } from "../lib/clock-time.js";
  import { getClockNeighbors, routeFor } from "../lib/catalog.js";

  const playbackSpeeds = [
    { duration: 120, label: "慢", detail: "2 分钟" },
    { duration: 60, label: "中", detail: "60 秒" },
    { duration: 30, label: "快", detail: "30 秒" },
  ];

  let { clock, time, spatialEnabled = true } = $props();
  let exploring = $state(false);
  let selectedSecond = $state(0);
  let playing = $state(false);
  let playbackStarted = $state(false);
  let playbackDuration = $state(60);
  let focusMode = $state(false);
  let exhibitColumn = $state();
  let journal = $derived(getClockNeighbors(clock.slug));
  let timelineSecond = $derived(
    exploring
      ? selectedSecond
      : Math.min(86400, Math.floor(time.progress.day * 86400)),
  );
  let displayTime = $derived(
    exploring ? createClockTimeAtDaySecond(time, selectedSecond) : time,
  );

  const chooseTime = (second) => {
    playing = false;
    playbackStarted = false;
    selectedSecond = Number(second);
    exploring = true;
  };

  const resetTime = () => {
    playing = false;
    playbackStarted = false;
    exploring = false;
  };

  const togglePlayback = () => {
    if (playing) {
      playing = false;
      return;
    }

    if (!playbackStarted) selectedSecond = 0;
    exploring = true;
    playbackStarted = true;
    playing = true;
    focusMode = true;
  };

  const handleKeydown = (event) => {
    if (!focusMode) return;
    if (event.key === "Escape") {
      focusMode = false;
      return;
    }
    if (event.key !== "Tab" || !exhibitColumn) return;

    const focusable = [...exhibitColumn.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter((element) => element.getClientRects().length > 0);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable.at(-1);
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !exhibitColumn.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !exhibitColumn.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  };

  $effect(() => {
    const duration = playbackDuration;
    if (!playing) return;

    let frame;
    let previous = performance.now();
    const advance = (now) => {
      if (now - previous >= 50) {
        selectedSecond = advanceDaySecond(selectedSecond, now - previous, duration);
        previous = now;
      }
      frame = requestAnimationFrame(advance);
    };

    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  });

  $effect(() => {
    if (!focusMode) return;

    const returnFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : undefined;
    const previousOverflow = document.body.style.overflow;
    const outsideElements = [
      document.querySelector(".skip-link"),
      document.querySelector("header"),
      document.querySelector(".site-footer"),
      document.querySelector(".breadcrumb"),
      document.querySelector(".detail-copy"),
      document.querySelector(".journal-index"),
      document.querySelector(".detail-nav"),
    ].filter(Boolean);
    const previousInert = outsideElements.map((element) => [element, element.inert]);

    document.body.style.overflow = "hidden";
    for (const element of outsideElements) element.inert = true;

    return () => {
      document.body.style.overflow = previousOverflow;
      for (const [element, inert] of previousInert) element.inert = inert;
      queueMicrotask(() => returnFocus?.focus({ preventScroll: true }));
    };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<main
  id="main"
  class="detail-page"
  class:focusing={focusMode}
  class:journal-enabled={spatialEnabled}
  data-theme={clock.theme}
  data-spatial={spatialEnabled ? "on" : "off"}
  style={`--clock-ambient:${clock.ambient}`}
>
  <div class="breadcrumb">
    <a href="/">时间造物集</a>
    <span aria-hidden="true">/</span>
    <span>{clock.titleZh}</span>
  </div>

  <section class="detail-layout" class:portrait={clock.aspect === "portrait"} class:square={clock.aspect === "square"} class:landscape={clock.aspect === "landscape"}>
    <div class="detail-copy">
      <div class="detail-number" aria-hidden="true">
        <span>{clock.number}</span>
        <i></i>
      </div>
      <span class="detail-kicker">{clock.kicker}</span>
      <h1>{clock.titleZh}</h1>
      <strong>{clock.titleEn}</strong>
      <p class="lead">{clock.description}</p>
      <p class="note">{clock.note}</p>

      <div class="facts">
        {#each clock.facts as fact}
          <span>{fact}</span>
        {/each}
      </div>

      <div class="detail-rule">
        <span>{clock.rule}</span>
        <span>{clock.ruleEn}</span>
      </div>

      <div class="local-note">
        <span class="pulse" aria-hidden="true"></span>
        <span>{exploring ? "正在观察所选时刻" : "正在读取你的本地时间"} · {time.timezone.replaceAll("_", " ")}</span>
      </div>
    </div>

    <div
      class="exhibit-column"
      class:focus-mode={focusMode}
      bind:this={exhibitColumn}
      role={focusMode ? "dialog" : undefined}
      aria-modal={focusMode ? "true" : undefined}
      aria-label={focusMode ? `${clock.titleZh}一屏时间探索` : undefined}
    >
      <div class="detail-stage">
        <div class="stage-label stage-label-top" aria-hidden="true">
          <span>{playing ? "AUTO DAY LOOP" : exploring ? "TIME EXPLORATION" : "LIVE EXHIBIT"}</span>
          <span>{formatDaySecond(timelineSecond)}</span>
        </div>

        <button
          class="stage-focus"
          data-testid="focus-toggle"
          type="button"
          onclick={() => focusMode = !focusMode}
          aria-label={focusMode ? "退出一屏探索" : "进入一屏探索"}
        >{focusMode ? "退出一屏" : "一屏探索"} <span aria-hidden="true">{focusMode ? "×" : "↗"}</span></button>

        <div class="detail-frame" style={`aspect-ratio:${clock.canvas.width}/${clock.canvas.height}`}>
          <SpatialExhibit enabled={spatialEnabled}>
            <ClockRenderer slug={clock.slug} time={displayTime} fit />
          </SpatialExhibit>
        </div>

        <div class="stage-label stage-label-bottom" aria-hidden="true">
          <span>TIME IN CULTURAL FORMS</span>
          <span>{playing ? "LOOPING 00—24" : exploring ? "SELECTED TIME" : "LOCAL TIME"}</span>
        </div>
      </div>

      <section
        class="time-explorer"
        class:exploring
        class:playing
        data-testid="time-explorer"
        aria-labelledby="time-explorer-title"
      >
        <div class="explorer-heading">
          <div>
            <span id="time-explorer-title">一天时间轴 · TIME OF DAY</span>
            <strong>{playing ? "自动巡时" : exploring ? "探索模式" : "实时时间"}</strong>
          </div>
          <output>{formatDaySecond(timelineSecond)}</output>
          <button class="reset-button" type="button" onclick={resetTime} disabled={!exploring}>
            <span class="reset-full">Reset · 回到现在</span><span class="reset-compact">Reset</span>
          </button>
        </div>

        <label for="time-of-day">拖动观察，或让时间从 00:00 自动行至 24:00</label>
        <input
          id="time-of-day"
          type="range"
          min="0"
          max="86400"
          step="1"
          value={timelineSecond}
          aria-label="观察一天中的时间"
          aria-valuetext={formatDaySecond(timelineSecond)}
          oninput={(event) => chooseTime(event.currentTarget.value)}
        />

        <div class="timeline-ticks" aria-label="快速选择时刻">
          {#each [[0, "00"], [21600, "06"], [43200, "12"], [64800, "18"], [86400, "24"]] as tick}
            <button type="button" onclick={() => chooseTime(tick[0])}>{tick[1]}</button>
          {/each}
        </div>

        <div class="playback-controls">
          <button
            class="play-toggle"
            data-testid="play-toggle"
            type="button"
            aria-pressed={playing}
            onclick={togglePlayback}
          >
            <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            {playing ? "暂停巡时" : playbackStarted ? "继续巡时" : "从 00:00 自动巡时"}
          </button>
          <div class="speed-selector" aria-label="自动巡时速度">
            <span>24 小时用时</span>
            {#each playbackSpeeds as speed}
              <button
                type="button"
                class:active={playbackDuration === speed.duration}
                aria-pressed={playbackDuration === speed.duration}
                aria-label={`${speed.label}速，完整一天用 ${speed.detail}`}
                title={`完整一天用 ${speed.detail}`}
                onclick={() => playbackDuration = speed.duration}
              >{speed.label}<small>{speed.detail}</small></button>
            {/each}
          </div>
        </div>
      </section>
    </div>
  </section>

  {#if spatialEnabled && journal}
    <nav class="journal-index" aria-label="时间器物志相邻作品">
      <a class="journal-previous" href={routeFor(journal.previous)}>
        <small>上一器 · PREVIOUS</small>
        <strong>{journal.previous.titleZh}</strong>
        <span>{journal.previous.series}</span>
      </a>
      <span class="journal-current" aria-current="page">
        <small>此器 · CURRENT</small>
        <strong>{journal.current.titleZh}</strong>
        <span>{journal.current.series}</span>
      </span>
      <a class="journal-next" href={routeFor(journal.next)}>
        <small>下一器 · NEXT</small>
        <strong>{journal.next.titleZh}</strong>
        <span>{journal.next.series}</span>
      </a>
    </nav>
  {/if}

  <nav class="detail-nav" aria-label="作品导航">
    <a href="/">← 返回全部时钟</a>
  </nav>
</main>

<style>
  .detail-page {
    width: min(100% - 40px, 1440px);
    margin: 0 auto;
    padding: 34px 0 90px;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--ink-faint);
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.08em;
  }

  .breadcrumb a {
    color: inherit;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    color: var(--cinnabar);
  }

  .detail-layout {
    display: grid;
    min-height: calc(100vh - 190px);
    min-height: calc(100dvh - 190px);
    padding: 54px 0 70px;
    grid-template-columns: minmax(280px, 0.62fr) minmax(520px, 1.38fr);
    align-items: center;
    gap: clamp(50px, 7vw, 120px);
  }

  .detail-copy {
    position: relative;
    padding-left: clamp(30px, 5vw, 78px);
  }

  .detail-number {
    position: absolute;
    top: 4px;
    left: 0;
    display: grid;
    justify-items: center;
    gap: 10px;
    color: var(--cinnabar);
    font-family: var(--serif);
  }

  .detail-number i {
    width: 1px;
    height: 68px;
    background: color-mix(in srgb, var(--cinnabar) 45%, transparent);
  }

  .detail-kicker,
  .detail-copy > strong,
  .detail-rule,
  .local-note,
  .stage-label {
    font-family: var(--mono);
    letter-spacing: 0.12em;
  }

  .detail-kicker {
    color: var(--cinnabar);
    font-size: 10px;
  }

  h1 {
    margin: 18px 0 7px;
    font-family: var(--serif);
    font-size: clamp(48px, 6vw, 88px);
    font-weight: 480;
    letter-spacing: -0.045em;
    line-height: 1.08;
  }

  .detail-copy > strong {
    color: var(--ink-faint);
    font-size: 10px;
    text-transform: uppercase;
  }

  .lead {
    margin: 42px 0 18px;
    color: var(--ink);
    font-family: var(--serif);
    font-size: 20px;
    line-height: 1.85;
  }

  .note {
    margin: 0;
    color: var(--ink-soft);
    font-size: 14px;
    line-height: 1.9;
  }

  .facts {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    gap: 8px;
  }

  .facts span {
    padding: 7px 10px;
    border: 1px solid var(--line-strong);
    color: var(--ink-soft);
    font-size: 11px;
  }

  .detail-rule {
    display: grid;
    margin-top: 34px;
    padding-top: 20px;
    gap: 7px;
    border-top: 1px solid var(--line);
    color: var(--ink-faint);
    font-size: 9px;
  }

  .local-note {
    display: flex;
    margin-top: 26px;
    align-items: center;
    gap: 9px;
    color: var(--jade);
    font-size: 8px;
  }

  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--jade);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--jade) 12%, transparent);
  }

  .detail-stage {
    position: relative;
    display: grid;
    min-height: 720px;
    place-items: center;
    overflow: hidden;
    padding: 64px;
    border: 1px solid var(--line);
    background:
      radial-gradient(circle at 72% 18%, rgb(255 255 255 / 64%), transparent 32%),
      repeating-linear-gradient(0deg, transparent 0 27px, rgb(73 55 31 / 3%) 27px 28px),
      linear-gradient(145deg, #d8cfb9, #eee8dc 48%, #cdbb9d);
  }

  .exhibit-column {
    min-width: 0;
  }

  .exhibit-column.focus-mode {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: grid;
    overflow: hidden;
    padding: 12px;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 10px;
    background:
      radial-gradient(circle at 72% 12%, rgb(255 255 255 / 72%), transparent 34%),
      linear-gradient(145deg, var(--paper-light), var(--paper) 62%, var(--paper-deep));
  }

  [data-theme="cinnabar"] .detail-stage {
    background:
      radial-gradient(circle at 22% 16%, rgb(255 255 255 / 62%), transparent 34%),
      repeating-linear-gradient(90deg, transparent 0 31px, rgb(91 50 40 / 3%) 31px 32px),
      linear-gradient(145deg, #d5c7ba, #efe4d5 48%, #c7aa91);
  }

  .detail-stage::before {
    position: absolute;
    inset: 18px;
    border: 1px solid rgb(67 46 22 / 10%);
    content: "";
    pointer-events: none;
  }

  .detail-frame {
    position: relative;
    z-index: 2;
    overflow: hidden;
    border-radius: 22px;
    box-shadow:
      0 38px 100px rgb(46 34 18 / 30%),
      0 0 0 1px rgb(65 43 19 / 16%);
  }

  .focus-mode .detail-stage {
    height: auto;
    min-height: 0;
    padding: 50px 54px 46px;
  }

  .focus-mode .detail-frame {
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }

  .portrait .detail-frame {
    width: min(68%, 520px);
    aspect-ratio: 2 / 3;
  }

  .square .detail-frame {
    width: min(88%, 760px);
    aspect-ratio: 1;
  }

  .landscape .detail-frame {
    width: min(100%, 920px);
    aspect-ratio: 3 / 2;
  }

  .portrait .focus-mode .detail-frame {
    width: min(calc(66.667dvh - 194px), calc(100vw - 132px), 520px);
  }

  .square .focus-mode .detail-frame {
    width: min(calc(100dvh - 290px), calc(100vw - 132px), 760px);
  }

  .landscape .focus-mode .detail-frame {
    width: min(calc(150dvh - 435px), calc(100vw - 132px), 1120px);
  }

  .stage-label {
    position: absolute;
    z-index: 3;
    right: 34px;
    left: 34px;
    display: flex;
    justify-content: space-between;
    color: rgb(52 42 28 / 62%);
    font-size: 10px;
  }

  .stage-label-top {
    top: 34px;
  }

  .stage-label-bottom {
    bottom: 34px;
  }

  .stage-focus {
    position: absolute;
    z-index: 4;
    top: 19px;
    left: 50%;
    display: flex;
    min-height: 34px;
    padding: 0 12px;
    align-items: center;
    gap: 8px;
    border: 1px solid rgb(71 50 27 / 28%);
    color: var(--ink-soft);
    background: rgb(247 242 232 / 72%);
    font: 10px var(--mono);
    letter-spacing: 0.08em;
    cursor: pointer;
    transform: translateX(-50%);
    backdrop-filter: blur(7px);
  }

  .stage-focus:hover {
    border-color: var(--cinnabar);
    color: var(--cinnabar);
  }

  .stage-focus:focus-visible {
    outline: 2px solid var(--cinnabar);
    outline-offset: 3px;
  }

  .detail-nav {
    padding-top: 28px;
    border-top: 1px solid var(--line);
  }

  .detail-nav a {
    color: var(--ink-soft);
    font-size: 13px;
    text-decoration: none;
  }

  .detail-nav a:hover {
    color: var(--cinnabar);
  }

  .time-explorer {
    position: relative;
    margin-top: 16px;
    padding: 20px 22px 17px;
    border: 1px solid var(--line-strong);
    background: color-mix(in srgb, var(--paper) 88%, white);
    box-shadow: 0 12px 36px rgb(58 41 20 / 8%);
  }

  .time-explorer::before {
    position: absolute;
    inset: 6px;
    border: 1px solid rgb(67 46 22 / 7%);
    content: "";
    pointer-events: none;
  }

  .time-explorer.exploring {
    border-color: color-mix(in srgb, var(--cinnabar) 55%, var(--line-strong));
  }

  .time-explorer.playing {
    box-shadow: 0 14px 42px color-mix(in srgb, var(--cinnabar) 14%, transparent);
  }

  .focus-mode .time-explorer {
    margin-top: 0;
    padding: 10px 18px 9px;
    box-shadow: 0 12px 42px rgb(58 41 20 / 16%);
  }

  .explorer-heading {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 18px;
  }

  .explorer-heading > div {
    display: grid;
    gap: 5px;
  }

  .explorer-heading span,
  .explorer-heading strong,
  .time-explorer label,
  .timeline-ticks,
  .explorer-heading button,
  .playback-controls {
    font-family: var(--mono);
    letter-spacing: 0.08em;
  }

  .explorer-heading span {
    color: var(--ink-soft);
    font-size: 12px;
  }

  .explorer-heading strong {
    color: var(--jade);
    font-size: 13px;
  }

  .exploring .explorer-heading strong {
    color: var(--cinnabar);
  }

  .explorer-heading output {
    color: var(--ink);
    font-family: var(--mono);
    font-size: clamp(24px, 2.4vw, 34px);
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .explorer-heading button {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--cinnabar);
    color: var(--cinnabar);
    background: transparent;
    cursor: pointer;
    font-size: 10px;
  }

  .explorer-heading button:disabled {
    border-color: var(--line-strong);
    color: var(--ink-faint);
    cursor: default;
  }

  .explorer-heading button:focus-visible,
  .playback-controls button:focus-visible,
  .timeline-ticks button:focus-visible,
  .time-explorer input:focus-visible {
    outline: 2px solid var(--cinnabar);
    outline-offset: 3px;
  }

  .time-explorer label {
    position: relative;
    z-index: 1;
    display: block;
    margin-top: 15px;
    color: var(--ink-soft);
    font-size: 11px;
  }

  .time-explorer input {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 28px;
    margin: 8px 0 0;
    accent-color: var(--cinnabar);
    cursor: ew-resize;
  }

  .timeline-ticks {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    margin-top: -2px;
  }

  .timeline-ticks button {
    min-height: 34px;
    border: 0;
    color: var(--ink-soft);
    background: transparent;
    cursor: pointer;
    font: inherit;
    font-size: 11px;
  }

  .timeline-ticks button:first-child {
    text-align: left;
  }

  .timeline-ticks button:last-child {
    text-align: right;
  }

  .timeline-ticks button:hover {
    color: var(--cinnabar);
  }

  .playback-controls {
    position: relative;
    z-index: 1;
    display: grid;
    margin-top: 8px;
    padding-top: 12px;
    grid-template-columns: minmax(190px, auto) 1fr;
    align-items: center;
    gap: 16px;
    border-top: 1px solid var(--line);
  }

  .play-toggle {
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid var(--cinnabar);
    color: var(--cinnabar);
    background: transparent;
    font-size: 11px;
    cursor: pointer;
  }

  .play-toggle[aria-pressed="true"] {
    color: var(--paper-light);
    background: var(--cinnabar);
  }

  .play-toggle > span {
    display: inline-block;
    min-width: 18px;
    margin-right: 4px;
  }

  .speed-selector {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
  }

  .speed-selector > span {
    margin-right: 3px;
    color: var(--ink-soft);
    font-size: 10px;
  }

  .speed-selector button {
    display: grid;
    min-width: 60px;
    min-height: 42px;
    padding: 4px 8px;
    place-items: center;
    border: 1px solid var(--line-strong);
    color: var(--ink-soft);
    background: transparent;
    font: 600 11px var(--mono);
    cursor: pointer;
  }

  .speed-selector button small {
    color: var(--ink-faint);
    font-size: 8px;
    font-weight: 400;
  }

  .speed-selector button.active {
    border-color: var(--ink);
    color: var(--ink);
    background: color-mix(in srgb, var(--paper-deep) 45%, transparent);
  }

  .speed-selector button.active small {
    color: var(--ink-soft);
  }

  .reset-compact {
    display: none;
  }

  .focus-mode .explorer-heading {
    grid-template-columns: 1fr auto auto;
    gap: 14px;
  }

  .focus-mode .time-explorer > label {
    display: none;
  }

  .focus-mode .time-explorer input {
    height: 22px;
    margin-top: 3px;
  }

  .focus-mode .timeline-ticks {
    margin-top: -5px;
  }

  .focus-mode .timeline-ticks button {
    min-height: 25px;
  }

  .focus-mode .playback-controls {
    margin-top: 1px;
    padding-top: 6px;
  }

  @media (min-width: 821px) {
    .exhibit-column.focus-mode {
      grid-template-columns: minmax(0, 1fr) 340px;
      grid-template-rows: minmax(0, 1fr);
    }

    .focus-mode .detail-stage {
      padding: 36px 24px 28px;
    }

    .portrait .focus-mode .detail-frame {
      width: min(calc((100dvh - 104px) * 0.6667), calc(100vw - 430px), 520px);
    }

    .square .focus-mode .detail-frame {
      width: min(calc(100dvh - 104px), calc(100vw - 430px), 760px);
    }

    .landscape .focus-mode .detail-frame {
      width: min(calc((100dvh - 104px) * 1.5), calc(100vw - 430px), 1120px);
    }

    .focus-mode .time-explorer {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      padding: 24px 20px;
    }

    .focus-mode .explorer-heading {
      grid-template-columns: 1fr auto;
      gap: 14px 10px;
    }

    .focus-mode .explorer-heading button {
      width: 100%;
      grid-column: 1 / -1;
    }

    .focus-mode .time-explorer input {
      margin-top: 18px;
    }

    .focus-mode .timeline-ticks {
      margin-top: 0;
    }

    .focus-mode .playback-controls {
      margin-top: 18px;
      padding-top: 18px;
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .focus-mode .speed-selector {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .focus-mode .speed-selector > span {
      margin: 0 0 3px;
      grid-column: 1 / -1;
    }

    .focus-mode .speed-selector button {
      min-width: 0;
    }
  }

  @media (max-width: 1050px) {
    .detail-layout {
      grid-template-columns: minmax(240px, 0.62fr) minmax(430px, 1.38fr);
      gap: 44px;
    }

    .detail-stage {
      min-height: 620px;
      padding: 48px;
    }
  }

  @media (max-width: 820px) {
    .detail-page {
      width: min(100% - 28px, 1440px);
      padding-top: 28px;
    }

    .detail-layout {
      min-height: auto;
      padding: 52px 0;
      grid-template-columns: 1fr;
      gap: 52px;
    }

    .detail-copy {
      max-width: 640px;
    }

    .detail-stage {
      min-height: min(126vw, 780px);
    }

    .square .detail-stage {
      min-height: min(105vw, 760px);
    }

    .landscape .detail-stage { min-height: min(82vw, 680px); }

    .playback-controls {
      grid-template-columns: 1fr;
    }

    .speed-selector {
      justify-content: flex-start;
    }
  }

  @media (max-width: 520px) {
    .detail-copy {
      padding-left: 27px;
    }

    .detail-number i {
      height: 48px;
    }

    h1 {
      font-size: 46px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .lead {
      margin-top: 32px;
      font-size: 17px;
    }

    .detail-stage {
      min-height: 136vw;
      padding: 45px 20px;
    }

    .square .detail-stage {
      min-height: 102vw;
      padding: 38px 18px;
    }

    .landscape .detail-stage { min-height: 72vw; padding: 42px 18px; }

    .portrait .detail-frame {
      width: 100%;
    }

    .square .detail-frame {
      width: 100%;
    }

    .landscape .detail-frame { width: 100%; }

    .stage-label {
      right: 25px;
      left: 25px;
    }

    .stage-label-top {
      top: 26px;
    }

    .stage-label-bottom {
      bottom: 26px;
    }

    .time-explorer {
      padding: 17px 16px 13px;
    }

    .explorer-heading {
      grid-template-columns: 1fr auto;
      gap: 10px;
    }

    .explorer-heading output {
      font-size: 25px;
    }

    .explorer-heading button {
      grid-column: 1 / -1;
      width: 100%;
    }

    .time-explorer label {
      line-height: 1.5;
    }

    .speed-selector {
      display: grid;
      grid-template-columns: 1fr repeat(3, minmax(54px, auto));
    }

    .speed-selector button {
      min-width: 0;
    }

    .exhibit-column.focus-mode {
      padding: 8px;
      gap: 8px;
    }

    .focus-mode .detail-stage,
    .square .focus-mode .detail-stage,
    .landscape .focus-mode .detail-stage {
      min-height: 0;
      padding: 40px 8px 34px;
    }

    .focus-mode .detail-frame {
      height: auto;
    }

    .portrait .focus-mode .detail-frame {
      width: min(calc(66.667dvh - 163px), calc(100vw - 32px));
    }

    .square .focus-mode .detail-frame {
      width: min(calc(100dvh - 244px), calc(100vw - 32px));
    }

    .landscape .focus-mode .detail-frame {
      width: min(calc(150dvh - 366px), calc(100vw - 32px));
    }

    .focus-mode .stage-label {
      right: 14px;
      left: 14px;
      font-size: 8px;
    }

    .focus-mode .stage-label-top {
      top: 15px;
    }

    .focus-mode .stage-label-bottom {
      bottom: 13px;
    }

    .focus-mode .stage-focus {
      top: 9px;
      min-height: 28px;
      padding: 0 8px;
      font-size: 8px;
    }

    .focus-mode .time-explorer {
      padding: 9px 11px 7px;
    }

    .focus-mode .explorer-heading {
      grid-template-columns: auto 1fr auto;
      gap: 9px;
    }

    .focus-mode .explorer-heading > div > span,
    .focus-mode .reset-full {
      display: none;
    }

    .focus-mode .reset-compact {
      display: inline;
    }

    .focus-mode .explorer-heading output {
      justify-self: center;
      font-size: 23px;
    }

    .focus-mode .explorer-heading button {
      width: auto;
      min-height: 34px;
      grid-column: auto;
    }

    .focus-mode .playback-controls {
      grid-template-columns: minmax(138px, auto) 1fr;
      gap: 7px;
    }

    .focus-mode .play-toggle {
      min-height: 38px;
      padding: 0 9px;
      font-size: 9px;
    }

    .focus-mode .speed-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
    }

    .focus-mode .speed-selector > span,
    .focus-mode .speed-selector button small {
      display: none;
    }

    .focus-mode .speed-selector button {
      min-width: 0;
      min-height: 38px;
      padding: 0 5px;
    }
  }

  @media (max-height: 700px) {
    .focus-mode .detail-stage {
      padding-top: 36px;
      padding-bottom: 30px;
    }

    .focus-mode .time-explorer {
      padding-top: 7px;
      padding-bottom: 6px;
    }

    .focus-mode .explorer-heading > div > span,
    .focus-mode .timeline-ticks {
      display: none;
    }

    .focus-mode .playback-controls {
      margin-top: 0;
      padding-top: 5px;
    }
  }

  /* Approved direction D: one editorial entry, one spatial time object. */
  .detail-page.journal-enabled {
    width: min(100% - 48px, 1500px);
    padding-top: 30px;
  }

  .journal-enabled .breadcrumb {
    padding-bottom: 18px;
    border-bottom: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
  }

  .journal-enabled .detail-layout {
    min-height: calc(100vh - 144px);
    min-height: calc(100dvh - 144px);
    padding: clamp(54px, 7vw, 96px) 0 clamp(66px, 8vw, 112px);
    grid-template-columns: minmax(320px, .72fr) minmax(560px, 1.28fr);
    align-items: start;
    gap: clamp(64px, 7vw, 116px);
  }

  .journal-enabled .detail-copy {
    position: sticky;
    top: 42px;
    max-width: 560px;
    padding: 7px 0 0 clamp(34px, 4vw, 64px);
  }

  .journal-enabled .detail-number {
    top: 8px;
  }

  .journal-enabled .detail-number i {
    height: 92px;
    background: linear-gradient(var(--cinnabar), color-mix(in srgb, var(--cinnabar) 12%, transparent));
  }

  .journal-enabled h1 {
    max-width: 10ch;
    margin-top: 20px;
    font-size: clamp(50px, 5.4vw, 80px);
    line-height: 1.02;
  }

  .journal-enabled .lead {
    max-width: 31em;
    margin-top: clamp(38px, 5vw, 58px);
    font-size: clamp(18px, 1.45vw, 21px);
    line-height: 1.92;
  }

  .journal-enabled .note {
    max-width: 40em;
    line-height: 2;
  }

  .journal-enabled .facts {
    margin-top: 32px;
    gap: 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .journal-enabled .facts span {
    padding: 9px 12px 8px 0;
    border: 0;
    color: var(--ink-soft);
  }

  .journal-enabled .facts span + span::before {
    margin-right: 12px;
    color: var(--cinnabar);
    content: "·";
  }

  .journal-enabled .detail-rule {
    margin-top: 28px;
    padding-top: 0;
    border-top: 0;
  }

  .journal-enabled .exhibit-column {
    padding-top: 0;
  }

  .journal-enabled .detail-stage {
    min-height: 720px;
    overflow: hidden;
    padding: 70px clamp(52px, 5vw, 76px);
    border-color: rgb(61 52 39 / 22%);
    background:
      linear-gradient(108deg, rgb(255 255 255 / 38%), transparent 25% 74%, rgb(64 43 18 / 6%)),
      radial-gradient(circle at 72% 18%, color-mix(in srgb, var(--clock-ambient) 13%, transparent), transparent 36%),
      repeating-linear-gradient(0deg, transparent 0 35px, rgb(73 55 31 / 2.4%) 35px 36px),
      linear-gradient(145deg, #d8cfb9, #eee8dc 48%, #c7b596);
    box-shadow:
      inset 0 1px rgb(255 255 255 / 48%),
      0 24px 70px rgb(57 39 17 / 11%);
  }

  .journal-enabled .detail-stage::before {
    inset: 22px;
    border-color: rgb(67 46 22 / 13%);
  }

  .journal-enabled .detail-frame {
    overflow: visible;
    border-radius: 2px;
    box-shadow: none;
  }

  .journal-enabled .portrait .exhibit-column:not(.focus-mode) .detail-frame {
    width: min(67%, 510px);
  }

  .journal-enabled .square .exhibit-column:not(.focus-mode) .detail-frame {
    width: min(84%, 720px);
  }

  .journal-enabled .landscape .exhibit-column:not(.focus-mode) .detail-frame {
    width: min(96%, 900px);
  }

  .journal-enabled .stage-focus {
    border: 0;
    border-bottom: 1px solid rgb(71 50 27 / 28%);
    background: transparent;
    backdrop-filter: none;
  }

  .journal-enabled .time-explorer {
    margin-top: 20px;
    border-width: 1px 0;
    background: color-mix(in srgb, var(--paper) 86%, white);
    box-shadow: none;
  }

  .journal-enabled .time-explorer::before {
    display: none;
  }

  .journal-enabled .local-note {
    font-size: 9px;
    line-height: 1.6;
  }

  .journal-enabled .exhibit-column.focus-mode .detail-stage {
    min-height: 0;
  }

  .journal-index {
    display: grid;
    margin-bottom: 34px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid var(--line-strong);
    border-bottom: 1px solid var(--line-strong);
  }

  .journal-index > * {
    display: grid;
    min-width: 0;
    min-height: 116px;
    padding: 20px clamp(16px, 2.4vw, 34px);
    align-content: center;
    gap: 6px;
    color: var(--ink-soft);
    text-decoration: none;
  }

  .journal-index > * + * {
    border-left: 1px solid var(--line);
  }

  .journal-index small,
  .journal-index span {
    overflow: hidden;
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: .12em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journal-index strong {
    overflow: hidden;
    color: var(--ink);
    font-family: var(--serif);
    font-size: clamp(17px, 1.5vw, 22px);
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .journal-current {
    position: relative;
    background: color-mix(in srgb, var(--clock-ambient) 5%, transparent);
  }

  .journal-current::before {
    position: absolute;
    top: -1px;
    right: 24%;
    left: 24%;
    height: 2px;
    background: var(--cinnabar);
    content: "";
  }

  .journal-index a {
    transition: color 180ms ease, background-color 180ms ease;
  }

  .journal-index a:hover {
    color: var(--cinnabar);
    background: rgb(255 255 255 / 18%);
  }

  .journal-index a:hover strong {
    color: var(--cinnabar);
  }

  @media (max-width: 1180px) {
    .journal-enabled .detail-layout {
      grid-template-columns: minmax(280px, .68fr) minmax(500px, 1.32fr);
      gap: 54px;
    }

    .journal-enabled .detail-stage {
      min-height: 650px;
      padding-right: 50px;
      padding-left: 50px;
    }
  }

  @media (max-width: 980px) {
    .detail-page.journal-enabled {
      width: min(100% - 32px, 900px);
    }

    .journal-enabled .detail-layout {
      min-height: auto;
      padding: 56px 0 76px;
      grid-template-columns: 1fr;
      gap: 60px;
    }

    .journal-enabled .detail-copy {
      position: relative;
      top: auto;
      max-width: 680px;
    }

    .journal-enabled .detail-stage {
      min-height: min(92vw, 740px);
    }

    .journal-enabled .portrait .exhibit-column:not(.focus-mode) .detail-stage {
      min-height: min(116vw, 780px);
    }

    .journal-enabled .landscape .exhibit-column:not(.focus-mode) .detail-stage {
      min-height: min(72vw, 650px);
    }
  }

  @media (max-width: 600px) {
    .detail-page.journal-enabled {
      width: min(100% - 28px, 1500px);
      padding-top: 26px;
    }

    .journal-enabled .detail-layout {
      padding: 44px 0 62px;
      gap: 48px;
    }

    .journal-enabled .detail-copy {
      padding-left: 27px;
    }

    .journal-enabled h1 {
      max-width: none;
      font-size: clamp(42px, 13vw, 54px);
    }

    .journal-enabled .lead {
      margin-top: 32px;
      font-size: 17px;
    }

    .journal-enabled .detail-stage {
      padding: 45px 20px;
      box-shadow: none;
    }

    .journal-enabled .portrait .exhibit-column:not(.focus-mode) .detail-stage {
      min-height: min(142vw, 560px);
    }

    .journal-enabled .square .exhibit-column:not(.focus-mode) .detail-stage {
      min-height: min(104vw, 430px);
      padding: 38px 18px;
    }

    .journal-enabled .landscape .exhibit-column:not(.focus-mode) .detail-stage {
      min-height: min(78vw, 340px);
      padding: 42px 18px;
    }

    .journal-enabled .portrait .exhibit-column:not(.focus-mode) .detail-frame,
    .journal-enabled .square .exhibit-column:not(.focus-mode) .detail-frame,
    .journal-enabled .landscape .exhibit-column:not(.focus-mode) .detail-frame {
      width: 100%;
    }

    .journal-enabled .exhibit-column.focus-mode .detail-stage {
      min-height: 0;
      padding: 40px 8px 34px;
    }

    .journal-enabled .local-note,
    .journal-index small,
    .journal-index span {
      font-size: 10px;
      letter-spacing: .08em;
    }

    .journal-enabled .journal-index {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .journal-index > * {
      min-height: 98px;
      padding: 16px 14px;
    }

    .journal-index .journal-current {
      grid-column: 1 / -1;
      grid-row: 1;
      border-bottom: 1px solid var(--line);
      border-left: 0;
    }

    .journal-index .journal-previous {
      border-left: 0;
    }

    .journal-index .journal-next {
      border-left: 1px solid var(--line);
    }

    .journal-index strong {
      font-size: 17px;
    }
  }

  @media (max-width: 600px) and (max-height: 700px) {
    .journal-enabled .exhibit-column.focus-mode .detail-stage {
      padding-top: 36px;
      padding-bottom: 30px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .journal-index a {
      transition: none;
    }
  }
</style>
