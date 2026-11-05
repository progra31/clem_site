window.HUD_Keyboard = (() => {
  let element = null;
  let keyList = [];
  const maxKeys = 5;

  function handleKeyDown(e) {
    if (!element) return;
    const key = e.key === ' ' ? 'Espace' : e.key;
    keyList.push(key);
    if (keyList.length > maxKeys) {
      keyList.shift();
    }
    updateDisplay();
  }

  function updateDisplay() {
    if (!element) return;
    element.innerHTML = `
      <strong>Tracker Clavier</strong><br>
      Dernières touches : [ ${keyList.join(' ] [ ')} ]
    `;
  }

  function createPanel() {
    element = document.createElement('div');
    element.className = 'hud-panel';
    element.style.bottom = '20px';
    element.style.left = '20px';
    element.innerHTML = '<strong>Tracker Clavier</strong><br>Appuyez sur une touche...';
    document.getElementById('hud-overlay').appendChild(element);
  }

  return {
    init: () => {
      if (!element) {
        createPanel();
        keyList = [];
        window.addEventListener('keydown', handleKeyDown);
      }
    },
    destroy: () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (element) {
        element.remove();
        element = null;
      }
    }
  };
})();
