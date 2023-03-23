const apiKey = 'Your API Key';

function summarizeText(text, promptTemplate, maxTokens) {
  return fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `${promptTemplate}: ${text}`,
      temperature: 0.7,
      max_tokens: maxTokens,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Réponse de l\'API:', data);
    return data.choices[0].text.trim();
  });
}

const menuItems = [
  {
    id: 'resumeTexte',
    title: '1. Summarize the text for a second-grade student',
    promptTemplate: 'Summarize this for a second-grade student',
    maxTokens: 600
  },
  {
    id: 'expliquerComme5Ans',
    title: '2. Explique moi ce sujet comme si j\'avais 5 ans',
    promptTemplate: 'Explain this topic like I\'m 5 years old',
    maxTokens: 600
  },
  {
    id: 'expliquerCommeExpert',
    title: '3. Explique moi ce sujet comme un expert',
    promptTemplate: 'Explain this topic in detail like an expert',
    maxTokens: 600
  },
  // Ajoutez les autres options de menu ici
];

chrome.runtime.onInstalled.addListener(function() {
  menuItems.forEach(item => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ['selection']
    });
  });
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  const selectedText = info.selectionText;
  console.log('Texte sélectionné:', selectedText);

  const menuItem = menuItems.find(item => item.id === info.menuItemId);

  if (menuItem) {
    try {
      const summary = await summarizeText(selectedText, menuItem.promptTemplate, menuItem.maxTokens);
      console.log('Résumé:', summary);
      chrome.tabs.sendMessage(tab.id, { action: 'showSummary', summary: summary });
    } catch (error) {
      console.error('Erreur lors de la génération du résumé du texte:', error);
    }
  }
});



