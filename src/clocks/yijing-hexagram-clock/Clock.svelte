<script>
  import { getHexagramState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getHexagramState(time));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，一日六十四卦行至第${state.number}象${state.name}`}>
  <header><div><b>易时</b><span>SIXTY-FOUR CHANGES</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <div class="grid">
    {#each Array(64) as _, index}<i class:past={index < state.index} class:now={index === state.index}></i>{/each}
  </div>
  <main>
    <div class="number">{String(state.number).padStart(2,"0")}<small>/ 64</small></div>
    <div class="lines">
      {#each [...state.lines].reverse() as yang, index}
        <div class:yang><span></span><span></span><em>{6-index}</em></div>
      {/each}
    </div>
    <div class="name"><strong>{state.name}</strong><span>{state.upper.zh}{state.lower.zh} · {state.upper.en} OVER {state.lower.en}</span></div>
  </main>
  <section class="progress"><div style={`width:${state.progress*100}%`}></div><span>本卦已行 {Math.round(state.progress*100)}%</span></section>
  <footer><span>一日六十四变</span><b>每卦 22′30″</b><span>时间编码 · 非占卜</span></footer>
</div>

<style>
  .clock{position:relative;width:760px;height:1080px;overflow:hidden;padding:52px;color:#e9e2d2;background:linear-gradient(145deg,#332f2a,#181817 68%,#2b2724);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.12;background:repeating-linear-gradient(90deg,transparent 0 23px,#e9dfca22 24px),repeating-linear-gradient(0deg,transparent 0 23px,#e9dfca22 24px)}header,.grid,main,.progress,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #eee2c43d;padding-bottom:24px}header div{display:grid;gap:6px}header b{font-size:38px;font-weight:400;letter-spacing:.2em}header span,time,.number,.name span,.progress,footer{font-family:monospace;letter-spacing:.12em}header span{font-size:10px;color:#aaa195}time{font-size:29px}time small{margin-left:6px;color:#c3513d;font-size:10px;vertical-align:top}.grid{display:grid;margin-top:32px;grid-template-columns:repeat(16,1fr);gap:5px}.grid i{height:5px;background:#e5dac61a}.grid i.past{background:#a55b47}.grid i.now{background:#f2d88d;box-shadow:0 0 12px #e8c66f}
  main{display:grid;margin-top:74px;justify-items:center}.number{position:absolute;top:-24px;left:0;color:#999185;font-size:20px}.number small{font-size:9px}.lines{display:grid;width:430px;gap:23px}.lines div{position:relative;display:flex;gap:48px}.lines span{height:28px;flex:1;background:#e9e2d2}.lines .yang{gap:0}.lines em{position:absolute;right:-48px;top:5px;color:#777168;font:10px monospace;font-style:normal}.name{display:grid;margin-top:55px;text-align:center;gap:8px}.name strong{font-size:82px;font-weight:400}.name span{color:#aaa196;font-size:10px}.progress{position:absolute;right:52px;bottom:116px;left:52px;height:2px;background:#e8dfce25}.progress div{height:100%;background:#bd4a36}.progress span{position:absolute;right:0;top:12px;color:#999084;font-size:9px}footer{position:absolute;right:52px;bottom:46px;left:52px;display:flex;justify-content:space-between;color:#999185;font-size:9px}footer b{color:#d6cbb8;font-weight:400}
  header span{font-size:21px}time{font-size:42px}time small{font-size:21px}.number{font-size:30px}.number small{font-size:21px}.lines em{font-size:21px}.name span{font-size:21px}.progress span{font-size:21px}footer{font-size:21px}
  @media(max-width:520px){header b{font-size:52px}header span{display:none}time{font-size:58px}time small{font-size:36px}.number{font-size:38px}.number small{font-size:30px}.lines em{font-size:30px}.name span{font-size:30px}.progress span{font-size:30px}footer{display:none}}
</style>
