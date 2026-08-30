<script>
  let { enabled = true, children } = $props();
  let root = $state();

  const resetSurface = () => {
    if (!root) return;
    root.style.removeProperty("--tilt-x");
    root.style.removeProperty("--tilt-y");
    root.style.removeProperty("--spatial-duration");
  };

  const moveSurface = (event) => {
    if (
      !enabled ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    const tiltX = Math.max(-2.4, Math.min(2.4, vertical * -4.8));
    const tiltY = Math.max(-3.2, Math.min(3.2, horizontal * 6.4));

    root.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    root.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    root.style.setProperty("--spatial-duration", "90ms");
  };

  $effect(() => {
    if (!enabled) resetSurface();
  });
</script>

<div
  class="spatial-exhibit"
  class:spatial-enabled={enabled}
  role="presentation"
  bind:this={root}
  onpointermove={moveSurface}
  onpointerleave={resetSurface}
  onpointercancel={resetSurface}
>
  <div class="exhibit-stack">
    <div class="support-plane" aria-hidden="true"></div>
    <div class="exhibit-surface">
      {@render children?.()}
    </div>
  </div>
</div>

<style>
  .spatial-exhibit,
  .exhibit-stack,
  .exhibit-surface {
    width: 100%;
    height: 100%;
  }

  .spatial-exhibit {
    --tilt-x: 0deg;
    --tilt-y: 0deg;
    --spatial-duration: 420ms;
    position: relative;
  }

  .exhibit-stack {
    position: relative;
  }

  .exhibit-surface {
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .support-plane {
    display: none;
  }

  .spatial-enabled {
    perspective: 1400px;
  }

  .spatial-enabled .exhibit-stack {
    transform: rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
    transform-style: preserve-3d;
    transition: transform var(--spatial-duration) cubic-bezier(.2, .72, .18, 1);
    will-change: auto;
  }

  .spatial-enabled .support-plane {
    position: absolute;
    display: block;
    inset: 10px -10px -12px 12px;
    border: 1px solid rgb(58 42 22 / 20%);
    background:
      linear-gradient(132deg, rgb(255 255 255 / 22%), transparent 28%),
      #a99a7e;
    box-shadow: 18px 28px 54px rgb(48 34 16 / 28%);
    transform: translateZ(-22px);
  }

  .spatial-enabled .exhibit-surface {
    background:
      radial-gradient(circle at 50% 42%, rgb(255 255 255 / 12%), transparent 34%),
      var(--paper-light);
    box-shadow:
      0 22px 52px rgb(46 34 18 / 22%),
      0 0 0 1px rgb(65 43 19 / 18%);
    transform: translateZ(9px);
  }

  @media (hover: none), (pointer: coarse) {
    .spatial-enabled .exhibit-stack {
      transform: none;
      transition: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spatial-enabled .exhibit-stack {
      transform: none;
      transition: none;
    }
  }

  @supports not (transform-style: preserve-3d) {
    .spatial-enabled {
      perspective: none;
    }

    .spatial-enabled .exhibit-stack,
    .spatial-enabled .support-plane,
    .spatial-enabled .exhibit-surface {
      transform: none;
    }
  }
</style>
