document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('#sidebar input[type="checkbox"]');

  // Registre des modules disponibles
  const modules = {
    fps: window.HUD_FPS,
    specs: window.HUD_Specs,
    keyboard: window.HUD_Keyboard,
    mouse: window.HUD_Mouse
  };

  // Écoute des changements dans le menu latéral
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const moduleKey = e.target.getAttribute('data-module');
      const module = modules[moduleKey];

      if (!module) return;

      if (e.target.checked) {
        module.init();
      } else {
        module.destroy();
      }
    });
  });
});
