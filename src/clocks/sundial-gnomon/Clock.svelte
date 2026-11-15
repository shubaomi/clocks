<script>
  import { getSundialState } from "../../lib/time-systems.js";
  let { time, motion = true } = $props();
  let state = $derived(getSundialState(time));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，数字日晷影向 ${Math.round(state.shadowAngle)} 度`}>
  <header><div><b>圭表日晷</b><span>GNOMON & SUNDIAL</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <section class="dial">
      <div class="ring" class:relief={motion} style:--sun={state.shadowAngle + 90 + "deg"}>
        {#each Array(24) as _, index}<i class:current={index === time.hour} style={`transform:rotate(${index*15}deg)`}><span style={`transform:translateX(-50%) rotate(${-index*15}deg)`}>{index%3===0?String(index).padStart(2,"0"):""}</span></i>{/each}
        <div class="shadow" style={`transform:rotate(${state.shadowAngle}deg) scaleY(${state.shadowLength})`}></div>
        <div class="gnomon" aria-hidden="true"><i></i></div>
      </div>
      <h2>影向见时</h2><p>DIRECTION OF SHADOW · LOCAL CIVIL TIME</p><p class="dial-note">00 上 · 06 右 · 12 下 · 18 左</p>
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
  main{display:grid;height:555px;grid-template-columns:1.15fr .85fr;gap:64px;align-items:center}.dial,.season{text-align:center}.ring{position:relative;width:390px;height:390px;margin:auto;overflow:hidden;border:2px solid #5d3928;border-radius:50%;box-shadow:inset 0 0 50px #7b45252e,0 20px 45px #5c342333;background:#dab57955}.ring:before{position:absolute;inset:28px;border:1px solid #5d392844;border-radius:50%;content:""}.ring>i{position:absolute;z-index:2;inset:11px;display:block;transform-origin:center}.ring>i:before{position:absolute;top:0;left:50%;width:2px;height:12px;background:#5c3929;content:"";transform:translateX(-50%)}.ring>i:nth-child(3n+1):before{width:3px;height:22px}.ring>i.current:before{width:4px;height:27px;background:#a13a2d;box-shadow:0 0 10px #a13a2d88}.ring>i span{position:absolute;top:27px;left:50%;font:18px monospace}.gnomon{position:absolute;z-index:3;top:50%;left:50%;width:18px;height:18px;border-radius:50%;background:#542d20;box-shadow:0 3px 6px #0007;transform:translate(-50%,-50%)}.shadow{position:absolute;z-index:1;top:50%;left:calc(50% - 5px);width:10px;height:174px;background:linear-gradient(#44281dcc,transparent);transform-origin:50% 0;filter:blur(2px)}h2{margin:18px 0 3px;font-size:26px;font-weight:600;letter-spacing:.12em}p{margin:0;color:#56382a;font-size:8px}.dial-note{margin-top:10px;color:#4d3024;font-size:17px;letter-spacing:.08em}
  .pillar{position:relative;width:140px;height:310px;margin:0 auto;border-bottom:5px solid #563526}.pillar:before{position:absolute;bottom:0;left:64px;width:12px;height:260px;background:#583624;box-shadow:4px 7px 12px #41201466;content:""}.pillar i{position:absolute;right:74px;bottom:0;width:130px;background:linear-gradient(90deg,transparent,#49291e88);clip-path:polygon(100% 0,100% 100%,0 100%)}.pillar b{position:absolute;z-index:2;bottom:144px;left:70px;padding:3px 5px;border:1px solid #f0cf88;color:#fff1c7;background:#633726;box-shadow:0 3px 10px #3f201e66;font-size:19px;line-height:1;transform:translateX(-50%)}.yearline{position:relative;height:2px;margin:24px 20px;background:#56352566}.yearline i{position:absolute;top:-6px;width:12px;height:12px;border:2px solid #f4d284;border-radius:50%;background:#9d3f2c;transform:translateX(-50%)}.seasons{display:flex;justify-content:space-between;margin-top:12px;color:#56382a;font-size:9px}
  footer{display:flex;justify-content:space-between;border-top:1px solid #4d2d2044;padding-top:20px;color:#724a35;font-size:8px}footer b{color:#3d281e;font-weight:600}
  header span{font-size:19px}time{font-size:42px}time small{font-size:19px}.ring>i span{font-size:18px}p{font-size:18px}.seasons{font-size:18px}footer{font-size:18px}
  @media(max-width:520px){header b{font-size:52px}header span{display:none}time{font-size:58px}time small{font-size:44px}.ring>i span{font-size:38px}.pillar b{font-size:42px}h2{font-size:42px}p{font-size:38px}.dial-note{font-size:32px}.seasons{font-size:40px}footer{display:none}}
  .ring{isolation:isolate;background:radial-gradient(ellipse at 35% 20%,#e9c688,#c79b62 78%,#a37249);border:4px solid #815e3f}
  .ring.relief{overflow:visible;transform:perspective(820px) rotateX(26deg);box-shadow:0 2px 0 #f2d39b,0 6px 0 #986a43,0 13px 0 #7d5639,7px 25px 24px #603a2444,inset 0 0 0 4px #dfbf86}
  .ring:before{inset:31px;box-shadow:0 0 0 15px #ddbb7e55,inset 0 0 0 1px #efcd8b}
  .ring.relief:after{content:"";position:absolute;inset:53px;z-index:-1;border-radius:50%;background:linear-gradient(var(--sun),#fff0bd65,transparent 55%,#965e3428);border:1px solid #794d3238}
  .ring>i.current:before{box-shadow:none}
  .shadow{left:calc(50% - 8px);width:16px;background:linear-gradient(#482c20 0%,#4e3021b5 40%,#69432b75 88%,transparent);clip-path:polygon(29% 0,71% 0,100% 97%,60% 100%,13% 97%);filter:none}
  .ring.relief .shadow:after{content:"";position:absolute;inset:0 5px 26%;background:linear-gradient(#36251b,#69432b15);border-radius:50%}
  .gnomon{width:27px;height:19px;background:radial-gradient(ellipse at 40% 30%,#ddbe83,#9b6a41 47%,#573b29 76%);box-shadow:1px 3px 3px #3c261d77}
  .ring.relief .gnomon i{position:absolute;bottom:43%;left:20%;width:36px;height:62px;background:linear-gradient(108deg,#80502d 42%,#f2d492 45%,#a77948 72%,#6a492e);clip-path:polygon(83% 0,42% 95%,19% 100%,0 92%)}
  .pillar:before{background:linear-gradient(90deg,#755131,#dbb784 38%,#85613f 48%,#64432e);box-shadow:5px 7px 9px #53352142}
  @media(max-width:520px){
    main{grid-template-rows:minmax(0,1fr);gap:48px;height:570px}
    .dial p,.season p{font-size:24px;letter-spacing:.035em}
    .dial .dial-note{font-size:25px}.seasons{font-size:27px}
    .ring{width:365px;height:365px}.ring>i span{font-size:32px}
    h2{font-size:38px}.pillar{height:290px}
  }
</style>
