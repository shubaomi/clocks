<script>
  import { getIncenseState } from "../../lib/time-systems.js";

  let { time, motion = true, dayDuration = 86400 } = $props();
  const id = $props.id();
  const points = [[130,130], [470,130], [470,200], [190,200], [190,270], [470,270],
    [470,340], [130,340], [130,410], [470,410], [470,480], [130,480]];
  const lengths = points.slice(1).map(([x,y], i) => Math.hypot(x-points[i][0], y-points[i][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);

  function station(progress) {
    let remaining = Math.max(0, Math.min(progress, 1)) * total;
    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i] || i === lengths.length - 1) {
        const u = remaining / lengths[i];
        const [x, y] = points[i];
        return { i, point: [x + (points[i+1][0]-x)*u, y + (points[i+1][1]-y)*u] };
      }
      remaining -= lengths[i];
    }
  }
  const path = (vertices) => "M" + vertices.map(([x,y]) => x.toFixed(2) + " " + y.toFixed(2)).join(" L");
  // Project the track and its smoke sources through the same oblique view.
  const project = ([x,y]) => [x - .21*y + 78, .12*x + .76*y + 48];
  function plume(progress, seconds, depth) {
    const left = [], right = [];
    for (let i=0; i<=18; i++) {
      const height = i/18;
      const age = height * 2.8;
      const [ox,oy] = project(station(progress - age/dayDuration).point);
      const wave = Math.sin(seconds*1.65 - height*8 + depth*.8);
      const twist = Math.cos(seconds*1.23 - height*10 + depth);
      const x = ox + height*(15 + depth*7 + 27*wave) + height*height*13*twist;
      const y = oy - 5 - height*(115 + 18*depth) + height*5*twist;
      const width = .6 + Math.sin(Math.PI*height)*((4 + 6*height) * (.3 + .7*Math.abs(twist)));
      left.push([x-width, y]);
      right.push([x+width, y]);
    }
    return path([...left, ...right.reverse()]) + " Z";
  }

  let state = $derived(getIncenseState(time));
  let tip = $derived(station(state.progress));
  let ash = $derived(path([...points.slice(0, tip.i + 1), tip.point]));
  let fresh = $derived(path([tip.point, ...points.slice(tip.i + 1)]));
  let seconds = $derived(state.progress * dayDuration);
  let spark = $derived(project(tip.point));
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，香篆已燃 ${Math.round(state.progress*100)}%`}>
  <header><div><b>香篆流时</b><span>INCENSE SEAL CLOCK</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <main>
    <svg viewBox="0 0 612 595" role="img" aria-label="由灰烬、余火和未燃香粉组成的香篆路径">
      <defs>
        <linearGradient id={id+"-bed"} x2=".9" y2="1" gradientUnits="objectBoundingBox">
          <stop stop-color="#ab957a"/><stop offset=".52" stop-color="#c7b394"/><stop offset="1" stop-color="#ad9375"/>
        </linearGradient>
        <linearGradient id={id+"-wall"} x2="0" y2="1">
          <stop stop-color="#bb8b58"/><stop offset=".32" stop-color="#684b37"/><stop offset=".56" stop-color="#916949"/><stop offset="1" stop-color="#46352a"/>
        </linearGradient>
        <pattern id={id+"-grain"} width="13" height="11" patternUnits="userSpaceOnUse">
          <path d="M1 2l2 -1m5 5l2 1m-6 2l1 -1" fill="none" stroke="#3b211b" stroke-opacity=".24"/>
          <path d="M6 2l1 1m3 5l2 -.5" fill="none" stroke="#ffecc6" stroke-opacity=".55"/>
        </pattern>
        <radialGradient id={id+"-heat"}><stop stop-color="#fff0ac"/><stop offset=".32" stop-color="#ffac48"/><stop offset=".6" stop-color="#cd4d28"/><stop offset="1" stop-color="#833824" stop-opacity="0"/></radialGradient>
      </defs>
      <g transform="matrix(1 .12 -.21 .76 78 48)">
        <rect x="68" y="94" width="464" height="457" rx="20" fill="#4e382c" opacity=".25" transform="translate(6 10)"/>
        <rect x="66" y="87" width="468" height="460" rx="16" fill={'url(#'+id+'-wall)'}/>
        <rect x="66" y="66" width="468" height="466" rx="16" fill="#aa835d" stroke="#573e2f" stroke-width="4"/>
        <rect x="74" y="74" width="452" height="450" rx="12" fill="#654c37" stroke="#efd1a3" stroke-width="2.5"/>
        <rect x="83" y="87" width="434" height="427" rx="9" fill={'url(#'+id+'-bed)'}/>
        <rect x="83" y="87" width="434" height="427" rx="9" fill={'url(#'+id+'-grain)'} opacity=".36"/>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          {#if state.progress > 0}
            <path d={ash} stroke="#867663" stroke-width="19" transform="translate(0 2)"/>
            <path d={ash} stroke="#c9beb0" stroke-width="17"/>
            <path d={ash} stroke={'url(#'+id+'-grain)'} stroke-width="17"/>
          {/if}
          <path d={fresh} stroke="#7a604e" stroke-width="25" transform="translate(2 5)"/>
          <path d={fresh} stroke="#704734" stroke-width="23"/>
          <path d={fresh} stroke="#986549" stroke-width="18" transform="translate(0 -3)"/>
          <path d={fresh} stroke="#b88763" stroke-width="9" transform="translate(-1 -6)"/>
          <path d={fresh} stroke={'url(#'+id+'-grain)'} stroke-width="20" transform="translate(0 -3)"/>
        </g>
      </g>
      <g transform={`translate(${spark[0]} ${spark[1]-4})`}>
        <ellipse rx={motion ? 17+2*Math.sin(seconds*4.3) : 17} ry="13" fill={'url(#'+id+'-heat)'}/>
        <ellipse rx="4" ry="2.8" fill="#ffe5a3"/>
      </g>
      {#if motion}
        <g aria-hidden="true" class="plume">
          <path d={plume(state.progress,seconds,0)} fill="#534638" opacity=".25"/>
          <path d={plume(state.progress,seconds,.45)} fill="#fff3dc" opacity=".68"/>
          <path d={plume(state.progress,seconds,1)} fill="#eee4d7" opacity=".42"/>
        </g>
      {/if}
    </svg>
    <div class="reading"><strong>{Math.round(state.progress*100)}%</strong><span>香路已行 · PATH BURNED</span></div>
  </main>
  <section class="legend"><span><i class="past"></i>灰 · PAST</span><span><i class="now"></i>烬 · NOW</span><span><i class="next"></i>香 · NEXT</span></section>
  <footer><span>午夜铺香</span><b>{time.year}.{String(time.month).padStart(2,"0")}.{String(time.day).padStart(2,"0")}</b><span>一日一篆</span></footer>
</div>

<style>
  .clock{position:relative;width:960px;height:960px;overflow:hidden;padding:50px;color:#4a2c25;background:radial-gradient(ellipse at 58% 26%,#ecdccb,#cbb099 68%,#b18a72);font-family:"Songti SC","STSong",serif}
  header{display:flex;justify-content:space-between;border-bottom:1px solid #5e392b55;padding-bottom:21px}
  header div{display:grid;gap:5px}header b{font-size:36px;font-weight:500;letter-spacing:.16em}
  header span,time,.legend,footer,.reading span{font-family:monospace;letter-spacing:.1em}
  header span,.legend,footer{font-size:19px;color:#664638}time{font-size:42px}time small{color:#963a28;font-size:19px;vertical-align:top;margin-left:6px}
  main{position:relative;width:840px;height:674px;margin:15px auto 10px}
  svg{display:block;width:100%;height:100%;overflow:visible}
  .reading{position:absolute;right:0;bottom:0;display:flex;align-items:baseline;gap:12px}
  .reading strong{font:700 38px/1 monospace}.reading span{font-size:18px}
  .legend{display:flex;justify-content:center;gap:46px}.legend span{display:flex;align-items:center;gap:9px}
  .legend i{width:24px;height:5px}.past{background:#ddd1be;box-shadow:0 1px 2px #654d3c}.now{background:#d34d29}.next{background:#754f38}
  footer{position:absolute;right:50px;bottom:40px;left:50px;display:flex;justify-content:space-between;border-top:1px solid #76533f66;padding-top:17px}
  @media(max-width:520px){header b{font-size:50px}header span{display:none}time{font-size:58px}time small{font-size:40px}.reading strong{font-size:54px}.reading span{font-size:28px}.legend{font-size:34px}footer{display:none}}
  @media(prefers-reduced-motion:reduce){.plume{display:none}}
</style>
