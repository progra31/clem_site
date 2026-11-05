window.HUD_Mouse = (() => {
  let element = null;

  function handleMouseMove(e) {
    if (!element) return;
    const deskRect = document.getElementById('desk').getBoundingClientRect();
    const relativeX = Math.round(e.clientX - deskRect.left);
    const relativeY = Math.round(e.clientY - deskRect.top);

    element.innerHTML = `
      <strong>Tracker Souris</strong><br>
      Écran : X: ${e.clientX} | Y: ${e.clientY}<br>
      Bureau : X: ${relativeX} | Y: ${relativeY}
    `;
  }

  function createPanel() {
    element = document.createElement('div');
    element.className = 'hud-panel';
    element.style.bottom = '20px';
    element.style.right = '20px';
    element.innerHTML = '<strong>Tracker Souris</strong><br>Bougez la souris...';
    document.getElementById('hud-overlay').appendChild(element);
  }

  return {
    init: () => {
      if (!element) {
        createPanel();
        window.addEventListener('mousemove', handleMouseMove);
      }
    },
    destroy: () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (element) {
        element.remove();
        element = null;
      }
    }
  };
})();
