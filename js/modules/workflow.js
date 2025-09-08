export default class Workflow {
    constructor() {
        this.flowchart = document.querySelector('.flowchart-container');
        this.steps = document.querySelectorAll('.flowchart-step');
        this.tooltip = document.getElementById('tooltip');
        this.init();
    }

    init() {
        if (!this.flowchart || !this.steps || !this.tooltip) return;

        this.setupTooltips();
    }

    setupTooltips() {
        this.steps.forEach(step => {
            const showTooltip = (e) => {
                const data = step.dataset;
                if (!data.info) return;

                this.tooltip.innerHTML = data.info;
                this.tooltip.style.display = 'block';
                
                // Posicionar tooltip
                const rect = step.getBoundingClientRect();
                const tooltipRect = this.tooltip.getBoundingClientRect();
                const scrollY = window.scrollY;

                let left = rect.left + (rect.width - tooltipRect.width) / 2;
                let top = rect.top + scrollY - tooltipRect.height - 10;

                // Manter tooltip dentro da janela
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < scrollY + 10) {
                    top = rect.bottom + scrollY + 10;
                }

                this.tooltip.style.left = `${left}px`;
                this.tooltip.style.top = `${top}px`;
            };

            const hideTooltip = () => {
                this.tooltip.style.display = 'none';
            };

            step.addEventListener('mouseenter', showTooltip);
            step.addEventListener('mouseleave', hideTooltip);
            step.addEventListener('focus', showTooltip);
            step.addEventListener('blur', hideTooltip);
        });
    }
}
