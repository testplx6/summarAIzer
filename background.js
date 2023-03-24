const apiKey = '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';

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
      temperature: 0.3, //0.7
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

const promptSalt = "format and stylish your answer text with html in order to make it visually extremly clear";
const maxTokens = 600;
const menuItems = [
  {
    id: 'resumeTexte',
    title: '1. Summarize the text for a second-grade student',
    promptTemplate: 'Summarize this for a second-grade student' + promptSalt,
    maxTokens: maxTokens
  },
  {
    id: 'expliquerComme5Ans',
    title: '2. Explique moi ce sujet comme si j\'avais 5 ans',
    promptTemplate: 'Explain this topic like I\'m 5 years old' + promptSalt,
    maxTokens: maxTokens
  },
  {
    id: 'expliquerCommeExpert',
    title: '3. Explique moi ce sujet comme un expert',
    promptTemplate: 'Explain this topic in detail like an expert, format your answer with html elements and colors and highlight keywords in order to make it extremly clear',
    maxTokens: maxTokens
  },
  {
    id: 'solveIt',
    title: '4. Résous ce problème',
    promptTemplate: 'Define the problem and then propose a solution to this problem' + promptSalt,
    maxTokens: maxTokens
  },
  {
    id: 'examples',
    title: '5. Give some examples',
    promptTemplate: 'Give some more examples based on your knowledge about this information' + promptSalt,
    maxTokens: maxTokens
  },
  {
    id: 'codeIt',
    title: '6. Code it',
    promptTemplate: 'Give me the code to program this, indent the code with html and display it in a code block',
    maxTokens: maxTokens
  },
  {
    id: 'factCheck',
    title: '7. Fact check this',
    promptTemplate: 'Are those facts correct? Compare them to your knowledge and tell me if it cann be true or false' + promptSalt,
    maxTokens: maxTokens
  },
  {
    id: 'informations/disinformation',
    title: '8. Informations/disinformation',
    promptTemplate: 'Tell me how much this information can be trusted in your own opinion' + promptSalt,
    maxTokens: maxTokens
  },
  {
    id: 'dall-e prompt',
    title: '9. dall-e prompt',
    promptTemplate: 'Build a prompt in order to represent this information with dall-E engine',
    maxTokens: maxTokens
  },
  {
    id: 'quizz it',
    title: '10. Quizz it',
    promptTemplate: 'Build a quizz and hide the answers until i check the correct answer using html in order to verify if the user undrstand well the inormations submitted, when the user check the correct answer display it in green with the word congratulations' + promptSalt,
    maxTokens: maxTokens
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



