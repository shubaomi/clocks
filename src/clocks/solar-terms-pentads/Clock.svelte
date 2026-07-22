<script>
  import { getActualSolarTerm, getSolarTermCompressionState, solarTerms } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getSolarTermCompressionState(time));
  let actual = $derived(getActualSolarTerm(new Date(time.timestamp)));
  const seasonColors = ["#607c88", "#708f68", "#b28a4d", "#9b5b45"];
  let season = $derived(Math.floor(state.termIndex / 6));
</script>

<div class="clock" style={`--season:${seasonColors[season]}`} aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，一日节气长卷行至${state.term.zh}${state.pentad}`}>
  <div class="grain"></div>
  <header>
    <div><b>一日四时</b><span>TWENTY-FOUR SOLAR TERMS</span></div>
    <time>{time.hh}:{time.mm}<small>{time.ss}</small></time>
  </header>
  <div class="rule">一年入一日 · 一节气一小时 · 一候二十分钟</div>

  <section class="scroll">
    <div class="mountains m1"></div><div class="mountains m2"></div>
    <div class="sun" style={`left:${state.termProgress * 100}%`}></div>
    <i class="weather-mark" aria-hidden="true" style={`left:${(time.second + time.progress.second) / 60 * 100}%`}>{["❄","·","✦","◌"][season]}</i>
    <div class="season-names"><span>冬</span><span>春</span><span>夏</span><span>秋</span></div>
    <div class="terms">
      {#each solarTerms as term}
        <span class:active={term.index === state.termIndex} class:past={term.index < state.termIndex}>{term.zh}</span>
      {/each}
    </div>
  </section>

  <section class="reading">
    <div class="ordinal">{String(state.termIndex + 1).padStart(2, "0")} / 24</div>
    <div class="current"><strong>{state.term.zh}</strong><span>{state.term.en}</span></div>
    <div class="pentads">
      {#each state.term.pentads as pentad, index}
        <span class:active={index === state.pentadInTerm} class:past={index < state.pentadInTerm}>{pentad}</span>
      {/each}
    </div>
  </section>

  <footer><span>真实日期节气（太阳黄经近似）</span><b>{actual.zh} · {actual.en}</b><span>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:720px;overflow:hidden;padding:52px 62px;color:#26231d;background:linear-gradient(180deg,#eee5ce,#d9d0b9 65%,color-mix(in srgb,var(--season) 25%,#b9ac8e));font-family:"Songti SC","STSong",serif}
  .grain{position:absolute;inset:0;opacity:.16;background:repeating-linear-gradient(0deg,transparent 0 9px,#473b2918 10px),radial-gradient(circle at 20% 40%,#fff8 0 1px,transparent 2px);background-size:auto,17px 19px;pointer-events:none}
  header,.rule,.scroll,.reading,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid #493e2b55;padding-bottom:22px}header div{display:flex;align-items:baseline;gap:20px}header b{font-size:38px;font-weight:500;letter-spacing:.12em}header span,.rule,footer,.ordinal,.current span{font-family:monospace;letter-spacing:.12em}header span{font-size:12px;color:#6b6254}time{font:700 40px monospace;letter-spacing:-.06em}time small{margin-left:8px;color:#9b372e;font-size:14px;vertical-align:top}.rule{margin-top:12px;color:#6d6252;font-size:11px}
  .scroll{position:relative;height:330px;margin-top:20px;overflow:hidden;border-block:1px solid #5d50375c;background:linear-gradient(90deg,#8091a744,#a5b98255 33%,#d9bd6e55 60%,#b36c564d);box-shadow:inset 0 0 70px #fff7}.mountains{position:absolute;left:-5%;right:-5%;bottom:-80px;height:240px;border-radius:50%;background:#59695628;transform:rotate(-3deg)}.m2{right:-20%;bottom:-140px;left:34%;height:280px;background:#465c5635;transform:rotate(5deg)}.sun{position:absolute;top:70px;width:28px;height:28px;border-radius:50%;background:#a83f30;box-shadow:0 0 40px #b9463f99;transform:translateX(-50%);transition:left .8s linear}.weather-mark{position:absolute;top:115px;color:color-mix(in srgb,var(--season) 70%,white);font-size:24px;font-style:normal;opacity:.7;filter:drop-shadow(0 0 9px #fff);transition:left .8s linear}.season-names{position:absolute;inset:24px 4%;display:flex;justify-content:space-around;color:#453b2c66;font-size:68px}.terms{position:absolute;right:18px;bottom:18px;left:18px;display:grid;grid-template-columns:repeat(24,1fr);align-items:end}.terms span{display:grid;height:82px;padding-top:7px;place-items:start center;border-left:1px solid #4b402b66;color:#3e382d;font-size:11px;font-weight:600;line-height:1.15;writing-mode:vertical-rl;text-shadow:0 1px 0 #fff7}.terms span.past{color:#3e5841;background:#f0ead922}.terms span.active{color:#8b271f;background:#fff4df66;font-weight:800;font-size:18px;box-shadow:inset 3px 0 #a83f30}
  .reading{display:grid;margin-top:24px;grid-template-columns:120px 300px 1fr;align-items:center}.ordinal{font-size:12px;color:#7b6d59}.current{display:grid}.current strong{font-size:48px;font-weight:500;color:var(--season)}.current span{font-size:10px}.pentads{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pentads span{padding:15px 10px;border-top:1px solid #5d503744;color:#7d725f;text-align:center}.pentads span.past{color:#50604c}.pentads span.active{border-color:#9c362c;color:#912e27;font-weight:700}
  footer{position:absolute;right:62px;bottom:34px;left:62px;display:grid;grid-template-columns:1fr auto 1fr;gap:20px;color:#6f6556;font-size:10px}footer b{color:#343027;font-family:inherit;font-size:14px}footer span:last-child{text-align:right}
  header span{font-size:20px}time small{font-size:20px}.rule{font-size:20px}.terms span{font-size:20px}.terms span.active{font-size:28px}.ordinal{font-size:20px}.current span{font-size:20px}.pentads span{font-size:22px}.current strong{font-size:56px}footer{font-size:19px}footer b{font-size:21px}
  @media(max-width:520px){header b{font-size:54px}header span{display:none}time{font-size:58px}time small{font-size:42px}.rule{font-size:42px}.terms,footer{display:none}.ordinal{font-size:42px}.current strong{font-size:72px}.current span{font-size:42px}.pentads span{font-size:42px}}
</style>
