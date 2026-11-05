window.HUD_Specs = (() => {
  let element = null;

  function createPanel() {
    element = document.createElement('div');
    element.className = 'hud-panel';
    element.style.top = '20px';
    element.style.left = '20px';

    const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A';
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cœurs` : 'N/A';
    const platform = navigator.platform || 'Inconnu';
    const screenRes = `${window.screen.width}x${window.screen.height}`;

    element.innerHTML = `
      <strong>System Specs</strong><br>
      • Coeurs CPU : ${cores}<br>
      • RAM approx. : ${memory}<br>
      • Résolution : ${screenRes}<br>
      • Plateforme : ${platform}
    `;

    document.getElementById('hud-overlay').appendChild(element);
  }

  return {
    init: () => {
      if (!element) createPanel();
    },
    destroy: () => {
      if (element) {
        element.remove();
        element = null;
      }
    }
  };
})();
