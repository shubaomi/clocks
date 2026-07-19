<script>
  import ClockRenderer from "./ClockRenderer.svelte";
  import { clocks, routeFor } from "../lib/catalog.js";

  let { time } = $props();
</script>

<main id="main" class="gallery-page">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <span class="eyebrow">A COLLECTION OF CULTURAL CLOCKS · 文化时钟作品集</span>
      <h1 id="hero-title">
        时间，不止一种<br />
        <em>被看见的方式。</em>
      </h1>
      <p>
        以当代数字设计重新观看中国传统时间。每一座时钟，都是一种理解昼夜、节律与文化的方法。
      </p>
    </div>

    <div class="hero-time" aria-label="访客本地时间">
      <span class="day-mark" style={`--day:${time.progress.day}`}></span>
      <div class="hero-digital">
        <span>{time.hh}:{time.mm}</span>
        <small>{time.ss}</small>
      </div>
      <div class="hero-meta">
        <span>LOCAL TIME</span>
        <span>{time.timezone.replaceAll("_", " ")}</span>
      </div>
    </div>
  </section>

  <section class="collection" aria-labelledby="collection-title">
    <header class="section-heading">
      <div>
        <span>COLLECTION · {String(clocks.length).padStart(2, "0")}</span>
        <h2 id="collection-title">当前展品</h2>
      </div>
      <p>每件作品都读取你此刻的本地时间，并以自己的文化刻度持续运行。</p>
    </header>

    <div class="exhibit-grid">
      {#each clocks as clock, index}
        <article
          class="exhibit-card"
          class:portrait={clock.aspect === "portrait"}
          class:square={clock.aspect === "square"}
          data-theme={clock.theme}
        >
          <div class="exhibit-index" aria-hidden="true">
            <span>{clock.number}</span>
            <i></i>
            <small>0{index + 1}</small>
          </div>

          <a class="preview-link" href={routeFor(clock)} aria-label={`查看${clock.titleZh}详情`}>
            <div class="preview-stage">
              <div class="preview-frame">
                <ClockRenderer slug={clock.slug} {time} fit />
              </div>
            </div>
          </a>

          <div class="exhibit-copy">
            <span class="exhibit-kicker">{clock.kicker}</span>
            <h3><a href={routeFor(clock)}>{clock.titleZh}</a></h3>
            <strong>{clock.titleEn}</strong>
            <p>{clock.description}</p>
            <div class="rule-row">
              <span>{clock.rule}</span>
              <span>{clock.ruleEn}</span>
            </div>
            <a class="enter-link" href={routeFor(clock)}>
              <span>进入展品</span>
              <i aria-hidden="true">↗</i>
            </a>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="manifesto" aria-label="创作理念">
    <span class="manifesto-mark" aria-hidden="true">观</span>
    <p>钟表记录相同的时刻，文化赋予时间不同的形状。</p>
    <small>THE SAME MOMENT, SEEN THROUGH DIFFERENT CULTURES.</small>
  </section>
</main>

<style>
  .gallery-page {
    width: min(100% - 40px, 1440px);
    margin: 0 auto;
  }

  .hero {
    display: grid;
    min-height: clamp(530px, 72vh, 760px);
    grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.55fr);
    align-items: center;
    border-bottom: 1px solid var(--line);
  }

  .hero-copy {
    padding: 72px 8vw 72px 3vw;
  }

  .eyebrow,
  .section-heading span,
  .exhibit-kicker,
  .rule-row,
  .manifesto small {
    font-family: var(--mono);
    letter-spacing: 0.13em;
  }

  .eyebrow {
    color: var(--cinnabar);
    font-size: 10px;
  }

  h1 {
    max-width: 930px;
    margin: 34px 0 32px;
    color: var(--ink);
    font-family: var(--serif);
    font-size: clamp(54px, 7.2vw, 112px);
    font-weight: 450;
    letter-spacing: -0.055em;
    line-height: 1.06;
  }

  h1 em {
    color: var(--cinnabar);
    font-style: normal;
  }

  .hero-copy p {
    max-width: 660px;
    margin: 0;
    color: var(--ink-soft);
    font-family: var(--serif);
    font-size: clamp(16px, 1.45vw, 21px);
    line-height: 1.9;
  }

  .hero-time {
    position: relative;
    display: grid;
    width: min(31vw, 390px);
    aspect-ratio: 1;
    place-items: center;
    justify-self: center;
    border: 1px solid color-mix(in srgb, var(--jade) 30%, transparent);
    border-radius: 50%;
  }

  .hero-time::before,
  .hero-time::after {
    position: absolute;
    border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    border-radius: 50%;
    content: "";
  }

  .hero-time::before {
    inset: 11%;
  }

  .hero-time::after {
    inset: 24%;
  }

  .day-mark {
    --angle: calc(var(--day) * 1turn - 0.25turn);
    position: absolute;
    top: calc(50% + sin(var(--angle)) * 50%);
    left: calc(50% + cos(var(--angle)) * 50%);
    width: 12px;
    height: 12px;
    border: 3px solid var(--paper);
    border-radius: 50%;
    background: var(--cinnabar);
    box-shadow: 0 0 0 1px var(--cinnabar), 0 0 28px rgb(159 52 40 / 42%);
    transform: translate(-50%, -50%);
  }

  .hero-digital {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: flex-start;
    font-family: var(--mono);
    font-variant-numeric: tabular-nums;
  }

  .hero-digital span {
    font-size: clamp(42px, 5vw, 74px);
    letter-spacing: -0.08em;
  }

  .hero-digital small {
    margin: 8px 0 0 10px;
    color: var(--cinnabar);
    font-size: 13px;
  }

  .hero-meta {
    position: absolute;
    right: 16%;
    bottom: 21%;
    left: 16%;
    display: flex;
    justify-content: space-between;
    color: var(--ink-faint);
    font-family: var(--mono);
    font-size: 8px;
    letter-spacing: 0.08em;
  }

  .collection {
    padding: 116px 0 150px;
  }

  .section-heading {
    display: grid;
    margin-bottom: 64px;
    grid-template-columns: 1fr minmax(280px, 470px);
    align-items: end;
    gap: 40px;
  }

  .section-heading span {
    color: var(--cinnabar);
    font-size: 10px;
  }

  .section-heading h2 {
    margin: 12px 0 0;
    font-family: var(--serif);
    font-size: clamp(34px, 4vw, 58px);
    font-weight: 500;
  }

  .section-heading p {
    margin: 0;
    color: var(--ink-soft);
    line-height: 1.8;
  }

  .exhibit-grid {
    display: grid;
    grid-template-columns: minmax(320px, 0.84fr) minmax(500px, 1.16fr);
    align-items: stretch;
    gap: clamp(26px, 3.2vw, 52px);
  }

  .exhibit-card {
    position: relative;
    display: grid;
    min-width: 0;
    padding: clamp(20px, 2.5vw, 38px);
    grid-template-rows: minmax(0, 1fr) auto;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--paper-light) 80%, transparent);
    box-shadow: 0 26px 80px rgb(43 35 24 / 8%);
  }

  .exhibit-card::before {
    position: absolute;
    inset: 9px;
    border: 1px solid color-mix(in srgb, var(--ink) 6%, transparent);
    content: "";
    pointer-events: none;
  }

  .exhibit-index {
    position: absolute;
    z-index: 3;
    top: 26px;
    left: 27px;
    display: grid;
    width: 18px;
    justify-items: center;
    gap: 8px;
    color: var(--ink-faint);
    font-family: var(--serif);
    font-size: 10px;
  }

  .exhibit-index i {
    width: 1px;
    height: 34px;
    background: var(--line-strong);
  }

  .preview-link {
    display: block;
    min-height: 0;
    color: inherit;
  }

  .preview-stage {
    display: grid;
    min-height: 560px;
    place-items: center;
    overflow: hidden;
    background:
      radial-gradient(circle at 72% 18%, rgb(255 255 255 / 55%), transparent 35%),
      linear-gradient(145deg, #d8cfb9, #ece5d6 48%, #c9baa0);
  }

  .square .preview-stage {
    background:
      radial-gradient(circle at 20% 18%, rgb(255 255 255 / 54%), transparent 34%),
      linear-gradient(145deg, #d5c7ba, #ede1d0 52%, #c8aa91);
  }

  .preview-frame {
    overflow: hidden;
    border-radius: 18px;
    box-shadow:
      0 28px 70px rgb(46 34 18 / 25%),
      0 0 0 1px rgb(65 43 19 / 14%);
    transition: transform 500ms cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 500ms ease;
  }

  .portrait .preview-frame {
    width: min(70%, 350px);
    aspect-ratio: 2 / 3;
  }

  .square .preview-frame {
    width: min(82%, 570px);
    aspect-ratio: 1;
  }

  .preview-link:hover .preview-frame {
    box-shadow:
      0 38px 90px rgb(46 34 18 / 30%),
      0 0 0 1px rgb(65 43 19 / 18%);
    transform: translateY(-7px);
  }

  .exhibit-copy {
    position: relative;
    padding: 34px 4px 4px;
  }

  .exhibit-kicker {
    color: var(--cinnabar);
    font-size: 9px;
  }

  .exhibit-copy h3 {
    margin: 13px 0 4px;
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 44px);
    font-weight: 500;
  }

  .exhibit-copy h3 a {
    color: inherit;
    text-decoration: none;
  }

  .exhibit-copy > strong {
    color: var(--ink-faint);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .exhibit-copy p {
    max-width: 590px;
    margin: 22px 0;
    color: var(--ink-soft);
    font-family: var(--serif);
    line-height: 1.8;
  }

  .rule-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    color: var(--ink-faint);
    font-size: 8px;
  }

  .enter-link {
    display: inline-flex;
    margin-top: 27px;
    align-items: center;
    gap: 28px;
    border-bottom: 1px solid var(--ink);
    color: var(--ink);
    font-size: 13px;
    text-decoration: none;
  }

  .enter-link i {
    color: var(--cinnabar);
    font-style: normal;
    transition: transform 180ms ease;
  }

  .enter-link:hover i {
    transform: translate(3px, -3px);
  }

  .manifesto {
    display: grid;
    min-height: 300px;
    margin-bottom: 110px;
    padding: 60px clamp(28px, 6vw, 90px);
    grid-template-columns: auto 1fr;
    align-content: center;
    align-items: center;
    gap: 10px 34px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .manifesto-mark {
    grid-row: 1 / 3;
    color: var(--cinnabar);
    font-family: var(--serif);
    font-size: clamp(58px, 7vw, 94px);
  }

  .manifesto p {
    margin: 0;
    font-family: var(--serif);
    font-size: clamp(24px, 3.5vw, 48px);
  }

  .manifesto small {
    color: var(--ink-faint);
    font-size: 8px;
  }

  @media (max-width: 1040px) {
    .hero {
      grid-template-columns: minmax(0, 1fr) minmax(260px, 0.45fr);
    }

    .hero-time {
      width: min(33vw, 330px);
    }

    .exhibit-grid {
      grid-template-columns: 1fr 1.15fr;
    }

    .preview-stage {
      min-height: 480px;
    }
  }

  @media (max-width: 820px) {
    .gallery-page {
      width: min(100% - 28px, 1440px);
    }

    .hero {
      min-height: auto;
      padding: 80px 0;
      grid-template-columns: 1fr;
      gap: 60px;
    }

    .hero-copy {
      padding: 0;
    }

    h1 {
      margin-top: 26px;
    }

    .hero-time {
      width: min(78vw, 380px);
    }

    .section-heading,
    .exhibit-grid {
      grid-template-columns: 1fr;
    }

    .section-heading {
      align-items: start;
      gap: 18px;
    }

    .exhibit-grid {
      gap: 32px;
    }

    .preview-stage {
      min-height: min(118vw, 650px);
    }

    .square .preview-stage {
      min-height: min(100vw, 650px);
    }
  }

  @media (max-width: 520px) {
    .collection {
      padding: 84px 0 100px;
    }

    .section-heading {
      margin-bottom: 38px;
    }

    .exhibit-card {
      padding: 16px;
    }

    .exhibit-index {
      top: 22px;
      left: 21px;
    }

    .preview-stage {
      min-height: 125vw;
    }

    .square .preview-stage {
      min-height: 92vw;
    }

    .portrait .preview-frame {
      width: 80%;
    }

    .square .preview-frame {
      width: 94%;
    }

    .exhibit-copy {
      padding: 28px 4px 5px;
    }

    .manifesto {
      min-height: 250px;
      margin-bottom: 70px;
      padding: 40px 20px;
      grid-template-columns: 1fr;
      text-align: center;
    }

    .manifesto-mark {
      grid-row: auto;
    }
  }
</style>
