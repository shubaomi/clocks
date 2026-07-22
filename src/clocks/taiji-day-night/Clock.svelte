<script>
  let { time } = $props();
  let rotation = $derived(time.progress.day * 360 - 90);
  let daylight = $derived((Math.cos((time.progress.day - .5) * Math.PI * 2) + 1) / 2);
  let boundary = $derived(88 + daylight * 224);
  let lightPath = $derived(`M0 0H${boundary}C${boundary+80} 85 ${boundary-80} 115 ${boundary} 200C${boundary+80} 285 ${boundary-80} 315 ${boundary} 400H0Z`);
</script>

<div class="clock" style={`--turn:${rotation}deg;--light:${daylight}`} aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，太极昼夜日进度 ${Math.round(time.progress.day*100)}%`}>
  <header><div><b>太极昼夜</b><span>TAIJI · DAY & NIGHT</span></div><time>{time.hh}:{time.mm}<small>{time.ss}</small></time></header>
  <div class="nodes"><span>子 · MIDNIGHT</span><span>卯 · DAWN</span><span>午 · NOON</span><span>酉 · DUSK</span></div>
  <main>
    <div class="orbit"><i></i></div>
    <svg class="taiji" viewBox="0 0 400 400" role="img" aria-label="阴阳面积随昼夜连续消长的太极图">
      <defs><clipPath id="taiji-circle"><circle cx="200" cy="200" r="194"/></clipPath></defs>
      <circle cx="200" cy="200" r="194" fill="#202523"/>
      <path d={lightPath} fill="#e9e3d5" clip-path="url(#taiji-circle)"/>
      <circle cx={boundary} cy="105" r="20" fill="#202523"/><circle cx={boundary} cy="295" r="20" fill="#e9e3d5"/>
      <circle cx="200" cy="200" r="194" fill="none" stroke="#a24736" stroke-width="2"/>
    </svg>
    <div class="breath"></div>
    <div class="center-read"><b>{time.hh}:{time.mm}</b><span>{daylight > .5 ? "阳长 · LIGHT ASCENDS" : "阴长 · DARKNESS ASCENDS"}</span></div>
  </main>
  <footer><span>一日一太极</span><i></i><span>{Math.round(time.progress.day*100)}% OF DAY</span></footer>
</div>

<style>
  .clock{position:relative;width:900px;height:900px;overflow:hidden;padding:48px;color:#ded9cd;background:radial-gradient(circle at 50% 45%,#3b4646,#202827 62%,#141817);font-family:"Songti SC","STSong",serif}.clock:before{position:absolute;inset:0;content:"";opacity:.15;background:repeating-radial-gradient(circle at 50% 50%,transparent 0 22px,#e6dfcb18 23px)}header{position:relative;z-index:2;display:flex;justify-content:space-between;border-bottom:1px solid #e9e0cb33;padding-bottom:20px}header div{display:grid;gap:6px}header b{font-size:30px;font-weight:400;letter-spacing:.18em}header span,time,footer,.center-read span{font-family:monospace;letter-spacing:.14em}header span{color:#aaa79f;font-size:10px}time{font-size:30px}time small{color:#c95e48;font-size:11px;vertical-align:top;margin-left:6px}.nodes{position:absolute;z-index:2;inset:122px 40px auto;display:flex;justify-content:space-between;color:#9d9e97;font:9px monospace;letter-spacing:.1em}
  main{position:relative;display:grid;height:650px;place-items:center}.taiji{width:490px;height:490px;filter:drop-shadow(0 30px 50px #0008)}.orbit{position:absolute;width:600px;height:600px;border:1px solid #e9e0cb25;border-radius:50%;transform:rotate(var(--turn))}.orbit:before,.orbit:after{position:absolute;inset:35px;border:1px solid #e9e0cb18;border-radius:50%;content:""}.orbit:after{inset:74px}.orbit i{position:absolute;top:50%;right:-7px;width:14px;height:14px;border-radius:50%;background:#d26049;box-shadow:0 0 28px #e45f46}.breath{position:absolute;width:520px;height:520px;border-radius:50%;box-shadow:0 0 calc(25px + var(--light)*45px) #d5b16733;animation:breathe 5s ease-in-out infinite}.center-read{position:absolute;z-index:3;display:grid;padding:13px 18px;background:#18201fbb;text-align:center;gap:4px}.center-read b{font:700 26px monospace}.center-read span{font-size:8px;color:#bbb6aa}footer{position:absolute;right:48px;bottom:38px;left:48px;display:flex;align-items:center;gap:16px;color:#9f9d96;font-size:9px}footer i{height:1px;flex:1;background:#e9e0cb33}@keyframes breathe{50%{transform:scale(1.025);opacity:.65}}@media(prefers-reduced-motion:reduce){.breath{animation:none}}
  header span{font-size:18px}time{font-size:42px}time small{font-size:18px}.nodes{font-size:16px}.center-read{padding:18px 24px}.center-read b{font-size:40px}.center-read span{font-size:16px}footer{font-size:16px}
  @media(max-width:520px){header b{font-size:48px}header span{display:none}time{font-size:58px}time small{font-size:40px}.nodes{font-size:34px}.center-read b{font-size:58px}.center-read span{font-size:34px}footer{font-size:34px}}
</style>
