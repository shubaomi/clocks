<script>
  import { onMount } from "svelte";
  import ClockRenderer from "./ClockRenderer.svelte";
  import ClockPreview from "./ClockPreview.svelte";
  import { clocks, getClock, routeFor, seriesOrder } from "../lib/catalog.js";
  import { pickFeaturedClock } from "../lib/featured-clock.js";

  let { time, spatialEnabled } = $props();
  let featuredSlug = $state(clocks[0].slug);
  let ready = $state(false);
  let featured = $derived(getClock(featuredSlug) ?? clocks[0]);
  let featuredIndex = $derived(clocks.findIndex((clock) => clock.slug === featured.slug) + 1);
  const groups = seriesOrder.map((series) => ({ series, clocks: clocks.filter((clock) => clock.series === series) }));

  function chooseNext() {
    featuredSlug = pickFeaturedClock(clocks.map((clock) => clock.slug));
  }

  onMount(() => {
    chooseNext();
    ready = true;
  });
</script>

<main id="main" class:ready class="gallery-page" style={`--ambient:${featured.ambient};--day:${time.progress.day}`}>
  <section class="living-gallery" aria-labelledby="featured-title">
    <div class="ambient-time" aria-hidden="true">{time.hh}<i>:</i>{time.mm}</div>
    <div class="day-line" style={`--day:${time.progress.day}`}><i></i></div>

    <header class="intro">
      <span>LIVE TIME GALLERY · 此刻展厅</span>
      <p>时间属于所有人，文化让它拥有不同的刻度、名称与形状。</p>
    </header>

    <div class="featured-layout">
      <div class="featured-stage" data-aspect={featured.aspect}>
        <div class="featured-frame" style={`aspect-ratio:${featured.canvas.width}/${featured.canvas.height}`}>
          <ClockRenderer slug={featured.slug} {time} {spatialEnabled} fit />
        </div>
        <div class="live-mark"><i></i>LIVE · {time.timezone.replaceAll("_", " ")}</div>
      </div>

      <div class="featured-copy">
        <span class="selection">此刻展出 · NOW SHOWING · {String(featuredIndex).padStart(2,"0")} / {clocks.length}</span>
        <span class="number">{featured.number}</span>
        <h1 id="featured-title">{featured.titleZh}</h1>
        <strong>{featured.titleEn}</strong>
        <p>{featured.description}</p>
        <div class="mapping"><b>{featured.mappingKind === "historical" ? "历史机制 · HISTORICAL BASIS" : "当代映射 · CONTEMPORARY MAPPING"}</b><span>{featured.rule}</span></div>
        <div class="actions">
          <a href={routeFor(featured)}>进入这座时钟 <i>↗</i></a>
          <button type="button" onclick={chooseNext} aria-label="随机推荐另一座时钟">换一座 · SHOW ANOTHER <span aria-hidden="true">↻</span></button>
        </div>
      </div>
    </div>

    <div class="now-strip">
      <span>同一个此刻</span><b>{time.hh}:{time.mm}:{time.ss}</b><i></i><span>十三种形状</span>
    </div>
  </section>

  <section id="collection" class="collection" aria-labelledby="collection-title">
    <header class="collection-heading"><div><span>FULL COLLECTION · {String(clocks.length).padStart(2,"0")}</span><h2 id="collection-title">沿着时间，继续走</h2></div><p>不必一次看完。按时序、哲思、器物与星空，任选一条路径。</p></header>

    {#each groups as group, groupIndex}
      <section class="series" aria-labelledby={`series-${groupIndex}`}>
        <header><span>0{groupIndex+1}</span><h3 id={`series-${groupIndex}`}>{group.series}</h3><i></i><small>{group.clocks.length} 座</small></header>
        <div class="shelf">
          {#each group.clocks as clock}
            <article class="mini-card" style={`--card:${clock.ambient}`}>
              <a class="mini-preview" href={routeFor(clock)} aria-label={`进入${clock.titleZh}`}><ClockPreview {clock} {time} {spatialEnabled} /></a>
              <div><span>{clock.kicker}</span><h4><a href={routeFor(clock)}>{clock.titleZh}</a></h4><small>{clock.titleEn}</small><p>{clock.rule}</p></div>
            </article>
          {/each}
        </div>
      </section>
    {/each}
  </section>

  <section class="closing"><span aria-hidden="true">时</span><div><p>时间没有国界，观看时间的方式有自己的文化纹理。</p><small>ONE MOMENT · MANY CULTURAL FORMS</small></div></section>
</main>

<style>
  .gallery-page{width:min(100% - 40px,1440px);margin:0 auto}.living-gallery{position:relative;min-height:calc(100vh - 89px);min-height:calc(100dvh - 89px);overflow:hidden;padding:34px clamp(20px,4vw,62px) 28px;border-bottom:1px solid var(--line);background:radial-gradient(circle at calc(12% + var(--day)*76%) 34%,color-mix(in srgb,var(--ambient) 26%,transparent),transparent 38%),linear-gradient(145deg,color-mix(in srgb,var(--paper-light) 86%,var(--ambient)),var(--paper) 62%);transition:background .7s ease}.living-gallery:after{position:absolute;inset:12px;border:1px solid color-mix(in srgb,var(--ambient) 22%,transparent);content:"";pointer-events:none}.ambient-time{position:absolute;right:-1vw;bottom:-7vw;color:color-mix(in srgb,var(--ambient) 8%,transparent);font:700 clamp(180px,30vw,430px) var(--mono);letter-spacing:-.12em;line-height:1;user-select:none}.ambient-time i{font-style:normal}.day-line{position:absolute;z-index:2;top:0;right:0;left:0;height:2px;background:color-mix(in srgb,var(--ambient) 12%,transparent)}.day-line i{display:block;width:100%;height:100%;background:var(--ambient);transform:scaleX(var(--day));transform-origin:left}
  .intro,.featured-layout,.now-strip{position:relative;z-index:3}.intro{display:flex;justify-content:space-between;gap:30px;color:var(--ink-soft)}.intro span,.intro p,.selection,.featured-copy>strong,.mapping,.actions,.live-mark,.now-strip,.collection-heading>div>span,.series header,.mini-card span,.mini-card small,.mini-card p,.closing small{font-family:var(--mono);letter-spacing:.1em}.intro span{color:var(--ambient);font-size:9px;font-weight:700}.intro p{max-width:370px;margin:0;font-size:9px;line-height:1.7;text-align:right}.featured-layout{display:grid;min-height:calc(100vh - 235px);min-height:calc(100dvh - 235px);grid-template-columns:minmax(420px,1.35fr) minmax(300px,.65fr);align-items:center;gap:clamp(48px,7vw,110px)}.featured-stage{position:relative;display:grid;height:min(68vh,720px);place-items:center}.featured-frame{overflow:hidden;max-width:100%;max-height:100%;border-radius:20px;box-shadow:0 38px 90px color-mix(in srgb,var(--ambient) 32%,transparent),0 0 0 1px #3c2f211f}.featured-stage[data-aspect="portrait"] .featured-frame{height:min(66vh,690px)}.featured-stage[data-aspect="square"] .featured-frame{width:min(57vh,620px)}.featured-stage[data-aspect="landscape"] .featured-frame{width:min(61vw,850px)}.live-mark{position:absolute;bottom:4px;left:4px;display:flex;align-items:center;gap:7px;color:var(--ink-faint);font-size:8px}.live-mark i{width:6px;height:6px;border-radius:50%;background:var(--ambient);box-shadow:0 0 0 4px color-mix(in srgb,var(--ambient) 15%,transparent)}
  .featured-copy{position:relative}.selection{color:var(--ambient);font-size:9px}.number{position:absolute;top:-24px;right:0;color:color-mix(in srgb,var(--ambient) 30%,transparent);font:120px var(--serif);line-height:1}.featured-copy h1{position:relative;margin:26px 0 5px;font:500 clamp(45px,5vw,76px)/1.08 var(--serif);letter-spacing:-.04em}.featured-copy>strong{color:var(--ink-faint);font-size:10px;text-transform:uppercase}.featured-copy>p{max-width:500px;margin:34px 0 25px;color:var(--ink-soft);font:16px/1.9 var(--serif)}.mapping{display:grid;padding:15px 0;gap:5px;border-block:1px solid var(--line);font-size:8px}.mapping b{color:var(--ambient)}.mapping span{color:var(--ink-faint)}.actions{display:flex;margin-top:28px;align-items:center;gap:30px}.actions a{display:flex;padding-bottom:5px;align-items:center;gap:18px;border-bottom:1px solid currentColor;color:var(--ink);font-size:11px;text-decoration:none}.actions a i{color:var(--ambient);font-style:normal}.actions button{padding:8px 0;border:0;color:var(--ink-soft);background:none;cursor:pointer;font-size:10px}.actions button span{display:inline-block;margin-left:5px;color:var(--ambient);font-size:16px}.now-strip{display:flex;align-items:center;gap:15px;color:var(--ink-faint);font-size:8px}.now-strip b{color:var(--ink);font-size:12px}.now-strip i{height:1px;flex:1;background:var(--line)}
  .collection{padding:115px 0 150px}.collection-heading{display:grid;margin-bottom:85px;grid-template-columns:1fr minmax(280px,430px);align-items:end;gap:40px}.collection-heading span{color:var(--cinnabar);font-size:9px}.collection-heading h2{margin:12px 0 0;font:500 clamp(36px,4.5vw,66px) var(--serif)}.collection-heading>p{margin:0;color:var(--ink-soft);font:16px/1.8 var(--serif)}.series{margin-top:74px}.series>header{display:flex;margin-bottom:24px;align-items:center;gap:18px}.series>header span{color:var(--cinnabar);font-size:9px}.series>header h3{margin:0;font-family:var(--serif);font-size:24px;font-weight:500}.series>header i{height:1px;flex:1;background:var(--line)}.series>header small{color:var(--ink-faint);font-size:8px}.shelf{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.mini-card{position:relative;overflow:hidden;border:1px solid var(--line);background:color-mix(in srgb,var(--paper-light) 86%,var(--card));box-shadow:0 16px 35px #3c2d1d0b}.mini-card:before{position:absolute;z-index:2;top:0;right:0;left:0;height:3px;background:var(--card);content:""}.mini-preview{display:grid;height:225px;padding:18px;place-items:center;background:radial-gradient(circle at 70% 15%,#fff8,transparent 36%),color-mix(in srgb,var(--card) 12%,var(--paper-deep));text-decoration:none}.mini-preview :global(.preview){width:auto;max-width:100%;height:100%;box-shadow:0 12px 28px #3727192e}.mini-card>div{padding:20px}.mini-card span{color:var(--card);font-size:8px}.mini-card h4{margin:9px 0 3px;font:500 24px var(--serif)}.mini-card h4 a{color:inherit;text-decoration:none}.mini-card small{color:var(--ink-faint);font-size:7px;text-transform:uppercase}.mini-card p{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--line);color:var(--ink-soft);font-size:8px}.closing{display:grid;min-height:280px;margin-bottom:100px;padding:50px;grid-template-columns:auto 1fr;align-items:center;gap:35px;border-block:1px solid var(--line)}.closing>span{color:var(--cinnabar);font:90px var(--serif)}.closing p{margin:0;font:clamp(23px,3vw,42px) var(--serif)}.closing small{color:var(--ink-faint);font-size:8px}
  @media(max-width:1050px){.featured-layout{grid-template-columns:1.1fr .9fr;gap:44px}.shelf{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:820px){.gallery-page{width:min(100% - 28px,1440px)}.living-gallery{min-height:auto;padding:28px 18px 35px}.intro p{display:none}.featured-layout{min-height:auto;padding:45px 0 35px;grid-template-columns:1fr;gap:45px}.featured-stage{height:min(72vw,560px)}.featured-stage[data-aspect="portrait"] .featured-frame{height:100%}.featured-stage[data-aspect="square"] .featured-frame{width:min(72vw,530px)}.featured-stage[data-aspect="landscape"] .featured-frame{width:100%}.featured-copy{max-width:620px}.collection-heading{grid-template-columns:1fr;gap:15px}.shelf{grid-template-columns:repeat(2,1fr)}.mini-preview{height:210px}}
  @media(max-width:520px){.intro span{font-size:8px}.ambient-time{bottom:20%;font-size:48vw}.featured-stage{height:92vw}.featured-stage[data-aspect="square"] .featured-frame{width:88vw}.featured-stage[data-aspect="landscape"] .featured-frame{width:100%}.featured-copy h1{font-size:43px}.featured-copy>p{font-size:15px}.number{font-size:90px}.actions{justify-content:space-between;gap:14px}.now-strip span:last-child{display:none}.collection{padding:82px 0 100px}.collection-heading{margin-bottom:56px}.series{margin-top:58px}.shelf{grid-template-columns:1fr}.mini-card{display:grid;grid-template-columns:132px 1fr}.mini-preview{height:180px;padding:12px}.mini-card>div{padding:20px 15px}.mini-card h4{font-size:20px}.closing{min-height:220px;margin-bottom:70px;padding:34px 18px;grid-template-columns:1fr;text-align:center}.closing>span{font-size:60px}}
</style>
