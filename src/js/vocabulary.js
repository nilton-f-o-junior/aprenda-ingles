/* menu */
const menuOpenIcon = document.getElementById('menuOpenIcon');
const menuCloseIcon = document.getElementById('menuCloseIcon');
const sideBar = document.getElementById('sideBar');
const overlay = document.getElementById('overlay');
const menuContainer = document.getElementById('menuContainer');

function toggleMenu() {
    sideBar.classList.toggle('active');
    overlay.classList.toggle('active');
}

if (menuOpenIcon) menuOpenIcon.addEventListener('click', toggleMenu);
if (menuCloseIcon) menuCloseIcon.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

/* Classe Principal */
class LanguageLearning {
    constructor() {
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
            userInput: document.getElementById('translationInput'),
        };

        this.init();
    }

    async init() {
        await this.loadLessons();
        this.setupEventListeners();
        this.setInitialButtonColors();
    }

    setInitialButtonColors() {
        // Cor inicial do return-button
        if (this.elements.returnButton) {
            this.elements.returnButton.querySelector('.btn-bg').style.fill = '#89B4FA';
        }
    }

    async loadLessons() {
        try {
            const possiblePaths = ['/src/assets/data/vocabulary.json'];
            let response;

            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) break;
                } catch (e) {
                    console.log('Tentando próximo caminho...');
                }
            }

            if (!response || !response.ok) throw new Error('JSON não encontrado');

            this.lessonsData = await response.json();
            this.populateMenu();

            const lastLessonId = localStorage.getItem('lastLessonId');
            if (lastLessonId) {
                this.loadLesson(lastLessonId);
            } else if (this.lessonsData.modules[0]?.lessons[0]) {
                this.loadLesson(this.lessonsData.modules[0].lessons[0].id);
            }
        } catch (error) {
            this.showError('Erro ao carregar lições: ' + error.message);
        }
    }

    populateMenu() {
        if (!this.elements.menuContainer) return;
        this.elements.menuContainer.innerHTML = '';

        this.lessonsData.modules.forEach(module => {
            const moduleTitle = document.createElement('div');
            moduleTitle.className = 'module-title';
            moduleTitle.textContent = module.title;
            this.elements.menuContainer.appendChild(moduleTitle);

            module.lessons.forEach(lesson => {
                const lessonItem = document.createElement('div');
                lessonItem.className = 'lesson-item';
                lessonItem.textContent = lesson.english;
                lessonItem.dataset.lessonId = lesson.id;

                lessonItem.addEventListener('click', () => {
                    this.loadLesson(lesson.id);
                    toggleMenu();
                });
                this.elements.menuContainer.appendChild(lessonItem);
            });
        });
    }

    loadLesson(lessonId) {
        let foundLesson = null;
        for (let module of this.lessonsData.modules) {
            foundLesson = module.lessons.find(l => l.id === lessonId);
            if (foundLesson) break;
        }

        if (foundLesson) {
            this.currentLesson = foundLesson;
            this.displayLesson(foundLesson);
            this.updateActiveMenuItem(lessonId);
            localStorage.setItem('lastLessonId', lessonId);
        }
    }

    displayLesson(lesson) {
        if (this.elements.englishPhrase) this.elements.englishPhrase.textContent = lesson.english;
        if (this.elements.hintText) this.elements.hintText.textContent = 'Dica!?'; // Sempre começa com "Dica!?"
        
        this.resetUI();
        this.animateElement(this.elements.englishPhrase, 'fadeIn');
    }

    setupEventListeners() {
        // Play Audio
        if (this.elements.playAudio) this.elements.playAudio.onclick = () => this.playCurrentAudio();
        if (this.elements.repeatButton) this.elements.repeatButton.onclick = () => {
            this.playCurrentAudio();
            // Limpar o input quando clicar em repetir
            if (this.elements.userInput) {
                this.elements.userInput.value = '';
                this.elements.userInput.focus();
            }
        };

        // Navegação
        if (this.elements.returnButton) this.elements.returnButton.onclick = () => this.previousLesson();
        if (this.elements.advanceButton) this.elements.advanceButton.onclick = () => this.nextLesson();

        // Hint - Mostrar dica ao clicar
        if (this.elements.playHint) {
            this.elements.playHint.onclick = () => this.toggleHint();
        }

        // Verificação por ENTER
        if (this.elements.userInput) {
            this.elements.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkTranslation();
                }
            });

            // Limpa a cor de erro quando o usuário volta a digitar
            this.elements.userInput.addEventListener('input', () => {
                this.elements.userInput.style.borderColor = '';
                this.elements.userInput.style.backgroundColor = '';
            });
        }
    }

    checkTranslation() {
        if (!this.currentLesson || !this.elements.userInput) return;

        // Comparação usando o campo 'portugues'
        const userText = this.elements.userInput.value.trim().toLowerCase();
        const correctText = this.currentLesson.portugues.trim().toLowerCase();

        if (userText === correctText) {
            // ACERTOU
            this.elements.translationInput.style.borderColor = '#2ecc71';
            this.elements.translationInput.style.backgroundColor = '#d4edda'; // Verde claro
            
            // Mudar cores dos botões quando ACERTA
            if (this.elements.repeatButton) {
                this.elements.repeatButton.querySelector('.btn-bg').style.fill = '#FAB387';
            }
            if (this.elements.advanceButton) {
                this.elements.advanceButton.querySelector('.btn-bg').style.fill = '#A6E3A1';
                this.elements.advanceButton.disabled = false; // Habilitar botão avançar
            }
            
            this.markAsCompleted(this.currentLesson.id);
        } else {
            // ERROU
            this.elements.translationInput.style.borderColor = '#e74c3c';
            this.elements.translationInput.style.backgroundColor = '#f8d7da'; // Vermelho claro
            
            // Mudar cor do botão quando ERRA
            if (this.elements.repeatButton) {
                this.elements.repeatButton.querySelector('.btn-bg').style.fill = '#EBA0AC';
            }
            if (this.elements.advanceButton) {
                this.elements.advanceButton.disabled = true; // Desabilitar botão avançar
            }
        }
    }

    resetUI() {
        if (this.elements.translationInput) {
            this.elements.translationInput.style.borderColor = '';
            this.elements.translationInput.style.backgroundColor = '';
        }
        if (this.elements.userInput) {
            this.elements.userInput.value = '';
            this.elements.userInput.focus();
        }
        
        // Resetar cores dos botões
        if (this.elements.returnButton) {
            this.elements.returnButton.querySelector('.btn-bg').style.fill = '#89B4FA';
        }
        if (this.elements.repeatButton) {
            this.elements.repeatButton.querySelector('.btn-bg').style.fill = '';
        }
        if (this.elements.advanceButton) {
            this.elements.advanceButton.querySelector('.btn-bg').style.fill = '';
            this.elements.advanceButton.disabled = true; // Desabilitar no início
        }
    }

    playCurrentAudio() {
        if (!this.currentLesson?.audio) return;
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        this.currentAudio = new Audio(this.currentLesson.audio);
        this.currentAudio.play().catch(e => console.error('Erro ao tocar áudio:', e));
    }

    toggleHint() {
        if (!this.elements.hintText) return;
        
        // Se está mostrando "Dica!?", mostra a dica real
        if (this.elements.hintText.textContent === 'Dica!?') {
            if (this.currentLesson?.hint) {
                this.elements.hintText.textContent = this.currentLesson.hint;
            }
        } else {
            // Se está mostrando a dica, volta para "Dica!?"
            this.elements.hintText.textContent = 'Dica!?';
        }
    }

    // Métodos de Navegação
    nextLesson() {
        this.navigate(1);
    }

    previousLesson() {
        this.navigate(-1);
        // Limpar o input quando retornar
        if (this.elements.userInput) {
            this.elements.userInput.value = '';
        }
    }

    navigate(direction) {
        const allLessons = [];
        this.lessonsData.modules.forEach(m => allLessons.push(...m.lessons));
        const index = allLessons.findIndex(l => l.id === this.currentLesson?.id);
        const nextTarget = allLessons[index + direction];
        if (nextTarget) this.loadLesson(nextTarget.id);
    }

    updateActiveMenuItem(lessonId) {
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.toggle('active', item.dataset.lessonId === lessonId);
        });
    }

    markAsCompleted(lessonId) {
        if (!this.progress.completed.includes(lessonId)) {
            this.progress.completed.push(lessonId);
            localStorage.setItem('learningProgress', JSON.stringify(this.progress));
            const item = document.querySelector(`[data-lesson-id="${lessonId}"]`);
            if (item) item.classList.add('completed');
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('learningProgress');
        return saved ? JSON.parse(saved) : { completed: [] };
    }

    animateElement(element, animationClass) {
        if (!element) return;
        element.classList.remove(animationClass);
        void element.offsetWidth;
        element.classList.add(animationClass);
    }

    showError(msg) {
        alert(msg);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new LanguageLearning();
});
