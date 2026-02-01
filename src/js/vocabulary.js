/* menu */
const menuOpenIcon = document.getElementById('menuOpenIcon');
const menuCloseIcon = document.getElementById('menuCloseIcon');
const sideBar = document.getElementById('sideBar');
const overlay = document.getElementById('overlay');
const menuContainer = document.getElementById('menuContainer');

function toggleMenu(){
  sideBar.classList.toggle('active');
  overlay.classList.toggle('active');
}

menuOpenIcon.addEventListener('click', toggleMenu);
menuCloseIcon.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);


/* */
class LanguageLearning {

  constructor () {
    this.lessonsData = null;
    this.currentLesson = null;
    this.currentAudio = null;
    this.progress = this.loadProgress();

    this.elements = {
        menuContainer: document.getElementById('menuContainer'),
        playAudio: document.getElementById('playAudio'),
        englishPhrase: document.getElementById('englishPhrase'),
        translationInput: document.getElementById('translationInput'),
        returnButton: document.getElementById('returnButton'),
        repeatButton: document.getElementById('repeatButton'),
        advanceButton: document.getElementById('advanceButton'),
        playHint: document.getElementById('playHint'),
        hintText: document.getElementById('hintText'),
        userInput: document.getElementById('userInput'),
    };
    
    // Log para debug
    console.log('Elementos encontrados:', {
      menuContainer: !!this.elements.menuContainer,
      englishPhrase: !!this.elements.englishPhrase,
      translationInput: !!this.elements.translationInput
    });

    this.init();
  }


  async init() {
    await this.loadLessons();
    this.setupEventListeners();
  }


  async loadLessons() {
    try {
      const possiblePaths = [
        '../assets/data/module-01.json'
      ];
      
      let response;
      let loadedPath = null;
      
      for (const path of possiblePaths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            loadedPath = path;
            console.log('Arquivo carregado de:', path);
            break;
          }
        } catch (e) {
          console.log('Tentando próximo caminho...');
        }
      }
      
      if (!response || !response.ok) {
        throw new Error('Arquivo JSON não encontrado em nenhum dos caminhos');
      }
      
      this.lessonsData = await response.json();
      console.log('Dados carregados:', this.lessonsData);
      
      this.populateMenu();

