export default class Quiz {
    constructor() {
        this.form = document.getElementById('quiz-form');
        this.result = document.getElementById('result');
        this.scoreSpan = document.getElementById('score');
        this.highScoreSpan = document.getElementById('high-score');
        this.explanations = document.getElementById('explanations');
        this.answers = {
            q1: { correct: 'a', explanation: 'HTML define a estrutura e o conteúdo do documento web.' },
            q2: { correct: 'c', explanation: 'Margin é o espaço externo, padding é o espaço interno do elemento.' },
            q3: { correct: 'b', explanation: 'Media Queries e unidades flexíveis são essenciais para responsividade.' },
            q4: { correct: 'c', explanation: 'DOM representa o documento como árvore de objetos manipulável.' },
            q5: { correct: 'b', explanation: 'Versionamento permite controle, colaboração e histórico do código.' },
            q6: { correct: 'c', explanation: 'Acessibilidade garante que todos possam usar o conteúdo.' },
            q7: { correct: 'b', explanation: 'Otimização de imagens melhora performance e experiência.' },
            q8: { correct: 'c', explanation: 'APIs REST seguem princípios para comunicação via HTTP.' }
        };
        this.init();
    }

    init() {
        if (!this.form) return;

        this.loadHighScore();
        this.setupForm();
    }

    loadHighScore() {
        if (!this.highScoreSpan) return;
        const highScore = localStorage.getItem('quizHighScore') || '0';
        this.highScoreSpan.textContent = highScore;
    }

    setupForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkAnswers();
        });
    }

    checkAnswers() {
        if (!this.result || !this.scoreSpan || !this.explanations) return;

        let score = 0;
        let explanationsHTML = '';

        Object.entries(this.answers).forEach(([question, data]) => {
            const selected = this.form.querySelector(`input[name="${question}"]:checked`);
            if (!selected) return;

            const isCorrect = selected.value === data.correct;
            const questionNum = question.substring(1);
            
            if (isCorrect) score++;

            explanationsHTML += `
                <div class="explanation">
                    <h4 class="${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? '✓' : '✗'} Questão ${questionNum}
                    </h4>
                    <p>${data.explanation}</p>
                </div>
            `;
        });

        // Atualizar pontuação e explicações
        this.scoreSpan.textContent = score;
        this.explanations.innerHTML = explanationsHTML;

        // Atualizar melhor pontuação
        const currentHighScore = parseInt(localStorage.getItem('quizHighScore') || '0');
        if (score > currentHighScore) {
            localStorage.setItem('quizHighScore', score.toString());
            this.highScoreSpan.textContent = score;
        }

        // Mostrar resultados
        this.result.classList.add('show');
        this.result.scrollIntoView({ behavior: 'smooth' });
    }
}
