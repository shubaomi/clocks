<script>
  import { earthlyBranches, getSexagenaryState, heavenlyStems } from "../../lib/time-systems.js";
  let { time } = $props();
  let state = $derived(getSexagenaryState(time));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，六十秒干支编码行至${state.name}`}>
  <header><div><b>六十甲子</b><span>SEXAGENARY CYCLE</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <div class="ring stems" style={`transform:rotate(${-state.stemRotation}deg)`}>{#each heavenlyStems as stem,index}<span class:active={index===state.index%10} style={`transform:rotate(${index*36}deg) translateY(-260px) rotate(${-index*36+state.stemRotation}deg)`}>{stem}</span>{/each}</div>
    <div class="ring branches" style={`transform:rotate(${state.branchRotation}deg)`}>{#each earthlyBranches as branch,index}<span class:active={index===state.index%12} style={`transform:rotate(${index*30}deg) translateY(-185px) rotate(${-index*30-state.branchRotation}deg)`}>{branch}</span>{/each}</div>
    <div class="center"><span>{String(state.index+1).padStart(2,"0")} / 60</span><strong>{state.name}</strong><b>{state.stem} · {state.branch}</b><i><em style={`width:${state.progress*100}%`}></em></i></div>
  </main>
  <section class="formula"><span>十天干</span><i>×</i><span>十二地支</span><i>→</i><b>六十相合</b></section>
  <footer><span>一秒一干支</span><b>当代压缩编码 · 非传统逐秒纪时</b><span>一分一周天</span></footer>
</div>

<style>
  .clock{position:relative;width:960px;height:960px;overflow:hidden;padding:48px;color:#3c3022;background:radial-gradient(circle at 50% 45%,#ece1bf,#c7b17b 68%,#927647);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.18;background:repeating-radial-gradient(circle at 50% 48%,transparent 0 28px,#553f2226 29px)}header,main,.formula,footer{position:relative;z-index:1}header{display:flex;justify-content:space-between;border-bottom:1px solid #4c39244c;padding-bottom:20px}header div{display:grid;gap:5px}header b{font-size:35px;font-weight:500;letter-spacing:.17em}header span,time,.center span,.center b,.formula,footer{font-family:monospace;letter-spacing:.1em}header span{color:#756347;font-size:9px}time{font-size:30px}time small{color:#9d3429;font-size:10px;vertical-align:top;margin-left:6px}main{position:relative;width:680px;height:680px;margin:15px auto}.ring{position:absolute;inset:60px;border:1px solid #5a432d55;border-radius:50%;transition:transform .6s ease}.ring:before,.ring:after{position:absolute;inset:35px;border:1px solid #5a432d2d;border-radius:50%;content:""}.ring:after{inset:72px}.ring span{position:absolute;top:50%;left:calc(50% - 20px);display:grid;width:40px;height:40px;place-items:center;color:#766343;font-size:24px;transform-origin:20px 0}.ring span.active{border:1px solid #9d3429;color:#9d3429;background:#e9dcb5;box-shadow:0 0 0 5px #9d34291b,0 0 25px #9d342944}.branches{inset:135px}.branches span{font-size:22px}.center{position:absolute;inset:50% auto auto 50%;display:grid;width:230px;transform:translate(-50%,-50%);text-align:center;gap:5px}.center span{color:#7f6e50;font-size:9px}.center strong{color:#8e3026;font-size:92px;font-weight:500}.center b{font-size:10px;color:#5e4b32}.center i{height:3px;margin-top:12px;background:#6f593642}.center em{display:block;height:100%;background:#9b3429}.formula{display:flex;justify-content:center;align-items:center;gap:18px;color:#705d40;font-size:9px}.formula i{color:#9c3429;font-style:normal}.formula b{font-weight:600}footer{position:absolute;right:48px;bottom:38px;left:48px;display:flex;justify-content:space-between;border-top:1px solid #4c39244c;padding-top:18px;color:#735f43;font-size:8px}footer b{color:#3f3223}
</style>
