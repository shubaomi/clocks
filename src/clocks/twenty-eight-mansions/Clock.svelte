<script>
  import { fourSymbols, getMansionState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getMansionState(time));
  let manualOffset = $state(0);
  let rotation = $derived(state.rotation + manualOffset);
  const symbolAngles = [0, -90, 180, 90];
  const mansions = fourSymbols.flatMap((symbol, group) => symbol.mansions.map((name, within) => ({name, group, color:symbol.color, angle:(group*7+within)*360/28-90})));
  const point = (angle, radius) => ({x:500+Math.cos(angle*Math.PI/180)*radius,y:500+Math.sin(angle*Math.PI/180)*radius});
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，一日已过 ${Math.round(time.progress.day*100)}%，四象二十八宿天盘已随本地时间旋转 ${Math.round(state.rotation)} 度`}>
  <header><div><b>四象二十八宿</b><span>FOUR SYMBOLS · TWENTY-EIGHT MANSIONS</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <svg viewBox="0 0 1000 1000" role="img" aria-label="四象二十八宿旋转星图">
      <circle cx="500" cy="500" r="420" class="orbit"/><circle cx="500" cy="500" r="325" class="orbit faint"/><circle cx="500" cy="500" r="160" class="orbit faint"/>
      <g style={`transform:rotate(${rotation}deg);transform-origin:500px 500px`}>
        {#each mansions as mansion,index}
          {@const p=point(mansion.angle,370)}
          <line x1="500" y1="500" x2={p.x} y2={p.y} class="ray"/>
          <circle cx={p.x} cy={p.y} r={index%7===0?8:4} fill={mansion.color}/>
          <text x={p.x} y={p.y-15} text-anchor="middle" fill={mansion.color} style={`transform:rotate(${-rotation}deg);transform-origin:${p.x}px ${p.y}px`}>{mansion.name}</text>
        {/each}
      </g>
      <g class="symbols">
        {#each fourSymbols as symbol,index}
          {@const p=point(symbolAngles[index],280)}
          <text x={p.x} y={p.y} text-anchor="middle" fill={symbol.color}>{symbol.zh}</text>
        {/each}
      </g>
      <circle cx="500" cy="500" r="64" class="moon"/>
      <circle cx={500+(state.moonPhase-.5)*100} cy="500" r="64" class="moon-mask"/>
    </svg>
    <div class="center"><span>本地时刻 · LOCAL TIME</span><strong>{time.hh}:{time.mm}</strong><b>{time.ss} 秒 · 天盘 {Math.round(state.rotation)}°</b><small>月相近似 {Math.round(state.moonPhase*100)}%</small></div>
  </main>
  <section class="day-motion" aria-label={`一天进度 ${Math.round(time.progress.day*100)}%`}>
    <div><span>00 子夜</span><span>06</span><span>12 正午</span><span>18</span><span>24</span></div>
    <i><b style={`width:${time.progress.day*100}%`}></b><em style={`left:${time.progress.day*100}%`}></em></i>
    <p>本地时刻推动天盘一日旋转 360° · DAY ROTATION</p>
  </section>
  <nav class="turn-controls" aria-label="旋转星图"><button type="button" onclick={() => manualOffset -= 15} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); manualOffset -= 15; } }} aria-label="星图向左旋转十五度">←</button><span>旋转星图 · ROTATE</span><button type="button" onclick={() => manualOffset += 15} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); manualOffset += 15; } }} aria-label="星图向右旋转十五度">→</button></nav>
  <section class="legend">{#each fourSymbols as symbol}<span style={`color:${symbol.color}`}><i></i>{symbol.direction} · {symbol.zh}</span>{/each}</section>
  <footer><span>星盘随一日旋转</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>不宣称精确当前宿位</span></footer>
</div>

<style>
  .clock{position:relative;width:1000px;height:1000px;overflow:hidden;padding:48px;color:#dce4dc;background:radial-gradient(circle at 50% 50%,#183c49,#10252f 58%,#09151c);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";background:radial-gradient(circle,#e8ecde 0 1px,transparent 1.4px);background-size:29px 31px;opacity:.18}header,main,.day-motion,.legend,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #d7dfd52d;padding-bottom:20px}header div{display:grid;gap:5px}header b{font-size:36px;font-weight:400;letter-spacing:.15em}header span,time,.center span,.center b,.center small,.day-motion,.legend,footer{font-family:monospace;letter-spacing:.08em}header span{color:#b9cdcd;font-size:17px}time{font-size:42px}time small{color:#ffad8c;font-size:18px;vertical-align:top;margin-left:5px}main{position:relative;width:760px;height:610px;margin:2px auto}svg{width:100%;height:100%;overflow:visible}.orbit{fill:none;stroke:#bed0c944;stroke-width:2}.faint{stroke:#bed0c91d}.ray{stroke:#8aa1a222;stroke-width:1}text{font:30px "Songti SC","STSong",serif}.symbols text{font-size:46px;font-weight:600;opacity:1;paint-order:stroke;stroke:#102b35;stroke-width:4px}.moon{fill:#e6dfc2;filter:drop-shadow(0 0 20px #eee6b866)}.moon-mask{fill:#173641}.center{position:absolute;z-index:2;top:50%;left:50%;display:grid;width:250px;padding:18px 20px;border-radius:50%;background:radial-gradient(circle,#102a34f5 0 66%,#102a34d9 72%,transparent 76%);transform:translate(-50%,-50%);text-align:center;gap:7px}.center strong{font:700 44px monospace;letter-spacing:-.04em;text-shadow:0 2px 12px #061116}.center span{font-size:16px;color:#c6d8d6}.center b{font-size:17px;color:#ffe79a}.center small{font-size:15px;color:#c4d4d2}.day-motion{margin:0 78px 9px;color:#b9caca}.day-motion div{display:flex;justify-content:space-between;font-size:19px}.day-motion>i{position:relative;display:block;height:5px;margin-top:8px;background:#bcd0cc3d}.day-motion>i b{display:block;height:100%;background:#f1d675}.day-motion>i em{position:absolute;top:50%;width:15px;height:15px;border:3px solid #ffe58b;border-radius:50%;background:#173641;box-shadow:0 0 18px #f0d47488;transform:translate(-50%,-50%)}.day-motion p{margin:9px 0 0;text-align:center;font-size:19px}.legend{display:flex;justify-content:center;gap:27px;font-size:18px}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:7px;height:7px;border-radius:50%;background:currentColor}footer{position:absolute;right:48px;bottom:35px;left:48px;display:flex;justify-content:space-between;border-top:1px solid #d7dfd52d;padding-top:18px;color:#b7c6c5;font-size:17px}footer b{color:#e1e8df}
  .turn-controls{position:relative;z-index:2;display:flex;justify-content:center;align-items:center;gap:16px;color:#b9c8c7;font:19px monospace;letter-spacing:.1em}.turn-controls button{display:grid;width:42px;height:34px;place-items:center;border:1px solid #b8c9c77a;color:#eef4ea;background:#10242a;cursor:pointer;font-size:20px}.turn-controls button:focus-visible{outline:2px solid #e3c66f;outline-offset:2px}.legend{margin-top:10px}.center span,.center b,.center small{font-size:19px}header span,footer{font-size:19px}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:40px}text{font-size:39px}.symbols text{font-size:58px}.center{width:250px;padding:14px}.center strong{font-size:60px}.center span{font-size:34px}.center b{font-size:32px;letter-spacing:0}.center small{font-size:34px}.day-motion div,.day-motion p{font-size:38px}.turn-controls,.legend{display:none}footer{font-size:34px}}
</style>
