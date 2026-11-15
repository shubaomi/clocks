<script>
  import { getActualSolarTerm, getSolarTermCompressionState, solarTerms } from "../../lib/time-systems.js";
  let { time, motion = true } = $props();
  let state = $derived(getSolarTermCompressionState(time));
  let actual = $derived(getActualSolarTerm(new Date(time.timestamp)));
  const seasonColors = ["#607c88", "#708f68", "#b28a4d", "#9b5b45"];
  let season = $derived(Math.floor(state.termIndex / 6));
  const distantRidge = "M-40 145 Q35 134 86 110 T181 107 Q224 90 270 62 T352 87 Q399 116 462 85 T577 102 Q621 77 669 74 T771 95 Q837 54 883 73 T979 88 Q1033 65 1080 92 T1194 77 Q1278 125 1330 86 T1450 74 L1450 340 H-40Z";
  const nearRidge = "M-40 202 Q18 207 65 182 T174 168 Q215 133 250 149 T324 146 Q387 107 422 121 T510 158 Q554 174 609 150 T704 142 Q785 178 848 136 T955 124 Q994 112 1035 133 T1120 155 Q1160 129 1220 109 T1315 126 Q1366 163 1450 121 L1450 340 H-40Z";
  let scrollProgress = $derived(motion ? time.progress.day : 0.5);
</script>

