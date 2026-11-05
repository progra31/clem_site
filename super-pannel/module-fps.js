window.HUD_FPS = (() => {
  let element = null;
  let animationId = null;
  let lastTime = performance.now();
  let frames = 0;

  function createPanel() {
    element = document.createElement('div');
    element.className = 'hud-panel';
    element.style.top = '20px';
    element.style.right = '20px';
    element.innerText = 'FPS: --';
    document.getElementById('hud-overlay').appendChild(element);
  }

  function update() {
    const now = performance.now();
    frames++;
    if (now >= lastTime + 1000) {
      if (element) element.innerText = `FPS: ${frames}`;
      frames = 0;
      lastTime = now;
    }
    animationId = requestAnimationFrame(update);
  }

  return {
    init: () => {
      if (!element) createPanel();
      lastTime = performance.now();
      frames = 0;
      update();
    },
    destroy: () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (element) {
        element.remove();
        element = null;
      }
    }
  };
})();
