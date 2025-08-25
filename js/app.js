// Funções de utilidade
function calculateProgress(checkboxes) {
    if (!checkboxes.length) return 0;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    return Math.round((checked / checkboxes.length) * 100);
}

function updateProgressBar(progressFill, progressText, percentage) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% concluído`;
}

function saveCheckboxState(checkbox) {
    const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
    checkboxStates[checkbox.name] = checkbox.checked;
    localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
}

function loadCheckboxStates() {
    const checkboxStates = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
    Object.entries(checkboxStates).forEach(([name, checked]) => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) {
            checkbox.checked = checked;
        }
    });
}

// Script principal da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Menu hambúrguer
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
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
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

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

        // Inicializa checkboxes e barra de progresso
        loadCheckboxStates();
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                saveCheckboxState(checkbox);
                const progress = calculateProgress(checkboxes);
                updateProgressBar(progressFill, progressText, progress);
            });
        });

        // Atualiza progresso inicial
        const initialProgress = calculateProgress(checkboxes);
        updateProgressBar(progressFill, progressText, initialProgress);
    }
});