<div class="clock" style={`--season:${seasonColors[season]}`} aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，一日节气长卷行至${state.term.zh}${state.pentad}`}>
  <div class="grain"></div>
  <header>
    <div><b>一日四时</b><span>TWENTY-FOUR SOLAR TERMS</span></div>
    <time>{time.hh}:{time.mm}<small>{time.ss}</small></time>
  </header>
  <div class="rule">一年入一日 · 一节气一小时 · 一候二十分钟</div>

  <section class="scroll">
    <svg class="landscape" viewBox="0 0 1080 300" preserveAspectRatio="none" aria-hidden="true">
      <circle cx={25 + state.termProgress * 1030} cy="75" r="18" fill="#b54e35"/>
      <g class="distant-ridge" transform={`translate(${-scrollProgress * 100},0)`}>
        <path d={distantRidge} fill="currentColor"/>
        <path d={distantRidge} transform="translate(0,4)" class="ridge-edge"/>
      </g>
      <g class="near-ridge" transform={`translate(${-scrollProgress * 345},0)`}>
        <path d={nearRidge} fill="currentColor"/>
        {#each [4, 11, 19, 29, 41, 55] as offset}
          <path d={nearRidge} class="ridge-edge" transform={`translate(0,${offset})`}/>
        {/each}
      </g>
    </svg>
    {#if motion}<i class="weather-mark" aria-hidden="true" style={`left:${3 + time.progress.minute * 94}%`}>{["❄","·","✦","◌"][season]}</i>{/if}
    <div class="season-names"><span>冬</span><span>春</span><span>夏</span><span>秋</span></div>
    <div class="terms">
      {#each solarTerms as term}
        <span class:active={term.index === state.termIndex} class:past={term.index < state.termIndex}>{term.zh}</span>
      {/each}
    </div>
  </section>

  <section class="reading">
    <div class="ordinal"><small>一日映射</small><b>{String(state.termIndex + 1).padStart(2, "0")} / 24</b></div>
    <div class="current"><strong>{state.term.zh}</strong><span>{state.term.en}</span></div>
    <div class="pentads">
      {#each state.term.pentads as pentad, index}
        <span class:active={index === state.pentadInTerm} class:past={index < state.pentadInTerm}>{pentad}</span>
      {/each}
    </div>
  </section>

  <footer><span>真实日期 · 黄经近似</span><b>{actual.zh} · {actual.en}</b><span>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:720px;overflow:hidden;padding:52px 62px;color:#26231d;background:linear-gradient(180deg,#eee5ce,#d9d0b9 65%,color-mix(in srgb,var(--season) 25%,#b9ac8e));font-family:"Songti SC","STSong",serif}
  .grain{position:absolute;inset:0;opacity:.16;background:repeating-linear-gradient(0deg,transparent 0 9px,#473b2918 10px),radial-gradient(circle at 20% 40%,#fff8 0 1px,transparent 2px);background-size:auto,17px 19px;pointer-events:none}
  header,.rule,.scroll,.reading,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid #493e2b55;padding-bottom:22px}header div{display:flex;align-items:baseline;gap:20px}header b{font-size:38px;font-weight:500;letter-spacing:.12em}header span,.rule,footer,.ordinal,.current span{font-family:monospace;letter-spacing:.12em}header span{font-size:12px;color:#6b6254}time{font:700 40px monospace;letter-spacing:-.06em}time small{margin-left:8px;color:#9b372e;font-size:14px;vertical-align:top}.rule{margin-top:12px;color:#6d6252;font-size:11px}
  .scroll{position:relative;height:330px;margin-top:20px;overflow:hidden;border-block:1px solid #5d50375c;background:linear-gradient(90deg,#8091a744,#a5b98255 33%,#d9bd6e55 60%,#b36c564d);box-shadow:inset 0 0 70px #fff7}
  .landscape { position:absolute; inset:0; width:100%; height:100%; }
  .distant-ridge { color:color-mix(in srgb,var(--season) 34%,#e3d8bc); }
  .near-ridge { color:color-mix(in srgb,var(--season) 50%,#d7ccb0); }
  .ridge-edge { fill:none; stroke:#fff3d6; stroke-width:1; opacity:.52; }
  .weather-mark{position:absolute;top:115px;color:color-mix(in srgb,var(--season) 70%,white);font-size:24px;font-style:normal;opacity:.7;filter:drop-shadow(0 0 9px #fff);pointer-events:none}.season-names{position:absolute;inset:24px 4%;display:flex;justify-content:space-around;color:#453b2c66;font-size:68px}.terms{position:absolute;right:18px;bottom:18px;left:18px;display:grid;grid-template-columns:repeat(24,1fr);align-items:end}.terms span{display:grid;height:82px;padding-top:7px;place-items:start center;border-left:1px solid #4b402b66;color:#3e382d;font-size:11px;font-weight:600;line-height:1.15;writing-mode:vertical-rl;text-shadow:0 1px 0 #fff7}.terms span.past{color:#3e5841;background:#f0ead922}.terms span.active{color:#8b271f;background:#fff4df66;font-weight:800;font-size:18px;box-shadow:inset 3px 0 #a83f30}
  .reading{display:grid;margin-top:24px;grid-template-columns:120px 300px 1fr;align-items:center}.ordinal{display:grid;gap:6px;color:#7b6d59;font-family:monospace;letter-spacing:.12em}.ordinal small{font-size:10px}.ordinal b{font-size:12px;font-weight:500}.current{display:grid}.current strong{font-size:48px;font-weight:500;color:var(--season)}.current span{font-size:10px}.pentads{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pentads span{padding:15px 10px;border-top:1px solid #5d503744;color:#7d725f;text-align:center}.pentads span.past{color:#50604c}.pentads span.active{border-color:#9c362c;color:#912e27;font-weight:700}
  footer{position:absolute;right:62px;bottom:34px;left:62px;display:grid;grid-template-columns:1fr auto 1fr;gap:20px;color:#6f6556;font-size:10px}footer b{color:#343027;font-family:inherit;font-size:14px}footer span:last-child{text-align:right}
  header span{font-size:20px}time small{font-size:20px}.rule{font-size:20px}.terms span{font-size:20px}.terms span.active{font-size:28px}.ordinal small{font-size:18px}.ordinal b{font-size:20px}.current span{font-size:20px}.pentads span{font-size:22px}.current strong{font-size:56px}footer{font-size:19px}footer b{font-size:21px}
  @media(max-width:520px){header b{font-size:54px}header span{display:none}time{font-size:58px}time small{font-size:42px}.rule{margin-top:8px;font-size:34px}.scroll{height:250px;margin-top:12px}.terms{display:none}.reading{margin-top:12px;grid-template-columns:190px 260px 1fr;align-items:start}.ordinal{gap:3px}.ordinal small{font-size:36px}.ordinal b{font-size:38px}.current strong{font-size:60px;line-height:1}.current span{font-size:30px}.pentads{gap:5px}.pentads span{padding:8px 5px;font-size:34px}footer{right:62px;bottom:18px;left:62px;display:grid;grid-template-columns:1fr auto auto;align-items:center;font-size:34px}footer b{font-size:36px}}
</style>
