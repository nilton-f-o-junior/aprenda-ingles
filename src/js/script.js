/* index.html */

const startButton = document.querySelector('.start-button');
const dividerButton = document.querySelector('.divider-button');
const playButton = document.querySelector('.play-button');

const categoriesUrl = './src/pages/categories.html';

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
const vocabularyUrl = '/src/pages/vocabulary.html';

if (vocabularyButton) {
  vocabularyButton.addEventListener('click', () => {
    window.location.href = vocabularyUrl;
  });
}

const expressionsButton = document.querySelector('.expressions-button');
const expressionsUrl = '/src/pages/expressions.html';

if (expressionsButton) {
  expressionsButton.addEventListener('click', () => {
    window.location.href = expressionsUrl;
  });
}
