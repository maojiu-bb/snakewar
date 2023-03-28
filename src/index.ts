// 定义食物类
class Food {
  element: HTMLElement
  constructor() {
    // 获取 food 元素
    this.element = document.querySelector('.food')!
  }
  // X 轴坐标
  get X() {
    return this.element.offsetLeft
  }
  // Y 轴坐标
  get Y() {
    return this.element.offsetTop
  }
  // 改变食物位置
  change() {
    // 生成随机位置
    const top = Math.floor(Math.random() * 30) * 10
    const left = Math.floor(Math.random() * 30) * 10
    this.element.style.top = top + 'px'
    this.element.style.left = left + 'px'
  }
}
// 定义 ScorePanel 面板类
class ScorePanel {
  // 分数
  score = 0
  // 等级
  level = 1
  scoreEle: HTMLElement
  levleEle: HTMLElement
  // 等级限制
  maxLevel: number
  // 分数限制
  upScore: number
  constructor(maxLevel: number = 10, upScore: number = 10) {
    this.scoreEle = document.querySelector('.score')!
    this.levleEle = document.querySelector('.level')!
    this.maxLevel = maxLevel
    this.upScore = upScore
  }
  // 加分
  addScore() {
    this.scoreEle.innerHTML = ++this.score + ''
    // 判断分数是多少
    if (this.score % this.upScore === 0) {
      this.levelUp()
    }
  }
  // 升级
  levelUp() {
    if (this.level < this.maxLevel) {
      this.levleEle.innerHTML = ++this.level + ''
    }
  }
}
// 定义 Snake 蛇类
class Snake {
  // 蛇容器
  element: HTMLElement
  // 舌头
  head: HTMLElement
  // 蛇身
  bodies: HTMLCollection
  constructor() {
    this.element = document.querySelector('.snake')!
    this.head = document.querySelector('.snake > div') as HTMLElement
    this.bodies = this.element.getElementsByTagName('div')
  }
  // 舌头 X 坐标
  get X() {
    return this.head.offsetLeft
  }
  // 舌头 Y 坐标
  get Y() {
    return this.head.offsetTop
  }
  // 设置坐标
  set X(value) {
    if (this.X === value) return
    if (value < 0 || value > 290) {
      throw new Error('撞墙了')
    }
    this.moveBody()
    this.head.style.left = value + 'px'
    this.checkHeadBody()
  }
  set Y(value) {
    if (this.Y === value) return
    if (value < 0 || value > 290) {
      throw new Error('撞墙了')
    }
    this.moveBody()
    this.head.style.top = value + 'px'
    this.checkHeadBody()
  }
  // 蛇增加身体
  addBody() {
    // 向element 中增加一个 div
    this.element.insertAdjacentHTML('beforeend', '<div></div>')
  }
  moveBody() {
    for (let i = this.bodies.length - 1; i > 0; i--) {
      let X = (this.bodies[i - 1] as HTMLElement).offsetLeft
      let Y = (this.bodies[i - 1] as HTMLElement).offsetTop
      ;(this.bodies[i] as HTMLElement).style.left = X + 'px'
      ;(this.bodies[i] as HTMLElement).style.top = Y + 'px'
    }
  }
  checkHeadBody() {
    for (let i = 1; i < this.bodies.length; i++) {
      let bd = this.bodies[i] as HTMLElement
      if (this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
        throw new Error('撞到自己了！')
      }
    }
  }
}
// 游戏控制器，控制其他所有类
class GameControl {
  food: Food
  snake: Snake
  scorePanel: ScorePanel
  direction: string = ''
  isLive = true
  constructor() {
    this.food = new Food()
    this.snake = new Snake()
    this.scorePanel = new ScorePanel(10, 2)
    this.init()
  }
  init() {
    document.addEventListener('keydown', this.keyDownHandler.bind(this))
    this.run()
  }
  keyDownHandler(event: KeyboardEvent) {
    this.direction = event.key
  }
  run() {
    let X = this.snake.X
    let Y = this.snake.Y
    switch (this.direction) {
      case 'ArrowUp':
      case 'w':
        Y -= 10
        break
      case 'ArrowDown':
      case 's':
        Y += 10
        break
      case 'ArrowLeft':
      case 'a':
        X -= 10
        break
      case 'ArrowRight':
      case 'd':
        X += 10
        break
    }
    this.checkEat(X, Y)
    try {
      this.snake.X = X
      this.snake.Y = Y
    } catch (error: any) {
      alert(error.message + 'GAME OVER!')
      this.isLive = false
    }
    this.isLive &&
      setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30)
  }
  checkEat(X: number, Y: number) {
    if (X === this.food.X && Y === this.food.Y) {
      this.food.change()
      this.scorePanel.addScore()
      this.snake.addBody()
    }
  }
}
new GameControl()

/* // 测试代码
const food = new Food()
food.change()
const sp = new ScorePanel(200, 2)
for (let i = 0; i < 200; i++) {
  sp.addScore()
} */
