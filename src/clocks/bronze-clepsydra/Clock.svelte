<script>
  import { getClepsydraState } from "../../lib/time-systems.js";
  let { time, motion = true, dayDuration = 86400 } = $props();
  const id = $props.id();
  const names = ["日壶", "月壶", "星壶", "受水壶"];
  const body = "M32 28 Q33 129 66 142 Q178 164 306 142 Q340 130 342 28 Z";
  let state = $derived(getClepsydraState(time));
  let phase = $derived((state.progress * dayDuration) % 1);

  function dropAt(index, waterY, second) {
    const t = (second + index/3) % 1;
    const fall = Math.max(0, Math.min(1, (t-.33)/.43));
    const start = -18;
    return {
      y: start + fall*fall*(waterY-start),
      size: t < .33 ? 1.2+t*12 : 5,
      impact: Math.max(0, (t-.76)/.24),
    };
  }
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，铜壶滴漏浮箭已上升 ${Math.round(state.progress*100)}%`}>
  <header><div><b>铜壶滴漏</b><span>BRONZE CLEPSYDRA</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <p class="rule">水滴记秒 · 浮箭＝当前时刻 · 水位＝当日进度</p>
  <main>
    <div class="scale">
      {#each Array(13) as _, index}
        <i class:passed={index/12 <= state.progress} style:bottom={index/12*100+'%'}><span>{index*2}</span></i>
      {/each}
      <div class="float" style:bottom={state.progress*100+'%'}><b>今</b><span>{Math.round(state.progress*100)}%</span></div>
    </div>
    <div class="vessels">
      <svg viewBox="0 0 430 794" aria-hidden="true">
        <defs>
          <linearGradient id={id+"-bronze"}><stop stop-color="#6f573b"/><stop offset=".12" stop-color="#b39564"/><stop offset=".28" stop-color="#5c6555"/><stop offset=".63" stop-color="#344a40"/><stop offset=".84" stop-color="#787952"/><stop offset="1" stop-color="#b4945d"/></linearGradient>
          <linearGradient id={id+"-water"} x2=".1" y2="1"><stop stop-color="#91c0a7"/><stop offset=".22" stop-color="#558981"/><stop offset="1" stop-color="#2b504e"/></linearGradient>
          <clipPath id={id+"-bowl"}><path d={body}/></clipPath>
        </defs>
        {#each names as _, index}
          {@const waterY = 148 - state.levels[index]*113}
          {@const drop = dropAt(index, waterY, phase)}
          <g transform={`translate(${15+index*8} ${8+index*198})`}>
            <path d="M34 47 Q-3 23 8 65 L45 84 M340 47 Q371 25 364 63 L331 83" fill="none" stroke="#ac9063" stroke-width="6"/>
            <path d={body} fill={'url(#'+id+'-bronze)'} stroke="#c2a773" stroke-width="3"/>
            <ellipse cx="187" cy="29" rx="155" ry="18" fill="#283a32" stroke="#bfa36e" stroke-width="4"/>
            <g clip-path={'url(#'+id+'-bowl)'}>
              {#if state.levels[index] > 0}
                <rect x="33" y={waterY} width="308" height={152-waterY} fill={'url(#'+id+'-water)'}/>
                <ellipse cx="187" cy={waterY} rx="153" ry="9" fill="#83ad98"/>
              {/if}
              {#if index && motion && drop.impact}
                <ellipse cx="182" cy={waterY} rx={4+drop.impact*52} ry={1+drop.impact*9}
                  fill="none" stroke="#d4eee1" stroke-width="2.6" opacity={1-drop.impact}/>
              {/if}
              <path d="M50 28 Q52 122 81 140 M67 40 Q70 114 83 125" fill="none" stroke="#ffe8b4" stroke-opacity=".20" stroke-width="4"/>
            </g>
            <path d="M32 28 Q182 61 342 28 M59 136 Q176 166 309 138" fill="none" stroke="#b59b68" stroke-width="4"/>
            {#if index < 3}<path d="M178 151h24v16l-6 14h-11l-7 -14z" fill={'url(#'+id+'-bronze)'} stroke="#8c7951" stroke-width="2"/>{/if}
            {#if index && motion && !drop.impact}
              <ellipse cx="182" cy={drop.y} rx={drop.size*.82} ry={drop.size*1.45} fill="#bce7dc"/>
            {/if}
          </g>
        {/each}
      </svg>
      <div class="labels">
        {#each names as name, index}
          <div style:margin-left={index*8+'px'}><span>{name}</span><small>VESSEL {index+1}</small></div>
        {/each}
      </div>
    </div>
  </main>
  <footer><span>已积 · PAST</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>未至 · NEXT</span></footer>
</div>

<style>
  .clock{position:relative;width:760px;height:1080px;overflow:hidden;padding:48px;color:#e9dbc1;background:radial-gradient(ellipse at 66% 28%,#395346,#233a32 46%,#152620 89%);font-family:"Songti SC","STSong",serif}
  header{display:flex;justify-content:space-between;border-bottom:1px solid #d7c39e55;padding-bottom:23px}header div{display:grid;gap:6px}header b{font-size:35px;font-weight:400;letter-spacing:.16em}
  header span,time,.rule,small,footer,.float{font-family:monospace;letter-spacing:.10em}header span,.rule{color:#bfcbc0;font-size:21px}time{font-size:42px}time small{color:#e3b45f;font-size:21px;vertical-align:top}
  main{display:grid;height:772px;margin:28px 0;grid-template-columns:115px minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:46px}
  .scale{position:relative;border-right:2px solid #bba27188}.scale>i{position:absolute;right:-1px;left:20px;height:1px;background:#cbb37b55}
  .scale i:after{position:absolute;right:0;width:18px;height:2px;background:#d9bf7c;content:""}.scale span{position:absolute;left:0;top:-10px;background:#253c33;color:#aebdb3;font:19px monospace}.scale i.passed span{color:#e6ca8b}
  .float{position:absolute;right:-21px;display:grid;width:42px;height:42px;place-items:center;border:2px solid #e3c16d;color:#f1d998;background:#344b3b;transform:translateY(50%)}
  .float b{font-size:24px}.float span{top:-9px;left:48px;color:#f2d28a;font-size:20px}
  .vessels{position:relative;height:100%}svg{display:block;width:100%;height:100%;overflow:visible}
  .labels{position:absolute;inset:0;display:grid;grid-template-rows:repeat(4,1fr);align-items:center;pointer-events:none}
  .labels div{display:flex;align-items:center;gap:15px;margin-top:-7px;padding-left:18%;color:#f3e8cb;text-shadow:0 2px 4px #29382e,0 0 5px #29382e}
  .labels span{font-size:31px;letter-spacing:.09em}.labels small{font-size:17px}
  footer{display:flex;justify-content:space-between;border-top:1px solid #d7c39e44;padding-top:17px;color:#bfd0c3;font-size:20px}footer b{color:#d9c69f;font-weight:400}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:36px}.rule{font-size:29px;letter-spacing:.03em;margin:18px 0}main{margin-top:32px}.scale span{font-size:31px}.float b{font-size:33px}.float span{font-size:28px}.labels span{font-size:39px}.labels small{font-size:26px}footer{display:none}}
</style>
