class SnakeTheGame {
    rows = 8;
    cols = 8;
    // heroDefault = [[3, 3]];
    hero = [];
    target = [0, 0];
    matrix = [];
    heroDirection = 0;
    constructor(el) {
        this.root = el;
        this.init();
        this.initHero();
        this.render();
        this.bindEvents();
        this.initTarget();
    }
    init() {
        // add score
        let scoreWrap = document.createElement('div');
        this.root.append(scoreWrap);
        scoreWrap.className = 'score';
        scoreWrap.innerText = "Score ";
        scoreWrap.append(this.elScore = document.createElement('span'));

        // add field
        this.root.append(this.elField = document.createElement('div'));
        this.elField.className = 'field';
        for (let i = 0; i < this.rows; i++) {
            let row = document.createElement('div');
            row.className = 'row';
            this.elField.append(row);
            this.matrix[i] = [];
            for (let j = 0; j < this.cols; j++) {
                let inp = document.createElement('input');
                inp.type = 'checkbox';
                row.append(inp);
                this.matrix[i][j] = inp;
            }

        }
    }
    preRender() {
        this.matrix.forEach(row => row.forEach(inp => {
            inp.type = 'checkbox';
            inp.checked = false;
        }));
    }
    render() {
        this.preRender();
        // hero
        for (let [i, j] of this.hero) {
            console.log(i, j)
            this.matrix[i][j].checked = true;
        }
        // target
        let [ti, tj] = this.target;
        let elTarget = this.matrix[ti][tj];
        elTarget.type = 'radio';
        elTarget.checked = true;
    }
    initHero() {
        this.hero = [[4, 3], [5, 3]];
    }
    moveHero() {
        let di = 0, dj = 0;
        switch (this.heroDirection) {
            case 37: dj = -1; break;
            case 38: di = -1; break;
            case 39: dj = 1; break;
            case 40: di = 1; break;
        }
        let [hi, hj] = this.hero[0];
        let head = [hi + di, hj + dj];
        if (head[0] < 0) head[0] = this.rows - 1;
        if (head[0] > this.rows - 1) head[0] = 0;
        if (head[1] < 0) head[1] = this.cols - 1;
        if (head[0] > this.cols - 1) head[1] = 0;
        // maybe apple ?
        if (`${head}` == `${this.target}`) {
            this.initTarget();
        } else {
            this.hero.pop();
        }
        this.hero.unshift(head);

        // for (let n in this.hero) {
        //     let [i, j] = this.hero[n];
        //     this.hero[n] = [i + di, j + dj];
        // }
        this.render();
    }
    initTarget() {
        this.target = [this.randomInteger(0, this.rows - 1), this.randomInteger(0, this.cols - 1)];
    }
    handleKBD(e) {
        let [k, d] = [e.keyCode, this.heroDirection]
        if (k == 37 && d == 39 || k == 39 && d == 37) return;
        if (k == 38 && d == 40 || k == 40 && d == 38) return;
        this.heroDirection = e.keyCode;
        this.moveHero();
        console.log(e.keyCode);
    }
    bindEvents() {
        document.addEventListener('keydown', this.handleKBD.bind(this));
    }
    randomInteger(min, max) {
        // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
}