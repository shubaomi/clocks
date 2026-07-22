<script>
  import { fourSymbols, getMansionState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getMansionState(time));
  let manualOffset = $state(0);
  let rotation = $derived(state.rotation + manualOffset);
  const mansions = fourSymbols.flatMap((symbol, group) => symbol.mansions.map((name, within) => ({name, group, color:symbol.color, angle:(group*7+within)*360/28-90})));
  const point = (angle, radius) => ({x:500+Math.cos(angle*Math.PI/180)*radius,y:500+Math.sin(angle*Math.PI/180)*radius});
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，四象二十八宿天盘随本地时间旋转`}>
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
          {@const p=point(index*90-45,245)}
          <text x={p.x} y={p.y} text-anchor="middle" fill={symbol.color}>{symbol.zh}</text>
        {/each}
      </g>
      <circle cx="500" cy="500" r="64" class="moon"/>
      <circle cx={500+(state.moonPhase-.5)*100} cy="500" r="64" class="moon-mask"/>
    </svg>
    <div class="center"><strong>月行宿次</strong><span>APPROX. MOON PHASE</span><b>{Math.round(state.moonPhase*100)}%</b></div>
  </main>
  <nav class="turn-controls" aria-label="旋转星图"><button type="button" onclick={() => manualOffset -= 15} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); manualOffset -= 15; } }} aria-label="星图向左旋转十五度">←</button><span>旋转星图 · ROTATE</span><button type="button" onclick={() => manualOffset += 15} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); manualOffset += 15; } }} aria-label="星图向右旋转十五度">→</button></nav>
  <section class="legend">{#each fourSymbols as symbol}<span style={`color:${symbol.color}`}><i></i>{symbol.direction} · {symbol.zh}</span>{/each}</section>
  <footer><span>星盘随一日旋转</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>不宣称精确当前宿位</span></footer>
</div>

<style>
  .clock{position:relative;width:1000px;height:1000px;overflow:hidden;padding:48px;color:#dce4dc;background:radial-gradient(circle at 50% 50%,#183c49,#10252f 58%,#09151c);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";background:radial-gradient(circle,#e8ecde 0 1px,transparent 1.4px);background-size:29px 31px;opacity:.18}header,main,.legend,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #d7dfd52d;padding-bottom:20px}header div{display:grid;gap:5px}header b{font-size:32px;font-weight:400;letter-spacing:.15em}header span,time,.center span,.center b,.legend,footer{font-family:monospace;letter-spacing:.1em}header span{color:#91a6a8;font-size:9px}time{font-size:29px}time small{color:#e48768;font-size:10px;vertical-align:top;margin-left:5px}main{position:relative;width:760px;height:760px;margin:2px auto}svg{width:100%;height:100%;overflow:visible}.orbit{fill:none;stroke:#bed0c944;stroke-width:2}.faint{stroke:#bed0c91d}.ray{stroke:#8aa1a222;stroke-width:1}text{font:24px "Songti SC","STSong",serif}.symbols text{font-size:42px;opacity:.72}.moon{fill:#e6dfc2;filter:drop-shadow(0 0 20px #eee6b866)}.moon-mask{fill:#173641}.center{position:absolute;inset:50%;display:grid;width:170px;transform:translate(-50%,-50%);text-align:center;gap:5px}.center strong{font-size:22px}.center span{font-size:7px;color:#90a5a5}.center b{font-size:10px;color:#dfc98c}.legend{display:flex;justify-content:center;gap:27px;font-size:8px}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:5px;height:5px;border-radius:50%;background:currentColor}footer{position:absolute;right:48px;bottom:35px;left:48px;display:flex;justify-content:space-between;border-top:1px solid #d7dfd52d;padding-top:18px;color:#81989b;font-size:8px}footer b{color:#d0d8cf}
  main{height:700px}.turn-controls{position:relative;z-index:2;display:flex;justify-content:center;align-items:center;gap:12px;color:#81989b;font:7px monospace;letter-spacing:.1em}.turn-controls button{display:grid;width:30px;height:26px;place-items:center;border:1px solid #b8c9c74f;color:#d6dfd6;background:#10242a;cursor:pointer}.turn-controls button:focus-visible{outline:2px solid #e3c66f;outline-offset:2px}.legend{margin-top:10px}
</style>
