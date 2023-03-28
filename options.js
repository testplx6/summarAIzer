function loadMenuItems() {
  chrome.storage.sync.get('apiKey', (data) => {
    apiKey = data.apiKey || '';
    document.getElementById('apiKey').value = apiKey;
  });
  // Chargez les éléments de menu enregistrés à partir du stockage local
  chrome.storage.sync.get('menuItems', (data) => {
    const menuItemsContainer = document.getElementById('menuItemsContainer');
    const menuItems = data.menuItems || [];



    menuItems.forEach((menuItem, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('menuItem');
      itemDiv.dataset.id = menuItem.id;

      const titleInput = document.createElement('input');
      titleInput.setAttribute('type', 'text');
      titleInput.setAttribute('placeholder', 'Titre');
      titleInput.value = menuItem.title;

      const promptInput = document.createElement('textarea');
      promptInput.setAttribute('placeholder', 'Modèle de prompt');
      promptInput.value = menuItem.promptTemplate;

      const maxTokensInput = document.createElement('input');
      maxTokensInput.setAttribute('type', 'number');
      maxTokensInput.setAttribute('placeholder', 'Nombre maximum de tokens');
      maxTokensInput.value = menuItem.maxTokens;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Supprimer';
      deleteButton.addEventListener('click', () => {
        itemDiv.remove();
      });

      itemDiv.appendChild(titleInput);
      itemDiv.appendChild(promptInput);
      itemDiv.appendChild(maxTokensInput);
      itemDiv.appendChild(deleteButton);
      menuItemsContainer.appendChild(itemDiv);
    });
  });
}

function addMenuItem() {
  const menuItemsContainer = document.getElementById('menuItemsContainer');
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('menuItem');

  const titleInput = document.createElement('input');
  titleInput.setAttribute('type', 'text');
  titleInput.setAttribute('placeholder', 'Title');
  titleInput.setAttribute('title', 'title');

  const promptInput = document.createElement('textarea');
  promptInput.setAttribute('placeholder', 'Enter your prompt here');
  promptInput.setAttribute('title', 'prompt');

  const maxTokensInput = document.createElement('input');
  maxTokensInput.setAttribute('type', 'number');
  maxTokensInput.setAttribute('placeholder', 'Maximum tokens');
  maxTokensInput.setAttribute('title', 'maximum tokens');
  maxTokensInput.setAttribute('value', '600');

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Remove';
  deleteButton.addEventListener('click', () => {
    itemDiv.remove();
  });

  itemDiv.appendChild(titleInput);
  itemDiv.appendChild(promptInput);
  itemDiv.appendChild(maxTokensInput);
  itemDiv.appendChild(deleteButton);
  menuItemsContainer.appendChild(itemDiv);
}

function saveMenuItems() {
  const menuItemsContainer = document.getElementById('menuItemsContainer');
  const menuItemDivs = menuItemsContainer.querySelectorAll('.menuItem');

  const apiKey = document.getElementById('apiKey').value;
  const menuItems = Array.from(menuItemDivs).map((itemDiv) => {
    const id = itemDiv.dataset.id || `menuItem-${Date.now()}`;
    return {
      id: id,
      title: itemDiv.children[0].value,
      promptTemplate: itemDiv.children[1].value,
      maxTokens: parseInt(itemDiv.children[2].value)
    };
  });

  chrome.storage.sync.set({ apiKey: apiKey, menuItems: menuItems }, () => {
    console.log('Options enregistrées.');
    chrome.runtime.reload();
  });
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addMenuItem').addEventListener('click', addMenuItem);
  document.getElementById('saveMenuItems').addEventListener('click', saveMenuItems);

  loadMenuItems();
});
