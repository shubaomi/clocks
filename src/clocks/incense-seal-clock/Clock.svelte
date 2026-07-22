<script>
  import { getIncenseState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getIncenseState(time));
  let offset = $derived(100 - state.ember);
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，香篆已燃 ${Math.round(state.progress*100)}%`}>
  <header><div><b>香篆流时</b><span>INCENSE SEAL CLOCK</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <svg viewBox="0 0 600 600" role="img" aria-label="由灰烬、余火和未燃香粉组成的香篆路径">
      <path class="tray" d="M80 70h440v460H80z"/>
      <path class="incense" pathLength="100" d="M130 130h340v70H190v70h280v70H130v70h340v70H130"/>
      <path class="ash" pathLength="100" style={`stroke-dasharray:${state.ember} 100`} d="M130 130h340v70H190v70h280v70H130v70h340v70H130"/>
      <path class="ember" pathLength="100" style={`stroke-dashoffset:${offset}`} d="M130 130h340v70H190v70h280v70H130v70h340v70H130"/>
    </svg>
    <div class="smoke" style={`left:${18 + (state.segment%20)*3.3}%;top:${20+Math.floor(state.segment/20)*11}%`}><i></i><i></i><i></i><b class="spark" style={`transform:translate(${time.second%5*2}px,${-time.progress.second*14}px);opacity:${1-time.progress.second}`}></b></div>
    <div class="reading"><strong>{Math.round(state.progress*100)}%</strong><span>香路已行 · PATH BURNED</span></div>
  </main>
  <section class="legend"><span><i class="past"></i>灰 · PAST</span><span><i class="now"></i>烬 · NOW</span><span><i class="next"></i>香 · NEXT</span></section>
  <footer><span>午夜铺香</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>一日一篆</span></footer>
</div>

<style>
  .clock{position:relative;width:960px;height:960px;overflow:hidden;padding:50px;color:#4a2c25;background:radial-gradient(circle at 65% 30%,#ecd6bd,#ceb096 65%,#a97a63);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.18;background:radial-gradient(circle,#53372a 0 1px,transparent 1.6px);background-size:18px 17px}header,main,.legend,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #5e392b55;padding-bottom:21px}header div{display:grid;gap:5px}header b{font-size:36px;font-weight:500;letter-spacing:.16em}header span,time,.legend,footer,.reading span{font-family:monospace;letter-spacing:.12em}header span{font-size:10px;color:#79584b}time{font-size:31px}time small{color:#a92f27;font-size:10px;vertical-align:top;margin-left:6px}main{position:relative;width:680px;height:680px;margin:20px auto 0}svg{width:100%;height:100%;filter:drop-shadow(0 22px 24px #57342533)}path{fill:none;stroke-linecap:round;stroke-linejoin:round}.tray{fill:#d7bca3aa;stroke:#76503d;stroke-width:4}.incense{stroke:#66392c;stroke-width:25}.ash{stroke:#a9a094;stroke-width:27}.ember{stroke:#d9462e;stroke-width:36;stroke-dasharray:1 99;filter:drop-shadow(0 0 12px #ef4c31)}.reading{position:absolute;right:70px;bottom:66px;display:grid;text-align:right}.reading strong{font:700 38px monospace}.reading span{font-size:8px}.smoke{position:absolute}.smoke i{position:absolute;width:18px;height:70px;border-left:3px solid #f2e5db88;border-radius:50%;animation:smoke 4s ease-in-out infinite}.smoke i:nth-child(2){animation-delay:-1.3s;transform:translateX(12px)}.smoke i:nth-child(3){animation-delay:-2.4s;transform:translateX(-10px)}
  .spark{position:absolute;width:5px;height:5px;border-radius:50%;background:#e64d31;box-shadow:0 0 9px #ff6a42}.legend{display:flex;justify-content:center;gap:44px;color:#6f4d40;font-size:9px}.legend span{display:flex;align-items:center;gap:8px}.legend i{width:20px;height:4px;background:#aaa}.legend .past{background:#a9a094}.legend .now{background:#d9462e;box-shadow:0 0 8px #d9462e}.legend .next{background:#66392c}footer{position:absolute;right:50px;bottom:40px;left:50px;display:flex;justify-content:space-between;border-top:1px solid #5e392b55;padding-top:19px;color:#79584b;font-size:8px}footer b{color:#4d3027}@keyframes smoke{0%{opacity:0;transform:translateY(0) scale(.7)}35%{opacity:.7}100%{opacity:0;transform:translate(14px,-90px) scale(1.3)}}@media(prefers-reduced-motion:reduce){.smoke i{animation:none}}
  header span{font-size:18px}time{font-size:42px}time small{font-size:18px}.reading span{font-size:16px}.legend{font-size:17px}footer{font-size:16px}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:40px}.reading strong{font-size:58px}.reading span{font-size:34px}.legend{font-size:36px}footer{display:none}}
</style>
