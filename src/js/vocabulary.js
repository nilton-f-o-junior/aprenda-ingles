/* vocabulary.html */

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


/* Language */

class LanguageLearning {

  constructor () {
    this.lessonsData = null;
    this.currentLesson = null;
    this.currentAudio = null;
    this.progress = this.loadProgress();

    this.elements = {
        menuContainer: document.getElementById('menuContainer'),
        playAudio: document.getElementById('playAudio'),
        originalText: document.getElementById('originalText'),
        translationInput: document.getElementById('translationInput'),
        returnButton: document.getElementById('returnButton'),
        repeatButton: document.getElementById('repeatButton'),
        advanceButton: document.getElementById('advanceButton'),
        playHint: document.getElementById('playHint'),
        hintText: document.getElementById('hintText'),
    };

    this.init();
  }


  async init() {
    await this.loadLessons();
    this.setupEventListeners();
  }


  async loadLessons() {
    try {
      const response = await fetch('../assets/data/module-01.json');
      this.lessonsData = await response.json();
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
      this.showError('Não foi possivel carregar. Verificar arquivo .json!');
    }
  }


//==========
//Menu Lateral



  
}
