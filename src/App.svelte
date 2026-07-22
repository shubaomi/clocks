<script>
  import { onMount } from "svelte";
  import SiteHeader from "./components/SiteHeader.svelte";
  import GalleryPage from "./components/GalleryPage.svelte";
  import ClockDetail from "./components/ClockDetail.svelte";
  import NotFound from "./components/NotFound.svelte";
  import { createClockTime } from "./lib/clock-time.js";
  import { getClock } from "./lib/catalog.js";

  const normalizedPath = window.location.pathname
    .replace(/\/index\.html$/, "/")
    .replace(/^\/+|\/+$/g, "");
  const activeClock = normalizedPath ? getClock(normalizedPath) : undefined;
  const isHome = normalizedPath === "";

  let time = $state(createClockTime());

  onMount(() => {
    let frame;
    let previous = 0;
    const frameInterval = activeClock ? 32 : 200;

    const tick = (timestamp) => {
      if (!document.hidden && timestamp - previous >= frameInterval) {
        time = createClockTime();
        previous = timestamp;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  });
</script>

<svelte:head>
  <title>{activeClock ? `${activeClock.titleZh} — 时间造物集` : "时间造物集 — 十二种时间形状"}</title>
  <meta
    name="description"
    content={activeClock
      ? activeClock.description
      : "时间造物集，以当代数字设计呈现不同文化理解、记录与想象时间的方式。"}
  />
</svelte:head>

<a class="skip-link" href="#main">跳到主要内容</a>
<SiteHeader {time} activeSlug={activeClock?.slug ?? ""} />

{#if activeClock}
  <ClockDetail clock={activeClock} {time} />
{:else if isHome}
  <GalleryPage {time} />
{:else}
  <NotFound />
{/if}

<footer class="site-footer">
  <div>
    <strong>FORMS OF TIME</strong>
    <span>时间造物集</span>
  </div>
  <p>One shared moment, shaped by culture, rhythm and imagination.</p>
  <span>© {time.year} 时间造物集</span>
</footer>
