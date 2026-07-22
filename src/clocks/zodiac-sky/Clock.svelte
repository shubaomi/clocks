<script>
  import { getZodiacSkyState, zodiacSigns } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getZodiacSkyState(time));
  const point=(angle,radius)=>({x:600+Math.cos(angle*Math.PI/180)*radius,y:355+Math.sin(angle*Math.PI/180)*radius});
  let sun = $derived(point(state.longitude-90,420));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，一日已过 ${Math.round(time.progress.day*100)}%，天穹已旋转 ${Math.round(state.skyRotation)} 度；太阳黄经约 ${Math.round(state.longitude)} 度，位于${state.sign.zh}黄道区段`}>
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
    <div class="read"><span>本地时刻 · LOCAL TIME</span><em>{time.hh}:{time.mm}<small>{time.ss}</small></em><strong>{state.sign.zh}</strong><b>{state.sign.en} · {state.sign.symbol}</b><small>日期定位黄道 · 黄经 {state.longitude.toFixed(1)}°</small></div>
    <div class="day-track"><div><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div><i><b style={`width:${time.progress.day*100}%`}></b><em style={`left:${time.progress.day*100}%`}></em></i></div>
  </main>
  <footer><span>日期 → 太阳黄经 {state.longitude.toFixed(1)}°</span><b>时刻 → 天穹日转 {Math.round(state.skyRotation)}° / 360°</b><span>非星座运势</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:760px;overflow:hidden;padding:42px 54px;color:#dce6f2;background:radial-gradient(circle at 50% 40%,#173461,#091326 70%,#070d19);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";background:radial-gradient(circle,#dce8ff 0 1px,transparent 1.5px);background-size:23px 27px;opacity:.18}header,main,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #bdcde63a;padding-bottom:18px}header div{display:flex;align-items:baseline;gap:18px}header b{font-size:38px;font-weight:400;letter-spacing:.16em}header span,time,.read span,.read em,.read b,.read small,.day-track,footer{font-family:monospace;letter-spacing:.08em}header span{font-size:18px;color:#a8b9d2}time{font-size:42px}time small{color:#ffd16a;font-size:18px;vertical-align:top;margin-left:6px}main{position:relative;height:575px}svg{width:100%;height:100%}.sector{stroke:#8098be29}.ecliptic{fill:none;stroke:#d7bd8055;stroke-width:3;stroke-dasharray:8 8}svg text{fill:#a9bcda;font:38px serif}svg text.active{fill:#ffd16a;font-size:58px;filter:drop-shadow(0 0 12px #ffc45a)}.sun{fill:#ffd066;filter:drop-shadow(0 0 16px #ffb43f)}.read{position:absolute;inset:48% auto auto 50%;display:grid;min-width:330px;transform:translate(-50%,-50%);text-align:center;gap:5px}.read span{color:#b6c5db;font-size:17px}.read>em{color:#f7fbff;font-size:44px;font-style:normal;font-weight:700;letter-spacing:-.04em}.read>em small{margin-left:8px;color:#ffd16a;font-size:19px;vertical-align:top}.read strong{font-size:58px;font-weight:400}.read b{color:#f0c66b;font-size:18px}.read>small{color:#b7c5d8;font-size:16px}.day-track{position:absolute;right:120px;bottom:4px;left:120px;color:#9fb0c9}.day-track div{display:flex;justify-content:space-between;font-size:15px}.day-track>i{position:relative;display:block;height:5px;margin-top:8px;background:#aac0df33}.day-track>i b{display:block;height:100%;background:#ffd16a}.day-track>i em{position:absolute;top:50%;width:15px;height:15px;border:3px solid #ffd16a;border-radius:50%;background:#10213e;box-shadow:0 0 18px #ffd16a99;transform:translate(-50%,-50%)}footer{display:flex;justify-content:space-between;border-top:1px solid #bdcde63a;padding-top:16px;color:#aabbd2;font-size:15px}footer b{color:#f1d078}
  @media(max-width:520px){header b{font-size:52px}header span{display:none}time{font-size:58px}time small{font-size:44px}main{height:550px}svg text{font-size:50px}svg text.active{font-size:70px}.read{min-width:430px}.read span{font-size:38px}.read>em{font-size:64px}.read>em small{font-size:38px}.read strong{font-size:78px}.read b{font-size:38px}.read>small{font-size:40px}.day-track div{font-size:42px}footer{display:block;text-align:center;font-size:44px}footer span{display:none}}
</style>
