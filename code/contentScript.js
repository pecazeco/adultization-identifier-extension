const checkElement = (img) => {
  // Seletor para os posts do Instagram.
  // Pode ser necessário ajustá-lo no futuro se o Instagram mudar sua estrutura.
  // const postSelector = 'article[role="presentation"], article[role="presentation"] > div:nth-child(2)'; 
  // const posts = document.querySelectorAll(postSelector);

  const imageUrl = img.currentSrc // url da imagem atual
  
  if (checkIfAdultization(imageUrl)) { // checa se contem conteudo de sexualizacao
    // Censor
    censorElement(img);
  } else {
    // Not censored -> show that it was checked 
    showCheck(img);
  }
  
};

const checkIfAdultization = (imageURL) => {
  return true
}; // retorna sim se é necessário 

const censorElement = (element) => {
  // Blur na imagem
  element.style.filter = 'blur(20px)';

  // Garante que o pai da imagem seja relativo
  const parent = element.parentElement;
  if (parent) {
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
  }

  // Cria container do alerta
  const alertContainer = document.createElement('div');
  alertContainer.style.position = 'absolute';
  alertContainer.style.top = '0';
  alertContainer.style.left = '0';
  alertContainer.style.width = '100%';
  alertContainer.style.height = '100%';
  alertContainer.style.display = 'flex';
  alertContainer.style.flexDirection = 'column';
  alertContainer.style.justifyContent = 'center';
  alertContainer.style.alignItems = 'center';
  alertContainer.style.pointerEvents = 'none';
  // alertContainer.style.zIndex = '10000';

  // Símbolo
  const warningImage = document.createElement('img');
  warningImage.src = chrome.runtime.getURL('images/warning-sign.png');
  warningImage.style.width = '20%';
  warningImage.style.height = 'auto';

  // Texto
  const textContainer = document.createElement('div');
  textContainer.textContent = 'Essa imagem potencialmente sexualiza crianças';
  textContainer.style.color = 'red';
  textContainer.style.fontWeight = 'bold';
  textContainer.style.textAlign = 'center';
  textContainer.style.marginTop = '10px';
  textContainer.style.fontSize = '1.2em';
  textContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  textContainer.style.padding = '5px 10px';
  textContainer.style.borderRadius = '5px';

  // Monta a hierarquia
  alertContainer.appendChild(warningImage);
  alertContainer.appendChild(textContainer);
  parent.appendChild(alertContainer);
};

const showCheck = (element) => {};

// Executa a função imediatamente para desfocar os posts que já estão na página.
const initialElements = [...document.querySelectorAll('img[alt^="Photo by"]'), ...document.querySelectorAll('img[alt^="Photo shared by"]')];

initialElements.forEach(element => {
  checkElement(element);
}); 

// Cria um observador de mutação para lidar com o carregamento dinâmico de posts.
const observer = new MutationObserver((mutations) => {
  // itera sob cada mutação da pagina
  mutations.forEach((mutation) => {
    // se a mutação é sobre a lista de filhos da pagina e o numero é positivo (foram adicionados nós)
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // itera sobre cada nó adicionado
      mutation.addedNodes.forEach(node => {
        // Verifica se o nó adicionado é um elemento HTML
        if (node.nodeType === 1) { 
          // Pega os filhos desse nó que sao posts
          let posts = [...node.querySelectorAll('img[alt^="Photo by"]'), ...node.querySelectorAll('img[alt^="Photo shared by"]')];
          // checa cada post se deve censurar
          posts.forEach(img => checkElement(img));
        }
      });
    }
  });
});

// Configuração do observador: monitorar mudanças na lista de filhos do corpo da página.
const observerConfig = {
  childList: true,
  subtree: true
};

// Inicia o observador.
observer.observe(document.body, observerConfig);