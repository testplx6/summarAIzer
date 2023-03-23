function handleResumeText() {
  const selectedText = window.getSelection().toString();
  console.log('Texte sélectionné:', selectedText);
  if (selectedText) {
    chrome.runtime.sendMessage(
      { action: 'resumeTexte', text: selectedText }, // Modifiez cette ligne
      response => {
        console.log('Réponse du script d\'arrière-plan:', response);
        if (response.error) {
          alert(response.error);
        } else {
          alert(`Résumé:\n${response.summary}`);
        }
      }
    );
  } else {
    alert("Aucun texte sélectionné. Veuillez sélectionner un texte avant d'utiliser le résumeur.");
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message reçu:', request);
  if (request.action === 'resumeTexte') {
    handleResumeText();
  } else if (request.action === 'contentScriptReady') {
    sendResponse({ ready: true });
  }
});

// Indique que le script de contenu est prêt à recevoir des messages
chrome.runtime.sendMessage({ action: 'contentScriptReady' });
