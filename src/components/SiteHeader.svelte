<script>
  import { clocks, routeFor } from "../lib/catalog.js";

  let { time, activeSlug = "" } = $props();
</script>

<header class="site-header">
  <a class="brand" href="/" aria-label="时间造物集首页">
    <span class="brand-mark" aria-hidden="true">时</span>
    <span class="brand-copy">
      <strong>CULTURAL CLOCKS</strong>
      <small>时间造物集</small>
    </span>
  </a>

  <nav aria-label="时钟作品">
    {#each clocks as clock}
      <a
        href={routeFor(clock)}
        aria-current={activeSlug === clock.slug ? "page" : undefined}
      >{clock.titleZh}</a>
    {/each}
  </nav>

  <div class="now" aria-label={`当前时间 ${time.hh}:${time.mm}:${time.ss}`}>
    <span>{time.hh}:{time.mm}</span>
    <small>{time.ss}</small>
  </div>
</header>

<style>
  .site-header {
    position: relative;
    z-index: 20;
    display: grid;
    width: min(100% - 40px, 1440px);
    min-height: 88px;
    margin: 0 auto;
    grid-template-columns: minmax(220px, 1fr) auto minmax(150px, 1fr);
    align-items: center;
    border-bottom: 1px solid var(--line);
  }

  .brand {
    display: inline-flex;
    width: max-content;
    align-items: center;
    gap: 12px;
    color: inherit;
    text-decoration: none;
  }

  .brand-mark {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 1px solid color-mix(in srgb, var(--cinnabar) 72%, transparent);
    color: var(--cinnabar);
    font-family: var(--serif);
    font-size: 18px;
    line-height: 1;
    transform: rotate(-2deg);
  }

  .brand-copy {
    display: grid;
    gap: 2px;
  }

  .brand-copy strong {
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.14em;
  }

  .brand-copy small {
    color: var(--ink-soft);
    font-family: var(--serif);
    font-size: 13px;
    letter-spacing: 0.2em;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  nav a {
    position: relative;
    padding: 10px 0;
    color: var(--ink-soft);
    font-size: 13px;
    text-decoration: none;
  }

  nav a::after {
    position: absolute;
    right: 0;
    bottom: 3px;
    left: 0;
    height: 1px;
    content: "";
    background: var(--cinnabar);
    transform: scaleX(0);
    transition: transform 180ms ease;
  }

  nav a:hover,
  nav a[aria-current="page"] {
    color: var(--ink);
  }

  nav a:hover::after,
  nav a[aria-current="page"]::after {
    transform: scaleX(1);
  }

  .now {
    display: flex;
    justify-self: end;
    align-items: flex-start;
    color: var(--ink);
    font-family: var(--mono);
    font-variant-numeric: tabular-nums;
  }

  .now span {
    font-size: 18px;
    letter-spacing: -0.04em;
  }

  .now small {
    margin: 1px 0 0 5px;
    color: var(--cinnabar);
    font-size: 9px;
  }

  @media (max-width: 760px) {
    .site-header {
      width: min(100% - 28px, 1440px);
      min-height: 72px;
      grid-template-columns: 1fr auto;
    }

    nav {
      display: none;
    }

    .brand-mark {
      width: 30px;
      height: 30px;
    }

    .brand-copy strong {
      font-size: 10px;
    }

    .brand-copy small {
      font-size: 11px;
    }

    .now span {
      font-size: 16px;
    }
  }
</style>
