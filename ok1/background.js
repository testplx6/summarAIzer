const apiKey = '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';

function summarizeText(text) {
  return fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: `Résume ce texte en quelques phrases: ${text}`,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.7
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Réponse de l\'API:', data);
    return data.choices[0].text.trim();
  });
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'resumeTexte',
    title: 'Résumer le texte',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === 'resumeTexte') {
    const selectedText = info.selectionText;
    console.log('Texte sélectionné:', selectedText);

    try {
      const summary = await summarizeText(selectedText);
      console.log('Résumé:', summary);
    } catch (error) {
      console.error('Erreur lors de la génération du résumé du texte:', error);
    }
  }
});
