<script>
  import { earthlyBranches, getSexagenaryState, heavenlyStems } from "../../lib/time-systems.js";

  let { time, motion = true } = $props();
  let state = $derived(getSexagenaryState(time));
  // The two annuli engage in the last 180 ms before the next pair registers.
  // A selected whole second always shows its pair exactly under the index.
  let engagement = $derived(motion ? Math.max(0, (state.progress - .82) / .18) : 0);
  let easedStep = $derived(engagement * engagement * (3 - 2 * engagement));
  let stemAngle = $derived(-state.stemRotation - easedStep * 36);
  let branchAngle = $derived(state.branchRotation + easedStep * 30);
</script>

<div class="clock" aria-label={`现在是 ${time.hh}:${time.mm}:${time.ss}，六十秒干支编码行至${state.name}`}>
  <header>
    <div><b>六十甲子</b><span>SEXAGENARY CYCLE</span></div>
    <time>{time.hh}:{time.mm}<small>{time.ss}</small></time>
  </header>
  <main>
    <div class="mechanism">
      <div class="ring stems" style:--turn={`${stemAngle}deg`}>
        {#each heavenlyStems as stem, index}
          <span class:active={index === state.index % 10} style:--slot={`${index * 36}deg`}><i>{stem}</i></span>
        {/each}
      </div>
      <div class="ring branches" style:--turn={`${branchAngle}deg`}>
        {#each earthlyBranches as branch, index}
          <span class:active={index === state.index % 12} style:--slot={`${-index * 30}deg`}><i>{branch}</i></span>
        {/each}
      </div>
      <div class="register" aria-hidden="true"></div>
      <div class="center">
        <span>{String(state.index + 1).padStart(2, "0")} / 60</span>
        <strong>{state.name}</strong><b>{state.stem} · {state.branch}</b>
        <i><em style:transform={`scaleX(${state.progress})`}></em></i>
      </div>
    </div>
  </main>
  <section class="formula"><span>十天干</span><i>×</i><span>十二地支</span><i>→</i><b>六十相合</b></section>
  <footer><span>一秒一干支</span><b>当代压缩编码 · 非传统逐秒纪时</b><span>一分一周天</span></footer>
</div>

<style>
  .clock {
    position: relative;
    width: 960px;
    height: 960px;
    overflow: hidden;
    padding: 48px;
    color: #403322;
    background: radial-gradient(ellipse at 36% 28%, #f2e8cc, #d8c79b 62%, #b29b6b);
    font-family: "Songti SC", "STSong", serif;
  }
  header, footer, .formula {display: flex; align-items: center; justify-content: space-between}
  header {border-bottom: 1px solid #4c392459; padding-bottom: 20px}
  header div {display: grid; gap: 5px}
  header b {font-size: 35px; font-weight: 500; letter-spacing: .17em}
  header span, time, .center span, .center b, .formula, footer {font-family: monospace; letter-spacing: .1em}
  header span, footer {font-size: 19px; color: #5e4c32}
  time {font-size: 42px}
  time small {margin-left: 6px; color: #873b2b; font-size: 19px; vertical-align: top}
  main {display: grid; height: 670px; place-items: center; perspective: 1900px}
  .mechanism {
    position: relative;
    width: 630px;
    height: 630px;
    border: 2px solid #65513a;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 30%, #e5cfa1, #a58a59 63%, #625037 69%, #d1bb8d 70%);
    box-shadow: inset 2px 3px 2px #f8e8b8, inset -2px -4px 2px #735d3e, 0 7px #7a6340, 4px 16px 20px #48321a48;
    transform: rotateX(11deg);
  }
  .ring {
    position: absolute;
    display: grid;
    place-items: center;
    border: 1px solid #806b49;
    border-radius: 50%;
    background: repeating-conic-gradient(from -1deg, #5c482644 0 .35deg, transparent .35deg 6deg), #d9c396;
    box-shadow: inset 0 0 0 3px #f2dfb6, 0 3px 5px #51412c99;
    transform: rotate(var(--turn));
  }
  .ring::before {
    position: absolute;
    inset: 8px;
    border: 1px solid #a18a61;
    border-radius: 50%;
    background: #ddc9a1;
    content: "";
  }
  .stems {inset: 17px; --radius: -257px}
  .branches {inset: 92px; --radius: -180px}
  .branches::before {background: #c4b189}
  .ring span {
    position: absolute;
    inset: calc(50% - 23px);
    display: grid;
    width: 46px;
    height: 46px;
    place-items: center;
    transform: rotate(var(--slot)) translateY(var(--radius));
  }
  .ring span i {
    color: #59472f;
    font-size: 31px;
    font-style: normal;
    text-shadow: 0 1px #f6e6ba;
    transform: rotate(calc(-1 * (var(--slot) + var(--turn))));
  }
  .ring span.active i {color: #842f22; font-weight: 700}
  .register {
    position: absolute;
    top: 25px;
    left: calc(50% - 27px);
    width: 54px;
    height: 136px;
    border: 2px solid #8d432f;
    border-radius: 4px;
    box-shadow: 1px 2px 2px #45321b44, inset 1px 1px #ffefc7a3;
    pointer-events: none;
  }
  .center {
    position: absolute;
    inset: 175px;
    display: grid;
    align-content: center;
    gap: 5px;
    border: 1px solid #715c3f;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 25%, #f3e7c8, #cebb91);
    box-shadow: inset 1px 3px 3px #ffedc4, 2px 5px 8px #705c42;
    text-align: center;
  }
  .center span, .center b, .formula {font-size: 18px}
  .center strong {color: #873627; font-size: 88px; font-weight: 500; line-height: 1.15}
  .center i {height: 3px; margin: 10px 60px 0; background: #6f593642}
  .center em {display: block; height: 100%; background: #943d2d; transform-origin: left}
  .formula {justify-content: center; gap: 18px}
  .formula i {color: #943d2d; font-style: normal}
  footer {position: absolute; right: 48px; bottom: 38px; left: 48px; padding-top: 18px; border-top: 1px solid #4c39244c; font-size: 18px}
  @media (max-width: 520px) {
    header b {font-size: 50px}
    header span, footer {display: none}
    time {font-size: 58px}
    time small, .formula {font-size: 36px}
    .ring span i {font-size: 37px}
    .center span, .center b {font-size: 28px}
  }
</style>
