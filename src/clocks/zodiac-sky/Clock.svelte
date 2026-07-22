<script>
  import { getZodiacSkyState, zodiacSigns } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getZodiacSkyState(time));
  const point=(angle,radius)=>({x:600+Math.cos(angle*Math.PI/180)*radius,y:355+Math.sin(angle*Math.PI/180)*radius});
  let sun = $derived(point(state.longitude-90,420));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，太阳黄经约 ${Math.round(state.longitude)} 度，位于${state.sign.zh}黄道区段`}>
  <header><div><b>黄道天穹</b><span>ZODIAC SKY · WORLD SKY SERIES</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <svg viewBox="0 0 1200 650" role="img" aria-label="十二黄道区段与太阳位置">
      <defs><radialGradient id="sky"><stop stop-color="#274b78"/><stop offset="1" stop-color="#081426"/></radialGradient></defs>
      <ellipse cx="600" cy="355" rx="510" ry="270" fill="url(#sky)" stroke="#8eadd65a" stroke-width="2"/>
      <g style={`transform:rotate(${state.skyRotation}deg);transform-origin:600px 355px`}>
        {#each zodiacSigns as sign,index}
          {@const p=point(index*30-90,420)}
          <line x1="600" y1="355" x2={p.x} y2={p.y} class="sector"/>
          <text x={p.x} y={p.y} text-anchor="middle" class:active={index===state.index} style={`transform:rotate(${-state.skyRotation}deg);transform-origin:${p.x}px ${p.y}px`}>{sign.symbol}</text>
        {/each}
      </g>
      <ellipse cx="600" cy="355" rx="430" ry="225" class="ecliptic"/>
      <circle cx={sun.x} cy={sun.y} r="13" class="sun"/>
    </svg>
    <div class="read"><span>太阳周年位置 · APPROX.</span><strong>{state.sign.zh}</strong><b>{state.sign.en} · {state.sign.symbol}</b><small>黄经 {state.longitude.toFixed(1)}°</small></div>
  </main>
  <footer><span>日期循黄道</span><b>等分黄道宫 · 非星座运势</b><span>时刻转天穹</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:760px;overflow:hidden;padding:42px 54px;color:#dce6f2;background:radial-gradient(circle at 50% 40%,#173461,#091326 70%,#070d19);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";background:radial-gradient(circle,#dce8ff 0 1px,transparent 1.5px);background-size:23px 27px;opacity:.18}header,main,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #bdcde63a;padding-bottom:18px}header div{display:flex;align-items:baseline;gap:18px}header b{font-size:33px;font-weight:400;letter-spacing:.16em}header span,time,.read span,.read b,.read small,footer{font-family:monospace;letter-spacing:.1em}header span{font-size:9px;color:#839bbd}time{font-size:29px}time small{color:#f0b751;font-size:10px;vertical-align:top;margin-left:6px}main{position:relative;height:590px}svg{width:100%;height:100%}.sector{stroke:#8098be29}.ecliptic{fill:none;stroke:#d7bd8055;stroke-width:3;stroke-dasharray:8 8}svg text{fill:#8ba2c4;font:34px serif}svg text.active{fill:#ffd16a;font-size:52px;filter:drop-shadow(0 0 12px #ffc45a)}.sun{fill:#ffd066;filter:drop-shadow(0 0 16px #ffb43f)}.read{position:absolute;inset:50% auto auto 50%;display:grid;min-width:240px;transform:translate(-50%,-50%);text-align:center;gap:4px}.read span{color:#8199bb;font-size:8px}.read strong{font-size:58px;font-weight:400}.read b{color:#f0c66b;font-size:11px}.read small{color:#93a6c2;font-size:8px}footer{display:flex;justify-content:space-between;border-top:1px solid #bdcde63a;padding-top:16px;color:#8298b8;font-size:8px}footer b{color:#d4dfed}
</style>
