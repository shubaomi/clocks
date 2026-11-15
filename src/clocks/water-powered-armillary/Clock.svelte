<script>
  import { getArmillaryState } from "../../lib/time-systems.js";
  let { time, motion = true, dayDuration = 86400 } = $props();
  const id = $props.id();
  let state = $derived(getArmillaryState(time));
  let phase = $derived((time.progress.day * dayDuration) % 1);
  let lever = $derived(motion ? -9 + 13*Math.max(0, 1-phase*3) : -5);
  const mechanisms = [
    {x:355, y:279, r:63, teeth:18}, {x:456, y:263, r:42, teeth:12},
  ];
  function toothProfile(radius, teeth) {
    const vertices = [];
    for(let i=0; i<teeth; i++) {
      for(const [offset, height] of [[0,0],[.18,5],[.55,5],[.73,0]]) {
        const a = (i+offset)*2*Math.PI/teeth;
        vertices.push([(radius+height)*Math.cos(a),(radius+height)*Math.sin(a)].map(n=>n.toFixed(2)).join(","));
      }
    }
    return vertices.join(" ");
  }
  const profiles = mechanisms.map(({r,teeth}) => toothProfile(r,teeth));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，水运仪象台步进机构运行中`}>
  <header><div><b>水运仪象台</b><span>WATER-POWERED ASTRONOMICAL CLOCK</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <svg viewBox="0 0 1040 530" aria-hidden="true">
      <defs>
        <linearGradient id={id+"-brass"}><stop stop-color="#5c634d"/><stop offset=".22" stop-color="#bba270"/><stop offset=".5" stop-color="#d6bb83"/><stop offset=".66" stop-color="#807553"/><stop offset="1" stop-color="#514e39"/></linearGradient>
        <radialGradient id={id+"-globe"} cx=".35" cy=".27" r=".77"><stop stop-color="#61776a"/><stop offset=".64" stop-color="#304b42"/><stop offset="1" stop-color="#162a26"/></radialGradient>
      </defs>
      <g stroke="#a39167" fill="none">
        <path d="M166 185 V481 M188 194V492 M604 197V494 M623 182V480" stroke-width="4"/>
        <path d="M180 202L604 483 M602 204L182 482" opacity=".16"/>
        {#each [185,367,492] as y}
          <path d={`M130 ${y} l31 -12 h483 l-33 12 z`} fill="#63715a"/>
          <path d={`M130 ${y} h481 v10 H130z`} fill={'url(#'+id+'-brass)'}/>
        {/each}
      </g>
      <g transform="translate(391 94)">
        <ellipse cy="83" rx="80" ry="9" fill="#12231d" opacity=".55"/>
        <path d="M-54 76 Q0 63 54 76 L58 81 H-58z M-5 56H5V77H-5Z" fill={'url(#'+id+'-brass)'}/>
        <circle r="77" fill={'url(#'+id+'-globe)'} stroke="#b6a477" stroke-width="3"/>
        <g transform={`rotate(${state.sphereRotation})`} class="celestial-rings" fill="none">
          <ellipse rx="32" ry="75" stroke="#c4b283" stroke-width="3"/>
          <ellipse rx="77" ry="27" transform="rotate(-26)" stroke="#cdb982" stroke-width="4"/>
          <ellipse rx="76" ry="21" transform="rotate(42)" stroke="#91a991" stroke-width="2"/>
        </g>
        <path d="M-88 1Q-88 94 0 87Q88 84 88 -1" fill="none" stroke={'url(#'+id+'-brass)'} stroke-width="6"/>
      </g>
      <g stroke="#9d956d" fill="none">
        <path d="M391 193V234L355 272 M452 306V355L409 403" stroke-width="5"/>
        <path d="M238 203h20v85q0 23 24 23h20" stroke-width="6"/>
      </g>
      {#each mechanisms as mechanism, i}
        <g transform={`translate(${mechanism.x} ${mechanism.y})`}>
          <g transform={`rotate(${i===0 ? state.escapement*8 : -state.escapement*12})`}>
            <polygon points={profiles[i]} fill="#514d37" stroke="#b69b65" stroke-width="2" transform="translate(2 4)"/>
            <polygon points={profiles[i]} fill={'url(#'+id+'-brass)'} stroke="#dbc18d" stroke-width="1.5"/>
            <circle r={mechanism.r-9} fill="#233930" stroke="#746b4a" stroke-width="3"/>
            {#each [0,60,120] as spoke}
              <path d={`M${11-mechanism.r} 0h${2*(mechanism.r-11)}`} transform={`rotate(${spoke})`} stroke="#ab9464" stroke-width="8"/>
            {/each}
            <circle r="11" fill="#716444" stroke="#e3c384" stroke-width="4"/>
          </g>
          {#if i===0}
            <path d="M-2 -7h4v9h-4z" fill="#402f24" transform={`rotate(${time.minute*6+time.progress.minute*6})`}/>
          {/if}
        </g>
      {/each}
      <g transform={`rotate(${lever} 531 224)`}>
        <path d="M478 221 L485 215 532 218 572 202l3 6 -42 18 -48 -3 -5 7z" fill="#c5a567"/>
        <circle cx="531" cy="224" r="6" fill="#25372b" stroke="#bca671" stroke-width="3"/>
      </g>
      <path d="M516 353v-26m0 0q30 -13 56 0v26" fill="none" stroke="#91a792" stroke-width="3"/>
      {#if motion}<ellipse cx="544" cy={299+phase*phase*38} rx="3" ry="5" fill="#a4c8ae"/>{/if}
      {#each ["刻","时","更"] as name,i}
        {@const active = i===0 ? state.quarterActive : i===1 && state.hourActive}
        <g transform={`translate(${287+i*107} 434)`}>
          <path d="M-34 49V-24Q0 -57 34 -24V49" fill="#162b24" stroke="#7b7957" stroke-width="3"/>
          <g transform={`translate(0 ${active ? -7 : 5})`} fill={active ? "#ebc986" : "#a7a07d"}>
            <circle cy="-13" r="9"/><path d="M-10 -2h20l8 41h-36z"/>
            <path d={active ? "M-5 1l-13 -17 -7 3 12 22z" : "M-5 1l-12 13 4 6 14 -13z"}/>
          </g>
        </g>
      {/each}
      <g stroke="#9d9975" fill="none" opacity=".58">
        <path d="M506 99h106l31 -21h63 M531 252h85l30 16h60 M470 425h143l34 16h59"/>
      </g>
    </svg>
    <div class="labels"><span>上观天 <small>OBSERVE</small></span><span>中示象 <small>MODEL</small></span><span>下报时 <small>KEEP TIME</small></span></div>
    <div class="figures">{#each ["刻","时","更"] as name,i}<span class:active={i===0 ? state.quarterActive : i===1 && state.hourActive}>{name}</span>{/each}</div>
  </main>
  <div class="status" aria-label="秒驱动步进，分钟转动天球，每刻与整点启动木人，声音默认关闭"><span>秒驱动步进 {String(state.escapement).padStart(2,"0")}</span><i></i><b>分转天球 · {state.hourActive?"整点报时":state.quarterActive?"一刻报时":"水力运行"}</b><i></i><span>刻时启木人 · 无声</span></div>
  <footer><span>结构意译 · 非复原图</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>水力使天与时同转</span></footer>
</div>

<style>
  .clock{position:relative;width:1200px;height:820px;overflow:hidden;padding:44px 54px;color:#ded7bb;background:radial-gradient(ellipse at 35% 40%,#3d5849,#20372e 55%,#172a22);font-family:"Songti SC","STSong",serif}
  header{display:flex;justify-content:space-between;border-bottom:1px solid #dfd0a64a;padding-bottom:18px}header div{display:flex;align-items:baseline;gap:20px}header b{font-size:34px;font-weight:400;letter-spacing:.15em}
  header span,time,small,.status,footer{font-family:monospace;letter-spacing:.09em}header span,footer{font-size:19px;color:#bec7b6}time{font-size:42px}time small{color:#efc977;font-size:20px;vertical-align:top;margin-left:6px}
  main{position:relative;margin:10px 0;width:100%;aspect-ratio:1040/530}svg{display:block;width:100%;height:100%}
  .labels{position:absolute;left:70%;top:0;bottom:0;display:grid;grid-template-rows:repeat(3,1fr);align-items:center}
  .labels span{display:grid;gap:6px;color:#e4dbb8;font-size:32px;line-height:1.15;letter-spacing:.13em}.labels small{color:#b7c6b5;font-size:17px}
  .figures{position:absolute;left:22.5%;top:95%;width:30.8%;display:grid;grid-template-columns:repeat(3,1fr);color:#b3b6a1;font-size:20px;text-align:center}.figures .active{color:#ffd999}
  .status{display:flex;justify-content:center;align-items:center;gap:14px;margin-top:18px;color:#c1ccbd;font-size:19px}.status i{width:34px;height:1px;background:#af996b66}.status b{color:#efcc83;font-weight:500}
  footer{position:absolute;right:54px;bottom:28px;left:54px;display:flex;justify-content:space-between;border-top:1px solid #dfd0a63b;padding-top:12px}footer b{color:#d6ceb4}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:44px}.labels span{font-size:44px}.labels small{font-size:29px}.figures{font-size:26px}.status{font-size:28px;gap:14px}.status i{display:none}footer{display:none}}
</style>
