export default class ThemeManager {
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
