export default class ResponsiveMenu {
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
