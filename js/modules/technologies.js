export const technologies = [
    {
        id: 'html5',
        name: 'HTML5',
        category: 'frontend',
        description: 'Linguagem de marcação para estruturar conteúdo web.',
        level: 'basico',
        pros: [
            'Semântica clara',
            'Suporte universal',
            'Acessibilidade nativa'
        ],
        cons: [
            'Limitado a estruturação',
            'Requer CSS para estilização'
        ],
        avoidWhen: 'Quando precisar de interatividade complexa',
        link: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML'
    },
    {
        id: 'css3',
        name: 'CSS3',
        category: 'frontend',
        description: 'Linguagem de estilização para design web.',
        level: 'intermediario',
        pros: [
            'Flexibilidade no design',
            'Animações suaves',
            'Responsividade'
        ],
        cons: [
            'Complexidade em layouts avançados',
            'Inconsistências entre navegadores'
        ],
        avoidWhen: 'Para lógica de programação',
        link: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS'
    },
    // Adicione mais tecnologias aqui
];

export default class TechnologyManager {
    constructor() {
        this.techs = technologies;
        this.grid = document.querySelector('.technologies-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById('tech-search');
        this.modal = document.getElementById('tech-modal');
        this.exportBtn = document.getElementById('export-tech');
        this.currentFilter = localStorage.getItem('techFilter') || 'all';
        this.init();
    }

    init() {
        if (!this.grid) return;

        this.renderCards();
        this.setupFilters();
        this.setupSearch();
        this.setupModal();
        this.setupExport();
        this.setupShortcuts();
    }

    renderCards(filteredTechs = this.techs) {
        if (!this.grid) return;

        if (filteredTechs.length === 0) {
            this.grid.innerHTML = `
                <div class="no-results">
                    <p>Nenhuma tecnologia encontrada.</p>
                    <button class="btn btn-primary" onclick="clearFilters()">
                        Limpar filtros
                    </button>
                </div>`;
            return;
        }

        this.grid.innerHTML = filteredTechs.map(tech => `
            <article class="tech-card" data-id="${tech.id}" data-category="${tech.category}">
                <h3>${tech.name}</h3>
                <p class="tech-description">${tech.description}</p>
                <div class="pros-cons">
                    <h4>Prós</h4>
                    <ul>
                        ${tech.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                    <h4>Contras</h4>
                    <ul>
                        ${tech.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
                <p class="avoid-when">Evitar quando: ${tech.avoidWhen}</p>
                <div class="tech-footer">
                    <span class="tech-level" data-level="${tech.level}">
                        ${tech.level}
                    </span>
                    <a href="${tech.link}" class="tech-link" target="_blank" rel="noopener">
                        Documentação
                    </a>
                </div>
            </article>
        `).join('');

        this.setupCardListeners();
    }

    setupFilters() {
        this.filterButtons?.forEach(button => {
            if (button.dataset.filter === this.currentFilter) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                localStorage.setItem('techFilter', filter);
                this.currentFilter = filter;
                
                this.applyFilters();
            });
        });
    }

    setupSearch() {
        let searchTimeout;
        this.searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.applyFilters(), 300);
        });
    }

    applyFilters() {
        if (!this.searchInput) return;

        const searchText = this.searchInput.value.toLowerCase().trim();
        const filteredTechs = this.techs.filter(tech => {
            const matchesCategory = this.currentFilter === 'all' || 
                                  tech.category === this.currentFilter;
            const matchesSearch = !searchText || 
                                tech.name.toLowerCase().includes(searchText) ||
                                tech.description.toLowerCase().includes(searchText);
            return matchesCategory && matchesSearch;
        });

        this.renderCards(filteredTechs);
    }

    setupModal() {
        if (!this.modal) return;

        // Fechar modal
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn?.addEventListener('click', () => this.closeModal());

        // Fechar com Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Fechar clicando fora
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    setupCardListeners() {
        this.grid.querySelectorAll('.tech-card').forEach(card => {
            card.addEventListener('click', () => {
                const tech = this.techs.find(t => t.id === card.dataset.id);
                if (tech) this.openModal(tech);
            });
        });
    }

    openModal(tech) {
        if (!this.modal) return;

        this.modal.querySelector('#modal-title').textContent = tech.name;
        this.modal.querySelector('#modal-description').textContent = tech.description;
        this.modal.querySelector('#modal-bullets').innerHTML = `
            <div class="pros-cons">
                <h4>Prós</h4>
                <ul>${tech.pros.map(pro => `<li>${pro}</li>`).join('')}</ul>
                <h4>Contras</h4>
                <ul>${tech.cons.map(con => `<li>${con}</li>`).join('')}</ul>
            </div>
        `;
        this.modal.querySelector('#modal-link').href = tech.link;

        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.querySelector('.modal-content').focus();
    }

    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
    }

    setupExport() {
        this.exportBtn?.addEventListener('click', () => this.exportToCSV());
    }

    exportToCSV() {
        const filteredTechs = this.techs.filter(tech => 
            this.currentFilter === 'all' || tech.category === this.currentFilter
        );

        const headers = ['Nome', 'Categoria', 'Nível', 'Descrição', 'Link'];
        const rows = filteredTechs.map(tech => [
            tech.name,
            tech.category,
            tech.level,
            tech.description,
            tech.link
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'tecnologias.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            // "/" para focar na busca
            if (e.key === '/' && this.searchInput) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
    }
}
