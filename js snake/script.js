class SnakeTheGame {
    rows = 16;
    cols = 16;
    //heroDefault = [[3,3]];
    hero = [];
    target = [0, 0];
    matrix = [];
    heroDirection = 38;
    score = 0;
    delay = 300;
    delayID = 0;
    constructor(el) {
        this.root = el;
        this.init();
        this.initHero();
        this.bindEvents();
        this.initTarget();
        this.render();
    }
    init() {
        //add score
        let scoreWrap = document.createElement('div');
        this.root.append(scoreWrap);
        scoreWrap.className = 'score';
        scoreWrap.innerText = 'Score ';
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
                inp.setAttribute('readonly', true);
                inp.addEventListener('click', e => e.preventDefault())
                row.append(inp);
                this.matrix[i][j] = inp;
            }
        }
    }
    preRender() {
        this.matrix.forEach(row => row.forEach(inp => {
            inp.type = 'checkbox';
            inp.checked = false;
        }))
    }
    render() {
        this.preRender();
        //hero
        for (let [i, j] of this.hero) {
            let elInp = this.matrix[i][j];
            if (!elInp) continue;
            elInp.checked = true;
        }
        //target
        let [ti, tj] = this.target;
        let elTarget = this.matrix[ti][tj];
        elTarget.type = 'radio';
        elTarget.checked = true;

        //score
        this.elScore.innerText = this.score;
    }
    initHero() {
        let jc = Math.floor(this.cols / 2);
        let ic = Math.floor(this.rows / 2);
        this.hero = [[ic, jc], [ic + 1, jc]];
        this.score = 0;
        this.delay = 300;
    }
    moveHero() {
        let di = 0, dj = 0;
        switch (this.heroDirection) {
            case 37: dj = -1; break;
            case 38: di = -1; break;
            case 39: dj = 1; break;
            case 40: di = 1; break;
        }
        if (!di && !dj) return;

        let [hi, hj] = this.hero[0];
        let head = [hi + di, hj + dj];
        if (head[0] < 0) head[0] = this.rows - 1;
        if (head[0] > this.rows - 1) head[0] = 0;
        if (head[1] < 0) head[1] = this.cols - 1;
        if (head[1] > this.cols - 1) head[1] = 0;

        this.hero.unshift(head);
        if (this.collideHeadHero()) {
            return this.gameOver();
        }
        let collides = this.collideTargetHero();
        if (collides) {
            this.score++;
            this.delay *= 0.95;
            this.startTimers();
            this.initTarget();
        }
        else {
            this.hero.pop();
        }

        // console.log('colides', collides)

        // for(let n in this.hero){
        //     let [i, j] = this.hero[n];
        //     this.hero[n] = [i + di, j+dj];
        // }
        this.render();
    }

    startTimers() {
        this.stopTimers();
        this.delayID = setInterval(this.moveHero.bind(this), this.delay);
    }

    stopTimers() {
        clearInterval(this.delayID);
    }

    initTarget(force = false) {
        while (this.collideTargetHero()) {
            this.target = [this.randomInteger(0, this.rows - 1), this.randomInteger(0, this.cols - 1)]
        }
    }
    collideTargetHero() {
        //console.log('collideTargetHero')
        //return `${head}` == `${this.target}`;
        for (let item of this.hero) {
            //console.log('collideTargetHero');
            if (`${item}` == `${this.target}`) return true;
        }
        return false;
    }

    collideHeadHero() {
        let head = this.hero[0];
        for (let item of this.hero.slice(1)) {
            if (`${item}` == `${head}`) return true;
        }
        return false;
    }

    gameOver() {
        console.log('GameOver');
        alert('GameOver');
        this.stopTimers();
        this.initHero();
        this.initTarget();
        this.render();
    }

    handleKBD(e) {
        let [k, d] = [e.keyCode, this.heroDirection];
        if ([37, 38, 39, 40].includes(k)) {
            if (k == 37 && d == 39 || k == 39 && d == 37) return;
            if (k == 38 && d == 40 || k == 40 && d == 38) return;
            this.heroDirection = e.keyCode;
            this.moveHero();
            this.startTimers();
        }
        if (k == 32) this.stopTimers();
        if (k == 27) {
            this.stopTimers();
            this.initHero();
            this.initTarget();
            this.render();
        }
    }
    bindEvents() {
        document.addEventListener('keydown', this.handleKBD.bind(this));
    }
    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

}