      const lastLessonId = localStorage.getItem('lastLessonId');
      if (lastLessonId) {
        this.loadLesson(lastLessonId);
      } else if (this.lessonsData.modules.length > 0 &&
                 this.lessonsData.modules[0].lessons.length > 0) {
                 
        this.loadLesson(this.lessonsData.modules[0].lessons[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar lições:', error);
      this.showError('Não foi possivel carregar. Verificar arquivo .json! Erro: ' + error.message);
    }
  }


  //==========
  // Menu Lateral
  populateMenu() {
    if (!this.elements.menuContainer) {
      console.error('Elemento menuContainer não encontrado!');
      return;
    }
    
    this.elements.menuContainer.innerHTML = '';

    this.lessonsData.modules.forEach(module => {

      // titulos dos modulos
      const moduleTitle = this.createModuleTitle(module);
      this.elements.menuContainer.appendChild(moduleTitle);

      // itens dos modulos
      module.lessons.forEach(lesson => {
       const lessonItem = this.createLessonItem(lesson);
       this.elements.menuContainer.appendChild(lessonItem); 
      });
    });
    
    console.log('Menu populado com sucesso!');
  }

  createModuleTitle(module) {
    const moduleTitle = document.createElement('div');
    moduleTitle.className = 'module-title';
    moduleTitle.textContent = module.title;
    return moduleTitle;
  }

  createLessonItem(lesson) {
    const lessonItem = document.createElement('div'); // CORRIGIDO: era lesson.Item
    lessonItem.className = 'lesson-item';
    lessonItem.textContent = lesson.portugues;
    lessonItem.dataset.lessonId = lesson.id;


    // marcar como completa
    //if (this.progress.completed.includes(lesson.id)) {
    //  lessonItem.classList.add('completed');
    //}

    lessonItem.addEventListener('click', () => {
      this.loadLesson(lesson.id);
      this.updateActiveMenuItem(lesson.id);
      toggleMenu(); // Fechar menu após selecionar
    });

    return lessonItem;
  }


  // carregar e exibir lição
  loadLesson(lessonId) {
    const lesson = this.findLesson(lessonId);
    if (lesson) {
      this.currentLesson = lesson;
      this.displayLesson(lesson);
      this.updateActiveMenuItem(lessonId);
      localStorage.setItem('lastLessonId', lessonId);
    }
  }

  findLesson(lessonId) {
    for (let module of this.lessonsData.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  }

  displayLesson(lesson) {
    // atualizar conteudo
    if (this.elements.englishPhrase) {
      this.elements.englishPhrase.textContent = lesson.english;
    }
    if (this.elements.hintText) {
      this.elements.hintText.textContent = lesson.hint;
    }
    if (this.elements.userInput) {
      this.elements.userInput.value = '';
    }

    // resetar interface
    this.resetUI();

    // animacao de entrada
    this.animateElement(this.elements.englishPhrase, 'fadeIn');
  }


  // Métodos auxiliares
  loadProgress() {
    const saved = localStorage.getItem('learningProgress');
    return saved ? JSON.parse(saved) : { completed: [], current: null };
  }

  saveProgress() {
    localStorage.setItem('learningProgress', JSON.stringify(this.progress));
  }

  setupEventListeners() {
    // Adicionar event listeners conforme necessário
    if (this.elements.returnButton) {
      this.elements.returnButton.addEventListener('click', () => this.previousLesson());
    }
    
    if (this.elements.advanceButton) {
      this.elements.advanceButton.addEventListener('click', () => this.nextLesson());
    }
    
    if (this.elements.repeatButton) {
      this.elements.repeatButton.addEventListener('click', () => this.playCurrentAudio());
    }
  }

  updateActiveMenuItem(lessonId) {
    // Remover active de todos
    document.querySelectorAll('.lesson-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Adicionar active ao selecionado
    const activeItem = document.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }

  showError(message) {
    console.error(message);
    alert(message);
  }

  resetUI() {
    // Resetar estados da interface
    if (this.elements.translationInput) {
      this.elements.translationInput.classList.remove('correct', 'incorrect');
    }
  }

  animateElement(element, animationClass) {
    if (!element) return;
    
    element.classList.remove(animationClass);
    // Forçar reflow
    void element.offsetWidth;
    element.classList.add(animationClass);
  }

  playCurrentAudio() {
    if (this.currentLesson && this.currentLesson.audio) {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
      this.currentAudio = new Audio(this.currentLesson.audio);
      this.currentAudio.play();
    }
  }

  previousLesson() {
    if (!this.currentLesson) return;
    
    const allLessons = [];
    this.lessonsData.modules.forEach(module => {
      allLessons.push(...module.lessons);
    });
    
    const currentIndex = allLessons.findIndex(l => l.id === this.currentLesson.id);
    if (currentIndex > 0) {
      this.loadLesson(allLessons[currentIndex - 1].id);
    }
  }

  nextLesson() {
    if (!this.currentLesson) return;
    
    const allLessons = [];
    this.lessonsData.modules.forEach(module => {
      allLessons.push(...module.lessons);
    });
    
    const currentIndex = allLessons.findIndex(l => l.id === this.currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      this.loadLesson(allLessons[currentIndex + 1].id);
    }
  }

  markAsCompleted(lessonId) {
    if (!this.progress.completed.includes(lessonId)) {
      this.progress.completed.push(lessonId);
      this.saveProgress();
      
      // Atualizar visual
      const lessonItem = document.querySelector(`[data-lesson-id="${lessonId}"]`);
      if (lessonItem && !lessonItem.classList.contains('completed')) {
        lessonItem.classList.add('completed');
        lessonItem.innerHTML = lessonItem.textContent + ' ✓';
      }
    }
  }
}


// inicializar aplicacao
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LanguageLearning(); // CORRIGIDO: nome da classe
});
