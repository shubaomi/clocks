<script>
  import { getZodiacSkyState, zodiacSigns } from "../../lib/time-systems.js";
  let { time, motion = true } = $props();
  const uid = $props.id();
  let state = $derived(getZodiacSkyState(time));
  const centerY = 278;
  const point = (degrees, rx, ry) => {
    const angle = (degrees - 90) * Math.PI / 180;
    return { x: 600 + Math.cos(angle) * rx, y: centerY + Math.sin(angle) * ry };
  };
  const stars = Array.from({ length: 72 }, (_, index) => {
    const angle = index * 2.39996;
    const radius = 85 + 410 * Math.sqrt(index / 72);
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), size: index % 7 === 0 ? 3.5 : 1.8 };
  });
  let sun = $derived(point(state.longitude, 418, 195));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，一日已过 ${Math.round(time.progress.day*100)}%，天穹已旋转 ${Math.round(state.skyRotation)} 度；太阳黄经约 ${Math.round(state.longitude)} 度，位于${state.sign.zh}黄道区段`}>
  <header><div><b>黄道天穹</b><span>ZODIAC SKY · WORLD SKY SERIES</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <svg viewBox="0 0 1200 650" role="img" aria-label="十二黄道区段与太阳位置">
      <defs>
        <radialGradient id={`${uid}-dome`} cx=".35" cy=".28" r=".85"><stop stop-color="#315174"/><stop offset=".65" stop-color="#142b47"/><stop offset="1" stop-color="#081426"/></radialGradient>
      </defs>
      <ellipse cx="600" cy={centerY + 13} rx="530" ry="252" fill="#080f1b" stroke="#6d7e8e" stroke-width="3"/>
      <ellipse cx="600" cy={centerY} rx="530" ry="252" fill={`url(#${uid}-dome)`} stroke="#b0beca" stroke-width="2"/>
      <g transform={`translate(600,${centerY}) scale(1,.46)`}>
        <g class="daily-sky" transform={`rotate(${state.skyRotation})`}>
          <path d="M0 -480V-415 M0 -375V-265" stroke="#a1bcd1" stroke-width="3"/>
          {#if motion}
            {#each stars as star}<circle cx={star.x} cy={star.y} r={star.size} fill="#d2e4f4"/>{/each}
            <path d="M-285 -347 A449 449 0 0 1 -70 -444 M-219 -323 A390 390 0 0 1 -60 -385" class="star-trails"/>
          {/if}
        </g>
      </g>
      <ellipse cx="600" cy={centerY} rx="418" ry="195" class="ecliptic"/>
      {#each zodiacSigns as sign,index}
        {@const inner = point(index * 30, 404, 188)}
        {@const outer = point(index * 30, 511, 242)}
        {@const label = point(index * 30 + 15, 474, 222)}
        <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} class="sector"/>
        <text x={label.x} y={label.y} text-anchor="middle" dominant-baseline="central" class:active={index === state.index}>{sign.symbol}&#xfe0e;</text>
      {/each}
      <g class="solar-marker" transform={`translate(${sun.x} ${sun.y})`}>
        <circle r="17" fill="#13223a" stroke="#d6b46b" stroke-width="2"/>
        <circle r="10" fill="#f9cf76"/><circle cx="-3" cy="-3" r="3" fill="#fff1b6"/>
      </g>
    </svg>
    <div class="read"><span>本地时刻 · LOCAL TIME</span><em>{time.hh}:{time.mm}<small>{time.ss}</small></em><strong>{state.sign.zh}</strong><b>{state.sign.en} · {state.sign.symbol}&#xfe0e;</b><small>日期定位黄道 · 黄经 {state.longitude.toFixed(1)}°</small></div>
    <div class="day-track"><div><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div><i><b style={`width:${time.progress.day*100}%`}></b><em style={`left:${time.progress.day*100}%`}></em></i></div>
  </main>
  <footer><span>日期 → 太阳黄经 {state.longitude.toFixed(1)}°</span><b>时刻 → 天穹日转 {Math.round(state.skyRotation)}° / 360°</b><span>非星座运势</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:760px;overflow:hidden;padding:42px 54px;color:#dce6f2;background:radial-gradient(circle at 50% 40%,#173461,#091326 70%,#070d19);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";background:radial-gradient(circle,#dce8ff 0 1px,transparent 1.5px);background-size:23px 27px;opacity:.18}header,main,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #bdcde63a;padding-bottom:18px}header div{display:flex;align-items:baseline;gap:18px}header b{font-size:38px;font-weight:400;letter-spacing:.16em}header span,time,.read span,.read em,.read b,.read small,.day-track,footer{font-family:monospace;letter-spacing:.08em}header span{font-size:18px;color:#a8b9d2}time{font-size:42px}time small{color:#ffd16a;font-size:18px;vertical-align:top;margin-left:6px}main{position:relative;height:575px}svg{width:100%;height:100%}.sector{stroke:#a0a9ac8c;stroke-width:1.6}.star-trails{fill:none;stroke:#9dbad0;stroke-width:1.8;opacity:.44}.ecliptic{fill:none;stroke:#cdb079;stroke-width:3}svg text{fill:#a9bcda;font:38px "Segoe UI Symbol","DejaVu Sans",serif;font-variant-emoji:text}svg text.active{fill:#ffe1a1;font-size:48px}.read{position:absolute;inset:43% auto auto 50%;display:grid;min-width:330px;transform:translate(-50%,-50%);text-align:center;gap:5px}.read span{color:#b6c5db;font-size:17px}.read>em{color:#f7fbff;font-size:44px;font-style:normal;font-weight:700;letter-spacing:-.04em}.read>em small{margin-left:8px;color:#ffd16a;font-size:19px;vertical-align:top}.read strong{font-size:58px;font-weight:400}.read b{font-family:"Segoe UI Symbol",monospace;font-variant-emoji:text;color:#f0c66b;font-size:18px}.read>small{color:#b7c5d8;font-size:16px}.day-track{position:absolute;right:120px;bottom:4px;left:120px;color:#aebfd7}.day-track div{display:flex;justify-content:space-between;font-size:18px}.day-track>i{position:relative;display:block;height:5px;margin-top:8px;background:#aac0df33}.day-track>i b{display:block;height:100%;background:#ffd16a}.day-track>i em{position:absolute;top:50%;width:15px;height:15px;border:3px solid #ffd16a;border-radius:50%;background:#10213e;box-shadow:0 0 18px #ffd16a99;transform:translate(-50%,-50%)}footer{display:flex;justify-content:space-between;border-top:1px solid #bdcde63a;padding-top:16px;color:#b9c9de;font-size:18px}footer b{color:#f1d078}
  @media(min-width:521px){header span,time small,.read span,.read b,.read>small,.day-track div,footer{font-size:20px}.read>em small{font-size:22px}}
  @media(max-width:520px){header b{font-size:52px}header span{display:none}time{font-size:58px}time small{font-size:44px}main{height:510px}svg text{font-size:50px}svg text.active{font-size:54px}.read{min-width:350px;gap:0}.read span{font-size:29px}.read>em{font-size:50px}.read>em small{font-size:30px}.read strong{font-size:56px}.read b{font-size:30px}.read>small{font-size:30px}.day-track div{font-size:44px}footer{display:block;text-align:center;font-size:44px}footer span{display:none}}
</style>
