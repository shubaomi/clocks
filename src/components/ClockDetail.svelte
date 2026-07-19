<script>
  import ClockRenderer from "./ClockRenderer.svelte";

  let { clock, time } = $props();
</script>

<main id="main" class="detail-page" data-theme={clock.theme}>
  <div class="breadcrumb">
    <a href="/">时间造物集</a>
    <span aria-hidden="true">/</span>
    <span>{clock.titleZh}</span>
  </div>

  <section class="detail-layout" class:portrait={clock.aspect === "portrait"} class:square={clock.aspect === "square"}>
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
        <span>正在读取你的本地时间 · {time.timezone.replaceAll("_", " ")}</span>
      </div>
    </div>

    <div class="detail-stage">
      <div class="stage-label stage-label-top" aria-hidden="true">
        <span>LIVE EXHIBIT</span>
        <span>{time.hh}:{time.mm}:{time.ss}</span>
      </div>

      <div class="detail-frame">
        <ClockRenderer slug={clock.slug} {time} fit />
      </div>

      <div class="stage-label stage-label-bottom" aria-hidden="true">
        <span>HONGRUN CLOCKS</span>
        <span>LOCAL TIME</span>
      </div>
    </div>
  </section>

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

  .portrait .detail-frame {
    width: min(68%, 520px);
    aspect-ratio: 2 / 3;
  }

  .square .detail-frame {
    width: min(88%, 760px);
    aspect-ratio: 1;
  }

  .stage-label {
    position: absolute;
    z-index: 3;
    right: 34px;
    left: 34px;
    display: flex;
    justify-content: space-between;
    color: rgb(52 42 28 / 45%);
    font-size: 8px;
  }

  .stage-label-top {
    top: 34px;
  }

  .stage-label-bottom {
    bottom: 34px;
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

    .portrait .detail-frame {
      width: 100%;
    }

    .square .detail-frame {
      width: 100%;
    }

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
  }
</style>
