<main id="main" class="not-found">
  <span aria-hidden="true">空</span>
  <h1>这里还没有时钟</h1>
  <p>The requested clock is not part of the collection.</p>
  <a href="/">返回时间造物集</a>
</main>

<style>
  .not-found {
    display: grid;
    min-height: calc(100vh - 180px);
    place-content: center;
    justify-items: center;
    padding: 60px 20px;
    text-align: center;
  }

  .not-found > span {
    color: var(--cinnabar);
    font-family: var(--serif);
    font-size: 100px;
    opacity: 0.28;
  }

  h1 {
    margin: -10px 0 8px;
    font-family: var(--serif);
    font-size: 42px;
    font-weight: 500;
  }

  p {
    color: var(--ink-faint);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.08em;
  }

  a {
    margin-top: 28px;
    border-bottom: 1px solid var(--ink);
    color: var(--ink);
    text-decoration: none;
  }
</style>
