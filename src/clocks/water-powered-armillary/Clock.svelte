<script>
  import { getArmillaryState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getArmillaryState(time));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，水运仪象台步进机构运行中`}>
  <header><div><b>水运仪象台</b><span>WATER-POWERED ASTRONOMICAL CLOCK</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <section class="sky"><div class="sphere" style={`transform:rotate(${state.sphereRotation}deg)`}><i></i><i></i><i></i><b>天</b></div><span>上观天 · OBSERVE</span></section>
    <section class="machine">
      <div class="gear g1" style={`transform:rotate(${time.minute*6 + time.progress.minute*6}deg)`}>{#each Array(12) as _}<i></i>{/each}</div>
      <div class="gear g2" style={`transform:rotate(${-time.second*12}deg)`}>{#each Array(8) as _}<i></i>{/each}</div>
      <div class="chain"><i style={`top:${time.progress.minute*100}%`}></i></div>
      <span>中示象 · MODEL</span>
    </section>
    <section class="tower">
      <div class="figures">{#each ["刻","时","更"] as name,index}<div class:active={index===0?state.quarterActive:index===1?state.hourActive:false}><b>{name}</b><i></i></div>{/each}</div>
      <div class="water"><i></i><i></i><i></i></div><span>下报时 · KEEP TIME</span>
    </section>
  </main>
  <div class="status" aria-label="秒驱动步进，分钟转动天球，每刻与整点启动木人，声音默认关闭"><span>秒驱动步进 {String(state.escapement).padStart(2,"0")}</span><i></i><b>分转天球 · {state.hourActive?"整点报时":state.quarterActive?"一刻报时":"水力运行"}</b><i></i><span>刻时启木人 · 无声</span></div>
  <footer><span>结构意译 · 非复原图</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>水力使天与时同转</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:820px;overflow:hidden;padding:44px 54px;color:#ded7bb;background:radial-gradient(circle at 25% 25%,#506b6044,transparent 35%),linear-gradient(145deg,#273b34,#182a25 66%,#111d1a);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.12;background:repeating-linear-gradient(90deg,transparent 0 31px,#d8c99b22 32px),repeating-linear-gradient(0deg,transparent 0 31px,#d8c99b22 32px)}header,main,.status,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #dfd0a63b;padding-bottom:18px}header div{display:flex;align-items:baseline;gap:20px}header b{font-size:34px;font-weight:400;letter-spacing:.15em}header span,time,main section>span,.status,footer{font-family:monospace;letter-spacing:.11em}header span{font-size:9px;color:#91a097}time{font-size:30px}time small{color:#efbd5b;font-size:10px;vertical-align:top;margin-left:6px}main{display:grid;height:580px;margin-top:25px;grid-template-columns:1fr 1fr 1fr;gap:34px}main section{position:relative;display:grid;place-items:center;border:1px solid #c9b67c2e;background:#0e171533}main section>span{position:absolute;bottom:18px;color:#8b9b92;font-size:8px}.sphere{position:relative;width:250px;height:250px;border:4px solid #ad9a65;border-radius:50%;box-shadow:0 0 0 28px #ad9a6514,0 0 50px #0006}.sphere i{position:absolute;inset:28px;border:2px solid #a99562;border-radius:50%;transform:rotate(60deg)}.sphere i:nth-child(2){transform:rotate(-60deg)}.sphere i:nth-child(3){inset:70px}.sphere b{position:absolute;inset:50% auto auto 50%;font-size:48px;font-weight:400;transform:translate(-50%,-50%)}
  .machine{overflow:hidden}.gear{position:absolute;border:12px dashed #a88d56;border-radius:50%;box-shadow:0 0 0 2px #a88d56}.g1{top:85px;left:55px;width:190px;height:190px}.g2{right:45px;bottom:110px;width:140px;height:140px}.gear:after{position:absolute;inset:35%;border:5px solid #a88d56;border-radius:50%;content:""}.chain{position:absolute;top:70px;bottom:70px;left:50%;width:3px;background:#b59b6055}.chain i{position:absolute;left:-7px;width:17px;height:17px;border:2px solid #e1bb59;border-radius:50%;background:#293c35;box-shadow:0 0 14px #e3b956}.figures{display:flex;gap:25px}.figures div{display:grid;justify-items:center;gap:10px;color:#c9bb8c;opacity:.68}.figures div.active{opacity:1;color:#efc564;filter:drop-shadow(0 0 10px #e5bb5c)}.figures b{display:grid;width:55px;height:75px;place-items:center;border:1px solid currentColor;font-size:26px;font-weight:400}.figures i{width:26px;height:80px;background:linear-gradient(#b9a369,#6b5a3e);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%)}.water{position:absolute;right:50px;bottom:70px;left:50px;display:flex;justify-content:space-around}.water i{width:8px;height:26px;border-radius:50%;background:#76b8b0;box-shadow:0 0 8px #76b8b066;animation:drop 1.2s linear infinite}.water i:nth-child(2){animation-delay:-.4s}.water i:nth-child(3){animation-delay:-.8s}.status{display:flex;align-items:center;justify-content:center;gap:15px;color:#b7c3bc;font-size:8px}.status i{width:45px;height:1px;background:#b9a56c66}.status b{color:#efca72;font-weight:400}footer{position:absolute;right:54px;bottom:34px;left:54px;display:flex;justify-content:space-between;border-top:1px solid #dfd0a63b;padding-top:17px;color:#899a91;font-size:8px}footer b{color:#d6ceb4}@keyframes drop{from{transform:translateY(-25px);opacity:0}to{transform:translateY(28px);opacity:1}}@media(prefers-reduced-motion:reduce){.water i{animation:none}}
  header span{font-size:20px}time{font-size:42px}time small{font-size:20px}main section>span{font-size:20px}.status{font-size:20px}footer{font-size:20px}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:44px}main{height:540px}main section>span{font-size:44px}.figures b{font-size:44px}.status{display:grid;margin-top:10px;grid-template-columns:repeat(3,1fr);gap:8px;font-size:30px;line-height:1.2;text-align:center}.status i{display:none}footer{display:none}}
</style>
