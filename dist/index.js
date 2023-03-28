"use strict";
class Food {
    constructor() {
        this.element = document.querySelector('.food');
    }
    get X() {
        return this.element.offsetLeft;
    }
    get Y() {
        return this.element.offsetTop;
    }
    change() {
        const top = Math.floor(Math.random() * 30) * 10;
        const left = Math.floor(Math.random() * 30) * 10;
        this.element.style.top = top + 'px';
        this.element.style.left = left + 'px';
    }
}
class ScorePanel {
    constructor(maxLevel = 10, upScore = 10) {
        this.score = 0;
        this.level = 1;
        this.scoreEle = document.querySelector('.score');
        this.levleEle = document.querySelector('.level');
        this.maxLevel = maxLevel;
        this.upScore = upScore;
    }
    addScore() {
        this.scoreEle.innerHTML = ++this.score + '';
        if (this.score % this.upScore === 0) {
            this.levelUp();
        }
    }
    levelUp() {
        if (this.level < this.maxLevel) {
            this.levleEle.innerHTML = ++this.level + '';
        }
    }
}
class Snake {
    constructor() {
        this.element = document.querySelector('.snake');
        this.head = document.querySelector('.snake > div');
        this.bodies = this.element.getElementsByTagName('div');
    }
    get X() {
        return this.head.offsetLeft;
    }
    get Y() {
        return this.head.offsetTop;
    }
    set X(value) {
        if (this.X === value)
            return;
        if (value < 0 || value > 290) {
            throw new Error('撞墙了');
        }
        this.moveBody();
        this.head.style.left = value + 'px';
        this.checkHeadBody();
    }
    set Y(value) {
        if (this.Y === value)
            return;
        if (value < 0 || value > 290) {
            throw new Error('撞墙了');
        }
        this.moveBody();
        this.head.style.top = value + 'px';
        this.checkHeadBody();
    }
    addBody() {
        this.element.insertAdjacentHTML('beforeend', '<div></div>');
    }
    moveBody() {
        for (let i = this.bodies.length - 1; i > 0; i--) {
            let X = this.bodies[i - 1].offsetLeft;
            let Y = this.bodies[i - 1].offsetTop;
            this.bodies[i].style.left = X + 'px';
            this.bodies[i].style.top = Y + 'px';
        }
    }
    checkHeadBody() {
        for (let i = 1; i < this.bodies.length; i++) {
            let bd = this.bodies[i];
            if (this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
                throw new Error('撞到自己了！');
            }
        }
    }
}
class GameControl {
    constructor() {
        this.direction = '';
        this.isLive = true;
        this.food = new Food();
        this.snake = new Snake();
        this.scorePanel = new ScorePanel(10, 2);
        this.init();
    }
    init() {
        document.addEventListener('keydown', this.keyDownHandler.bind(this));
        this.run();
    }
    keyDownHandler(event) {
        this.direction = event.key;
    }
    run() {
        let X = this.snake.X;
        let Y = this.snake.Y;
        switch (this.direction) {
            case 'ArrowUp':
            case 'w':
                Y -= 10;
                break;
            case 'ArrowDown':
            case 's':
                Y += 10;
                break;
            case 'ArrowLeft':
            case 'a':
                X -= 10;
                break;
            case 'ArrowRight':
            case 'd':
                X += 10;
                break;
        }
        this.checkEat(X, Y);
        try {
            this.snake.X = X;
            this.snake.Y = Y;
        }
        catch (error) {
            alert(error.message + 'GAME OVER!');
            this.isLive = false;
        }
        this.isLive &&
            setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30);
    }
    checkEat(X, Y) {
        if (X === this.food.X && Y === this.food.Y) {
            this.food.change();
            this.scorePanel.addScore();
            this.snake.addBody();
        }
    }
}
new GameControl();
