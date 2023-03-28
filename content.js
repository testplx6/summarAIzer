(function () {
  // On vérifie que le script n'a pas déjà été exécuté
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  function showSummary(summary) {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 9999;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px;">
          <p>${summary}</p>
          <button id="closeModal" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Fermer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#closeModal').addEventListener('click', () => {
      modal.remove();
    });
  };

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message reçu:', request);
    if (request.action === 'showSummary') {
      const summary = request.summary;
      showSummary(summary);
    }
  });
})();