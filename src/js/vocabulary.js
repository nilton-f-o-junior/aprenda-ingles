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
        
    };
  }
}
