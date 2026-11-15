<script>
  let { time, motion = true } = $props();
  const uid = $props.id();
  let rotation = $derived(time.progress.day * 360 - 90);
  let daylight = $derived((Math.cos((time.progress.day - .5) * Math.PI * 2) + 1) / 2);
  let reflection = $derived(motion ? rotation + time.progress.minute * 360 : -48);
</script>

<div class="clock" style={`--turn:${rotation}deg;--light:${daylight}`} aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，太极昼夜日进度 ${Math.round(time.progress.day*100)}%`}>
  <header><div><b>太极昼夜</b><span>TAIJI · DAY & NIGHT</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <div class="nodes"><span>子 · MIDNIGHT</span><span>卯 · DAWN</span><span>午 · NOON</span><span>酉 · DUSK</span></div>
  <main>
    <div class="orbit"><i></i></div>
    <svg class="taiji" viewBox="0 0 400 400" role="img" aria-label="阴阳鱼随本地时间旋转，光晕随昼夜明暗呼吸的太极图">
      <defs>
        <linearGradient id={`${uid}-ivory`} x2=".65" y2="1"><stop stop-color="#fff4d9"/><stop offset=".49" stop-color="#e5dcc7"/><stop offset="1" stop-color="#beb297"/></linearGradient>
        <linearGradient id={`${uid}-ink`} x2=".85" y2="1"><stop stop-color="#424c49"/><stop offset=".5" stop-color="#222b29"/><stop offset="1" stop-color="#131917"/></linearGradient>
        <linearGradient id={`${uid}-rim`} x2=".4" y2="1"><stop stop-color="#d9c6a2"/><stop offset=".35" stop-color="#7b7160"/><stop offset=".78" stop-color="#3f4540"/><stop offset="1" stop-color="#ab9475"/></linearGradient>
      </defs>
      <circle cx="200" cy="205" r="196" fill="#343830" stroke="#706957" stroke-width="3"/>
      <circle cx="200" cy="200" r="194" fill={`url(#${uid}-ink)`}/>
      <g class="taiji-cycle" style={`transform:rotate(${rotation}deg)`}>
        <path d="M200 6A194 194 0 0 0 200 394A97 97 0 0 0 200 200A97 97 0 0 1 200 6Z" fill={`url(#${uid}-ivory)`}/>
        <circle cx="200" cy="103" r="24" fill={`url(#${uid}-ivory)`}/>
        <circle cx="200" cy="297" r="24" fill={`url(#${uid}-ink)`}/>
      </g>
      <circle cx="200" cy="200" r="194" fill="none" stroke={`url(#${uid}-rim)`} stroke-width="4"/>
      {#if motion}
        <g class="rim-reflection" transform={`rotate(${reflection} 200 200)`}>
          <path d="M32 103A194 194 0 0 1 149 13" fill="none" stroke="#f6e5bf" stroke-width="2.7" opacity={.42 + daylight * .4}/>
        </g>
      {/if}
    </svg>
    <div class="breath" aria-hidden="true"></div>
    <div class="center-read"><b>{time.hh}:{time.mm}</b><span>{time.progress.day < .5 ? "阳长 · LIGHT ASCENDS" : "阴长 · DARKNESS ASCENDS"}</span></div>
  </main>
  <footer><span>一日一太极</span><i></i><span>{Math.round(time.progress.day*100)}% OF DAY</span></footer>
</div>

<style>
  .clock{position:relative;width:900px;height:900px;overflow:hidden;padding:48px;color:#ded9cd;background:radial-gradient(circle at 50% 45%,#3b4646,#202827 62%,#141817);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.15;background:repeating-radial-gradient(circle at 50% 50%,transparent 0 22px,#e6dfcb18 23px)}header{position:relative;z-index:2;display:flex;justify-content:space-between;border-bottom:1px solid #e9e0cb33;padding-bottom:20px}header div{display:grid;gap:6px}header b{font-size:30px;font-weight:400;letter-spacing:.18em}header span,time,footer,.center-read span{font-family:monospace;letter-spacing:.14em}header span{color:#aaa79f;font-size:10px}time{font-size:30px}time small{color:#c95e48;font-size:11px;vertical-align:top;margin-left:6px}.nodes{position:absolute;z-index:2;inset:122px 40px auto;display:flex;justify-content:space-between;color:#9d9e97;font:9px monospace;letter-spacing:.1em}
  main{position:relative;display:grid;height:650px;place-items:center}.taiji{width:490px;height:490px;overflow:visible;filter:drop-shadow(7px 24px 19px #070b0a99)}.taiji-cycle{transform-origin:200px 200px}.taiji-cycle circle{filter:drop-shadow(0 0 5px #0f121155)}.orbit{position:absolute;width:600px;height:600px;border:1px solid #e9e0cb25;border-radius:50%;transform:rotate(var(--turn))}.orbit:before,.orbit:after{position:absolute;inset:35px;border:1px solid #e9e0cb18;border-radius:50%;content:""}.orbit:after{inset:74px}.orbit i{position:absolute;top:50%;right:-7px;width:14px;height:14px;border-radius:50%;background:#d26049;box-shadow:0 0 28px #e45f46}.breath{position:absolute;width:520px;height:520px;border-radius:50%;box-shadow:0 0 calc(25px + var(--light)*45px) #d5b16733;pointer-events:none}.center-read{position:absolute;inset:auto 0 -16px;display:flex;align-items:baseline;justify-content:center;gap:16px;text-align:center}.center-read b{font:700 26px monospace}.center-read span{font-size:8px;color:#d2cec2}footer{position:absolute;right:48px;bottom:38px;left:48px;display:flex;align-items:center;gap:16px;color:#9f9d96;font-size:9px}footer i{height:1px;flex:1;background:#e9e0cb33}
  header span{font-size:19px}time{font-size:42px}time small{font-size:19px}.nodes{font-size:18px}.center-read b{font-size:40px}.center-read span{font-size:18px}footer{font-size:18px}
  @media(max-width:520px){header b{font-size:48px}header span{display:none}time{font-size:58px}time small{font-size:40px}.nodes{font-size:23px}.nodes span{white-space:nowrap}.center-read b{font-size:44px}.center-read span{font-size:25px}footer{font-size:34px}}
</style>
