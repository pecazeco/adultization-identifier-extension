function applyBlurToPosts() {
  // Seletor para os posts do Instagram.
  // Pode ser necessário ajustá-lo no futuro se o Instagram mudar sua estrutura.
  // const postSelector = 'article[role="presentation"], article[role="presentation"] > div:nth-child(2)'; 
  // const posts = document.querySelectorAll(postSelector);
  const posts = document.querySelectorAll('img[alt^="Photo by"]');


  posts.forEach(post => {
    // Aplica o filtro CSS para desfocar o conteúdo.
    // Você pode ajustar o valor (20px) para mais ou menos desfoque.
    post.style.filter = 'blur(20px)';
  });
}

// Executa a função imediatamente para desfocar os posts que já estão na página.
applyBlurToPosts();

// Cria um observador de mutação para lidar com o carregamento dinâmico de posts.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      applyBlurToPosts();
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