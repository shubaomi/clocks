<script>
  import { getSundialState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getSundialState(time));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，数字日晷影向 ${Math.round(state.shadowAngle)} 度`}>
  <header><div><b>圭表日晷</b><span>GNOMON & SUNDIAL</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <section class="dial">
      <div class="ring">
        {#each Array(24) as _, index}<i style={`transform:rotate(${index*15}deg)`}><span>{index%3===0?String(index).padStart(2,"0"):""}</span></i>{/each}
        <div class="shadow" style={`transform:rotate(${state.shadowAngle}deg) scaleY(${state.shadowLength})`}></div>
        <div class="gnomon"></div>
      </div>
      <h2>影向见时</h2><p>DIRECTION OF SHADOW · LOCAL CIVIL TIME</p>
    </section>
    <section class="season">
      <div class="pillar"><i style={`height:${state.shadowLength*65}%`}></i><b>表</b></div>
      <div class="yearline"><i style={`left:${state.seasonProgress*100}%`}></i></div>
      <h2>影长见季</h2><p>SHADOW LENGTH · DIGITAL RECONSTRUCTION</p>
      <div class="seasons"><span>冬至</span><span>春分</span><span>夏至</span><span>秋分</span><span>冬至</span></div>
    </section>
  </main>
  <footer><span>无定位 · 不声称真太阳时</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>日影数字重构</span></footer>
</div>

<style>
  .clock{position:relative;width:1100px;height:760px;overflow:hidden;padding:46px 54px;color:#3a271d;background:radial-gradient(circle at 72% 20%,#fff1b5,#e8c789 32%,transparent 58%),linear-gradient(145deg,#d49a58,#a96339 70%,#75432d);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.22;background:repeating-linear-gradient(0deg,transparent 0 18px,#5e34231d 19px)}header,main,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #4d2d2044;padding-bottom:19px}header div{display:flex;align-items:baseline;gap:18px}header b{font-size:34px;font-weight:500;letter-spacing:.16em}header span,time,p,footer{font-family:monospace;letter-spacing:.12em}header span{font-size:10px;color:#6d4732}time{font-size:31px}time small{font-size:10px;color:#9b3027;vertical-align:top;margin-left:6px}
  main{display:grid;height:555px;grid-template-columns:1.15fr .85fr;gap:64px;align-items:center}.dial,.season{text-align:center}.ring{position:relative;width:390px;height:390px;margin:auto;border:2px solid #5d3928;border-radius:50%;box-shadow:inset 0 0 50px #7b45252e,0 20px 45px #5c342333;background:#dab57955}.ring>i{position:absolute;inset:11px;display:block;border-top:11px solid #5c3929;transform-origin:center}.ring>i span{position:absolute;top:9px;left:50%;font:9px monospace;transform:translateX(-50%)}.gnomon{position:absolute;top:50%;left:50%;width:18px;height:18px;border-radius:50%;background:#542d20;box-shadow:0 3px 6px #0007;transform:translate(-50%,-50%)}.shadow{position:absolute;top:50%;left:calc(50% - 5px);width:10px;height:174px;background:linear-gradient(#44281dcc,transparent);transform-origin:50% 0;filter:blur(2px)}h2{margin:18px 0 3px;font-size:26px;font-weight:500;letter-spacing:.12em}p{margin:0;color:#704b37;font-size:8px}
  .pillar{position:relative;width:140px;height:310px;margin:0 auto;border-bottom:5px solid #563526}.pillar:before{position:absolute;bottom:0;left:64px;width:12px;height:260px;background:#583624;box-shadow:4px 7px 12px #41201466;content:""}.pillar i{position:absolute;right:74px;bottom:0;width:130px;background:linear-gradient(90deg,transparent,#49291e88);clip-path:polygon(100% 0,100% 100%,0 100%)}.pillar b{position:absolute;z-index:2;bottom:150px;left:69px;color:#e5bd75;font-size:19px}.yearline{position:relative;height:2px;margin:24px 20px;background:#56352566}.yearline i{position:absolute;top:-6px;width:12px;height:12px;border:2px solid #f4d284;border-radius:50%;background:#9d3f2c;transform:translateX(-50%)}.seasons{display:flex;justify-content:space-between;margin-top:12px;color:#704731;font-size:9px}
  footer{display:flex;justify-content:space-between;border-top:1px solid #4d2d2044;padding-top:20px;color:#724a35;font-size:8px}footer b{color:#3d281e;font-weight:600}
  header span{font-size:18px}time{font-size:42px}time small{font-size:18px}.ring>i span{font-size:16px}p{font-size:17px}.seasons{font-size:16px}footer{font-size:15px}
  @media(max-width:520px){header b{font-size:52px}header span{display:none}time{font-size:58px}time small{font-size:44px}.ring>i span{font-size:36px}.pillar b{font-size:40px}h2{font-size:40px}p{font-size:36px}.seasons{font-size:34px}footer{font-size:34px}}
</style>
