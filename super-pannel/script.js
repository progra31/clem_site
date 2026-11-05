document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('#sidebar input[type="checkbox"]');

  // Mappage des identifiants HTML vers les objets globaux créés par les modules .js
  const modules = {
    fps: window.HUD_FPS,
    specs: window.HUD_Specs,
    keyboard: window.HUD_Keyboard,
    mouse: window.HUD_Mouse
  };

  // Gestion des événements de bascule (toggle)
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const moduleKey = e.target.getAttribute('data-module');
      const module = modules[moduleKey];

      if (!module) {
        console.warn(`Le module '${moduleKey}' n'a pas été trouvé ou chargé.`);
        return;
      }

      if (e.target.checked) {
        module.init();
      } else {
        module.destroy();
      }
    });
  });
});
