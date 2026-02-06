/* index.html */

const startButton = document.querySelector('.start-button');
const dividerButton = document.querySelector('.divider-button');
const playButton = document.querySelector('.play-button');

// Obtém o caminho base do repositório automaticamente
const getBasePath = () => {
  const path = window.location.pathname;
  const pathArray = path.split('/').filter(Boolean);
  // Se estiver em github.io/repo-name/, retorna /repo-name/
  // Se estiver em domínio customizado, retorna /
  return pathArray.length > 0 && !path.endsWith('.html') ? `/${pathArray[0]}/` : '/';
};

const basePath = getBasePath();
const categoriesUrl = `${basePath}src/pages/categories.html`;

if (startButton && dividerButton && playButton) {
  startButton.addEventListener('click', () => {
    window.location.href = categoriesUrl;
  });

  dividerButton.addEventListener('click', () => {
    window.location.href = categoriesUrl;
  });

  playButton.addEventListener('click', () => {
    window.location.href = categoriesUrl;
  });
}


/* categories.html  */

const vocabularyButton = document.querySelector('.vocabulary-button');
const vocabularyUrl = `${basePath}src/pages/vocabulary.html`;

if (vocabularyButton) {
  vocabularyButton.addEventListener('click', () => {
    window.location.href = vocabularyUrl;
  });
}

const expressionsButton = document.querySelector('.expressions-button');
const expressionsUrl = `${basePath}src/pages/expressions.html`;

if (expressionsButton) {
  expressionsButton.addEventListener('click', () => {
    window.location.href = expressionsUrl;
  });
}
