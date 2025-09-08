// Módulos
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleBtn = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Observar preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            this.setTheme(e.matches ? 'dark' : 'light');
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
        
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute('aria-label', 
                `Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`);
        }
    }

    toggleTheme() {
        this.setTheme(this.theme === 'light' ? 'dark' : 'light');
    }
}

class ResponsiveMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.mainNav = document.querySelector('.main-nav');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.mainNav) return;

        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Fechar menu ao clicar em links
        const navLinks = this.mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });

        // Atalho Alt+M para focar no menu
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.mainNav.querySelector('a')?.focus();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.menuToggle.setAttribute('aria-expanded', this.isOpen);
        this.mainNav.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
    }

    closeMenu() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.mainNav.classList.remove('active');
        this.menuToggle.classList.remove('active');
    }
}

class ProgressTracker {
    constructor() {
        this.progressBars = document.querySelectorAll('.progress');
        this.init();
    }

    init() {
        this.progressBars.forEach(progressBar => {
            const section = progressBar.closest('section');
            if (!section) return;

            const checkboxes = section.querySelectorAll('input[type="checkbox"]');
            const progressFill = progressBar.querySelector('.progress-fill');
            const progressText = progressBar.querySelector('.progress-text');

            if (!checkboxes.length || !progressFill || !progressText) return;

            // Atualizar progresso inicial
            this.updateProgress(checkboxes, progressFill, progressText);

            // Monitorar mudanças
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    this.updateProgress(checkboxes, progressFill, progressText);
                    this.saveProgress(checkbox);
                });
            });
        });

        // Carregar estado salvo
        this.loadProgress();
    }

    calculateProgress(checkboxes) {
        if (!checkboxes.length) return 0;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        return Math.round((checked / checkboxes.length) * 100);
    }

    updateProgress(checkboxes, progressFill, progressText) {
        const percentage = this.calculateProgress(checkboxes);
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% concluído`;
    }

    saveProgress(checkbox) {
        const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
        checkboxStates[checkbox.name] = checkbox.checked;
        localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
    }

    loadProgress() {
        const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
        Object.entries(checkboxStates).forEach(([name, checked]) => {
            const checkbox = document.querySelector(`input[name="${name}"]`);
            if (checkbox) {
                checkbox.checked = checked;
                const section = checkbox.closest('section');
                if (section) {
                    const progressBar = section.querySelector('.progress');
                    const progressFill = progressBar?.querySelector('.progress-fill');
                    const progressText = progressBar?.querySelector('.progress-text');
                    if (progressBar && progressFill && progressText) {
                        const checkboxes = section.querySelectorAll('input[type="checkbox"]');
                        this.updateProgress(checkboxes, progressFill, progressText);
                    }
                }
            }
        });
    }
}

// Funcionalidades da página de tecnologias
    const techGrid = document.querySelector('.technologies-grid');
    if (techGrid) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('tech-search');
        const modal = document.getElementById('tech-modal');
        const modalClose = modal?.querySelector('.modal-close');
        const cards = document.querySelectorAll('.tech-card');

        // Filtros por categoria
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Adiciona active no botão clicado
                button.classList.add('active');

                const filter = button.dataset.filter;
                filterCards(filter, searchInput.value);
            });
        });

        // Busca por texto
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const activeFilter = document.querySelector('.filter-btn.active');
                filterCards(activeFilter.dataset.filter, e.target.value);
            }, 300);
        });

        // Função de filtro combinado (categoria + texto)
        function filterCards(category, searchText) {
            const normalizedSearch = searchText.toLowerCase().trim();
            
            cards.forEach(card => {
                const cardCategory = card.dataset.category;
                const cardContent = card.textContent.toLowerCase();
                const matchesCategory = category === 'all' || cardCategory === category;
                const matchesSearch = !normalizedSearch || cardContent.includes(normalizedSearch);
                
                card.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
            });
        }

        // Modal
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('.tech-description').textContent;
                const prosCons = card.querySelector('.pros-cons').innerHTML;
                const link = card.querySelector('.tech-link').href;

                modal.querySelector('#modal-title').textContent = title;
                modal.querySelector('#modal-description').textContent = description;
                modal.querySelector('#modal-bullets').innerHTML = prosCons;
                modal.querySelector('#modal-link').href = link;

                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                
                // Foca no modal para leitores de tela
                modal.querySelector('.modal-content').focus();
            });
        });

        // Fechar modal
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            });

            // Fechar modal com Esc
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });

            // Fechar modal clicando fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
                }
            });
        }
    }

    // Funcionalidades da página de boas práticas
    const accordionButtons = document.querySelectorAll('.accordion-header');

    if (accordionButtons.length > 0) {
        // Inicializa o accordion
        accordionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const content = document.getElementById(button.getAttribute('aria-controls'));
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                button.setAttribute('aria-expanded', !isExpanded);
                content.hidden = isExpanded;

                // Fecha outros painéis
                accordionButtons.forEach(otherButton => {
                    if (otherButton !== button) {
                        const otherContent = document.getElementById(otherButton.getAttribute('aria-controls'));
                        otherButton.setAttribute('aria-expanded', false);
                        otherContent.hidden = true;
                    }
                });
            });
        });
    }

    // Funcionalidades da página de quiz
    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    const highScoreSpan = document.getElementById('high-score');
    const explanationsDiv = document.getElementById('explanations');

    if (quizForm) {
        // Respostas corretas e explicações
        const quizAnswers = {
            q1: {
                correct: 'a',
                explanation: 'HTML (HyperText Markup Language) é responsável por definir a estrutura e o conteúdo do documento web, como títulos, parágrafos, listas e outros elementos.'
            },
            q2: {
                correct: 'c',
                explanation: 'Margin define o espaço externo ao redor do elemento, enquanto padding define o espaço interno entre a borda do elemento e seu conteúdo.'
            },
            q3: {
                correct: 'b',
                explanation: 'Media Queries permitem aplicar estilos diferentes baseados no tamanho da tela, e unidades flexíveis (%, rem) garantem que os elementos se ajustem proporcionalmente.'
            },
            q4: {
                correct: 'c',
                explanation: 'O DOM (Document Object Model) é uma representação da estrutura do documento HTML como uma árvore de objetos, permitindo que o JavaScript acesse e modifique o conteúdo da página.'
            },
            q5: {
                correct: 'b',
                explanation: 'O versionamento de código permite rastrear mudanças, facilita a colaboração entre desenvolvedores e mantém um histórico completo do desenvolvimento do projeto.'
            },
            q6: {
                correct: 'c',
                explanation: 'A acessibilidade web garante que todas as pessoas, independentemente de suas capacidades, possam acessar, compreender, navegar e interagir com o conteúdo web.'
            },
            q7: {
                correct: 'b',
                explanation: 'A otimização de imagens envolve compressão para reduzir o tamanho do arquivo, escolha do formato mais adequado (JPG, PNG, WebP) e uso de lazy loading para carregar imagens apenas quando necessário.'
            },
            q8: {
                correct: 'c',
                explanation: 'Uma API REST é um conjunto de princípios arquiteturais que define como recursos web devem ser expostos e manipulados usando métodos HTTP padrão (GET, POST, PUT, DELETE).'
            }
        };

        // Carregar melhor pontuação do localStorage
        const highScore = localStorage.getItem('quizHighScore') || 0;
        highScoreSpan.textContent = highScore;

        // Processar envio do formulário
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let score = 0;
            let explanationsHTML = '';

            // Verificar respostas
            Object.keys(quizAnswers).forEach(question => {
                const selectedAnswer = quizForm.querySelector(`input[name="${question}"]:checked`);
                if (!selectedAnswer) return;

                const isCorrect = selectedAnswer.value === quizAnswers[question].correct;
                const questionNum = question.substring(1);
                
                if (isCorrect) score++;

                explanationsHTML += `
                    <div class="explanation">
                        <h4 class="${isCorrect ? 'correct' : 'incorrect'}">
                            ${isCorrect ? '✓' : '✗'} Questão ${questionNum}
                        </h4>
                        <p>${quizAnswers[question].explanation}</p>
                    </div>
                `;
            });

            // Atualizar pontuação e explicações
            scoreSpan.textContent = score;
            explanationsDiv.innerHTML = explanationsHTML;

            // Atualizar melhor pontuação se necessário
            if (score > highScore) {
                localStorage.setItem('quizHighScore', score);
                highScoreSpan.textContent = score;
            }

            // Mostrar resultados
            resultDiv.classList.add('show');
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Inicializar módulos
    new ThemeManager();
    new ResponsiveMenu();
    new ProgressTracker();
});
