<script>
  import { getClepsydraState } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getClepsydraState(time));
  const names = ["日壶", "月壶", "星壶", "受水壶"];
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，铜壶滴漏浮箭已上升 ${Math.round(state.progress*100)}%`}>
  <header><div><b>铜壶滴漏</b><span>BRONZE CLEPSYDRA</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <p class="rule">水滴记秒 · 浮箭记日</p>
  <main>
    <div class="scale">
      {#each Array(13) as _, index}<i class:passed={index/12 <= state.progress}><span>{index*2}</span></i>{/each}
      <div class="float" style={`bottom:${state.progress*100}%`}><b>今</b><span>{Math.round(state.progress*100)}%</span></div>
    </div>
    <div class="vessels">
      {#each names as name, index}
        <div class="vessel" class:receiver={index === 3}>
          <span>{name}</span><small>VESSEL {index+1}</small>
          <div class="water" style={`height:${Math.max(8,state.levels[index]*100)}%`}></div>
          {#if index < 3}<i class="drop" style={`animation-delay:${index*.28}s`}></i>{/if}
        </div>
      {/each}
    </div>
  </main>
  <footer><span>已积 · PAST</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>未至 · NEXT</span></footer>
</div>

<style>
  .clock{position:relative;width:760px;height:1080px;overflow:hidden;padding:48px;color:#e9dbc1;background:radial-gradient(circle at 65% 18%,#637c6d55,transparent 36%),linear-gradient(155deg,#31433d,#172724 65%,#101b19);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.13;background:radial-gradient(circle at 20% 20%,#fff 0 1px,transparent 1.5px);background-size:15px 17px}header,.rule,main,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #d7c39e44;padding-bottom:23px}header div{display:grid;gap:6px}header b{font-size:35px;font-weight:400;letter-spacing:.16em}header span,time,.rule,small,footer,.float{font-family:monospace;letter-spacing:.12em}header span{color:#98a59d;font-size:10px}time{font-size:29px}time small{color:#e3b45f;font-size:10px;vertical-align:top}.rule{color:#9aa79f;font-size:9px}
  main{display:grid;height:800px;margin-top:24px;grid-template-columns:115px 1fr;gap:54px}.scale{position:relative;border-right:1px solid #c3a96c88}.scale>i{position:absolute;right:-1px;left:20px;bottom:calc(var(--i,0)*1%);height:1px;background:#cbb37b55}.scale>i:nth-child(1){bottom:0}.scale>i:nth-child(2){bottom:8.333%}.scale>i:nth-child(3){bottom:16.666%}.scale>i:nth-child(4){bottom:25%}.scale>i:nth-child(5){bottom:33.333%}.scale>i:nth-child(6){bottom:41.666%}.scale>i:nth-child(7){bottom:50%}.scale>i:nth-child(8){bottom:58.333%}.scale>i:nth-child(9){bottom:66.666%}.scale>i:nth-child(10){bottom:75%}.scale>i:nth-child(11){bottom:83.333%}.scale>i:nth-child(12){bottom:91.666%}.scale>i:nth-child(13){bottom:100%}.scale i:after{position:absolute;right:0;width:18px;height:1px;background:#d9bf7c;content:""}.scale i span{position:absolute;left:0;top:-7px;color:#77827d;font:9px monospace}.scale i.passed span{color:#d8bf84}.float{position:absolute;z-index:2;right:-24px;display:grid;width:47px;height:47px;place-items:center;border:1px solid #efc75f;border-radius:50%;background:#33483f;box-shadow:0 0 28px #e8bf6655;transform:translateY(50%)}.float b{font-family:inherit;font-size:18px}.float span{position:absolute;right:52px;color:#d2bb86;font-size:8px}
  .vessels{display:grid;padding:18px 0;grid-template-rows:repeat(4,1fr);gap:42px}.vessel{position:relative;overflow:visible;border:2px solid #9b7a48;border-top-width:7px;border-radius:4px 4px 30px 30px;box-shadow:inset 0 0 35px #0006,8px 12px 30px #0004;background:#694d2e66}.vessel:before,.vessel:after{position:absolute;top:12px;width:30px;height:12px;border:2px solid #806139;content:""}.vessel:before{left:-32px}.vessel:after{right:-32px}.vessel>span{position:absolute;z-index:2;top:18px;left:22px;font-size:22px}.vessel small{position:absolute;z-index:2;top:22px;right:18px;color:#a39174;font-size:8px}.water{position:absolute;right:3px;bottom:3px;left:3px;max-height:calc(100% - 6px);background:linear-gradient(#7dc0b390,#385f5c99);transition:height .8s linear}.drop{position:absolute;z-index:3;bottom:-26px;left:50%;width:7px;height:11px;border-radius:50% 50% 60% 60%;background:#9fd2c6;animation:drop 1s linear infinite}.receiver{border-color:#b28d4e}
  footer{display:flex;justify-content:space-between;border-top:1px solid #d7c39e44;padding-top:22px;color:#88958e;font-size:8px}footer b{color:#d9c69f;font-weight:400}@keyframes drop{from{transform:translateY(0);opacity:1}to{transform:translateY(28px);opacity:.1}}@media(prefers-reduced-motion:reduce){.drop{animation:none}}
  header span{font-size:18px}time{font-size:42px}time small{font-size:18px}.rule{font-size:17px}.scale i span{font-size:16px}.float span{font-size:15px}.vessel small{font-size:16px}.vessel>span{font-size:26px}footer{font-size:15px}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:36px}.rule{font-size:32px}.scale i span{font-size:28px}.float b{font-size:34px}.float span{font-size:30px}.vessel small{font-size:28px}.vessel>span{font-size:38px}footer{display:none}}
</style>
