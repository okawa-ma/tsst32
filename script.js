// 小学生向け基本元素データ
const elements = [
    { symbol: 'H', name: '水素', hint: '一番軽い気体で、水の成分です' },
    { symbol: 'He', name: 'ヘリウム', hint: '風船に入っている軽い気体です' },
    { symbol: 'Li', name: 'リチウム', hint: '電池によく使われる金属です' },
    { symbol: 'C', name: '炭素', hint: '鉛筆の芯やダイヤモンドの成分です' },
    { symbol: 'N', name: '窒素', hint: '空気の約8割を占める気体です' },
    { symbol: 'O', name: '酸素', hint: '呼吸に必要な気体です' },
    { symbol: 'F', name: 'フッ素', hint: '歯磨き粉に入っていることがあります' },
    { symbol: 'Ne', name: 'ネオン', hint: '看板の光によく使われる気体です' },
    { symbol: 'Na', name: 'ナトリウム', hint: '塩の成分の一つです' },
    { symbol: 'Mg', name: 'マグネシウム', hint: '白い光で燃える金属です' },
    { symbol: 'Al', name: 'アルミニウム', hint: 'アルミホイルの材料です' },
    { symbol: 'Si', name: 'ケイ素', hint: 'ガラスやコンピューターの材料です' },
    { symbol: 'P', name: 'リン', hint: 'マッチの頭に含まれています' },
    { symbol: 'S', name: '硫黄', hint: '温泉の匂いの元です' },
    { symbol: 'Cl', name: '塩素', hint: 'プールの消毒に使われます' },
    { symbol: 'K', name: 'カリウム', hint: 'バナナに多く含まれています' },
    { symbol: 'Ca', name: 'カルシウム', hint: '骨や歯を強くする成分です' },
    { symbol: 'Fe', name: '鉄', hint: '磁石にくっつく金属です' },
    { symbol: 'Cu', name: '銅', hint: '10円玉の材料です' },
    { symbol: 'Zn', name: '亜鉛', hint: '電池によく使われる金属です' }
];

class ElementGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 20;
        this.usedElements = [];
        this.currentElement = null;
        this.hintUsed = false;
        
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.shuffleElements();
        this.showQuestion();
        this.updateUI();
    }

    shuffleElements() {
        // Fisher-Yates シャッフル
        const shuffled = [...elements];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        this.usedElements = shuffled.slice(0, this.totalQuestions);
    }

    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.endGame();
            return;
        }

        this.currentElement = this.usedElements[this.currentQuestion];
        this.hintUsed = false;
        
        // 要素を表示
        document.getElementById('element-symbol').textContent = this.currentElement.symbol;
        document.getElementById('element-name-display').style.display = 'none';
        document.getElementById('hint').style.display = 'none';
        document.getElementById('result').style.display = 'none';
        document.getElementById('hint-btn').style.display = 'block';
        
        // 選択肢を生成
        this.generateChoices();
        this.updateProgress();
    }

    generateChoices() {
        const choices = [this.currentElement.name];
        const otherElements = elements.filter(el => el.name !== this.currentElement.name);
        
        // ランダムに3つの間違った選択肢を追加
        while (choices.length < 4) {
            const randomElement = otherElements[Math.floor(Math.random() * otherElements.length)];
            if (!choices.includes(randomElement.name)) {
                choices.push(randomElement.name);
            }
        }
        
        // 選択肢をシャッフル
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        // HTMLに表示
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice';
            button.textContent = choice;
            button.addEventListener('click', () => this.handleAnswer(choice));
            choicesContainer.appendChild(button);
        });
    }

    handleAnswer(selectedAnswer) {
        const isCorrect = selectedAnswer === this.currentElement.name;
        const choices = document.querySelectorAll('.choice');
        
        // 全ての選択肢を無効化
        choices.forEach(choice => {
            choice.classList.add('disabled');
            if (choice.textContent === this.currentElement.name) {
                choice.classList.add('correct');
            } else if (choice.textContent === selectedAnswer && !isCorrect) {
                choice.classList.add('incorrect');
            }
        });
        
        // スコア更新
        if (isCorrect) {
            let points = 1;
            if (!this.hintUsed) points = 2; // ヒント未使用でボーナス
            this.score += points;
        }
        
        // 結果表示
        this.showResult(isCorrect);
        document.getElementById('hint-btn').style.display = 'none';
        document.getElementById('element-name-display').textContent = this.currentElement.name;
        document.getElementById('element-name-display').style.display = 'block';
    }

    showResult(isCorrect) {
        const resultDiv = document.getElementById('result');
        const messageDiv = document.getElementById('result-message');
        
        if (isCorrect) {
            messageDiv.textContent = this.hintUsed ? '正解！ ⭐' : '正解！ ⭐⭐ ボーナス！';
            messageDiv.className = 'result-message correct';
        } else {
            messageDiv.textContent = '不正解 😅 正解は「' + this.currentElement.name + '」でした';
            messageDiv.className = 'result-message incorrect';
        }
        
        resultDiv.style.display = 'block';
        this.updateUI();
    }

    showHint() {
        const hintDiv = document.getElementById('hint');
        hintDiv.textContent = this.currentElement.hint;
        hintDiv.style.display = 'block';
        this.hintUsed = true;
    }

    nextQuestion() {
        this.currentQuestion++;
        this.showQuestion();
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('remaining').textContent = this.totalQuestions - this.currentQuestion;
    }

    updateProgress() {
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        document.getElementById('progress').style.width = progress + '%';
    }

    endGame() {
        document.getElementById('game-area').style.display = 'none';
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('final-score').textContent = this.score;
        
        // 成績評価
        const gradeDiv = document.getElementById('grade');
        const percentage = (this.score / (this.totalQuestions * 2)) * 100; // 最大スコアは40点
        
        if (percentage >= 80) {
            gradeDiv.textContent = '素晴らしい！ 🏆 化学博士ですね！';
            gradeDiv.className = 'grade excellent';
        } else if (percentage >= 60) {
            gradeDiv.textContent = 'よくできました！ 🌟 もう少しで完璧です！';
            gradeDiv.className = 'grade good';
        } else if (percentage >= 40) {
            gradeDiv.textContent = 'まずまずです 📚 もう一度挑戦してみましょう！';
            gradeDiv.className = 'grade fair';
        } else {
            gradeDiv.textContent = 'がんばりましょう！ 💪 練習すれば必ず上達します！';
            gradeDiv.className = 'grade poor';
        }
        
        document.getElementById('progress').style.width = '100%';
    }

    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.usedElements = [];
        this.currentElement = null;
        this.hintUsed = false;
        
        document.getElementById('game-area').style.display = 'block';
        document.getElementById('game-over').style.display = 'none';
        
        this.initializeGame();
    }

    bindEvents() {
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.getElementById('result').style.display === 'block') {
                this.nextQuestion();
            }
            if (e.key === 'h' || e.key === 'H') {
                if (document.getElementById('hint-btn').style.display === 'block') {
                    this.showHint();
                }
            }
        });
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new ElementGame();
});