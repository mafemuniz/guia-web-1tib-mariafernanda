export default class BestPractices {
    constructor() {
        this.accordionButtons = document.querySelectorAll('.accordion-header');
        this.checkboxes = document.querySelectorAll('.practice-checkbox');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.init();
    }

    init() {
        this.setupAccordion();
        this.setupCheckboxes();
        this.loadProgress();
    }

    setupAccordion() {
        this.accordionButtons?.forEach(button => {
            button.addEventListener('click', () => {
                const content = document.getElementById(button.getAttribute('aria-controls'));
                if (!content) return;

                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                // Fechar outros painéis
                this.accordionButtons.forEach(otherButton => {
                    if (otherButton !== button) {
                        const otherContent = document.getElementById(
                            otherButton.getAttribute('aria-controls')
                        );
                        if (otherContent) {
                            otherButton.setAttribute('aria-expanded', 'false');
                            otherContent.style.maxHeight = '0';
                            otherContent.setAttribute('hidden', '');
                        }
                    }
                });

                // Alternar painel atual
                button.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    content.removeAttribute('hidden');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                    setTimeout(() => content.setAttribute('hidden', ''), 300);
                }
            });
        });
    }

    setupCheckboxes() {
        this.checkboxes?.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveProgress();
                this.updateProgressBar();
            });
        });
    }

    loadProgress() {
        const savedProgress = JSON.parse(
            localStorage.getItem('practicesProgress') || '{}'
        );

        this.checkboxes?.forEach(checkbox => {
            if (checkbox.id in savedProgress) {
                checkbox.checked = savedProgress[checkbox.id];
            }
        });

        this.updateProgressBar();
    }

    saveProgress() {
        const progress = {};
        this.checkboxes?.forEach(checkbox => {
            progress[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem('practicesProgress', JSON.stringify(progress));
    }

    updateProgressBar() {
        if (!this.progressFill || !this.progressText || !this.checkboxes) return;

        const total = this.checkboxes.length;
        const checked = Array.from(this.checkboxes)
            .filter(cb => cb.checked).length;
        
        const percentage = Math.round((checked / total) * 100);
        
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}% concluído`;
    }
}
