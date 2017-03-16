'use strict';

const GAME_SIZE = 25;
const GAME_FPS = 8;

const SNAKE_SEGMENTS = 3;

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40

const random = (maxValue) => Math.floor(Math.random() * maxValue);

const foodFactory = () => Object.create(null, {
  x: { value: random(GAME_SIZE) },
  y: { value: random(GAME_SIZE) },
});

const snake = {
  x: random(GAME_SIZE),
  y: random(GAME_SIZE),
  speedX: 1,
  speedY: 0,
  canTurn: true,
  segments: [],

  initialize: () => {
    for (let i = 0; i < SNAKE_SEGMENTS; i++) {
      snake.segments.push({
        x: snake.x + 1,
        y: snake.y,
      });
    };

    document.onkeydown = (e) => {
      console.log(`key: ${e.which}`);
      snake.move(e.which);
    };
  },

  move: (key) => {
    switch(key) {
      case LEFT_ARROW:
        if (0 === snake.speedY && snake.canTurn) {
          snake.canTurn = false;
          snake.speedX = -1;
          snake.speedY = 0;
        }
        break;

      case UP_ARROW:
        if (0 === snake.speedX && snake.canTurn) {
          snake.canTurn = false;
          snake.speedX = 0;
          snake.speedY = -1;
        }
        break;

      case RIGHT_ARROW:
        if (0 === snake.speedY && snake.canTurn) {
          snake.canTurn = false;
          snake.speedX = 1;
          snake.speedY = 0;
        }
        break;

      case DOWN_ARROW:
        if (0 === snake.speedX && snake.canTurn) {
          snake.canTurn = false;
          snake.speedX = 0;
          snake.speedY = 1;
        }
        break;

      default: return;
    }
  },

  update: () => {
    snake.x = (snake.x + snake.speedX) % GAME_SIZE;
    snake.y = (snake.speedY + snake.speedY) % GAME_SIZE;

    for (let i = snake.segments.length - 1; i >= 0; i--) {
      let segment = snake.segments[i];
      if (0 !== i) {
        segment.x = snake.segments[i - 1].x;
        segment.y = snake.segments[i - 1].y;
        if ( snake.x === segment.x && snake.y === segment.y) {
          snake.die();
        }
      } else {
        // first segment
        segment.x = snake.x;
        segment.y = snake.y;
      }

    game.fillCell(segment.x, segment.y);
    }
  },

  die: () => snake.segments = [],

  addSegment: () => {},
};

const game = {
  size: GAME_SIZE,
  fps: GAME_FPS,
  scoreElement: document.getElementById('score'),
  score: 0,
  stageElement: document.getElementById('stage'),
  grid: [],
  foodList: [],

  intervalId: () => setInterval(game.update, 1000 / game.fps),

  initialize: () => {
    game.buildGrid();
    for (let i = 0; i < 10; i++) {
      let food = foodFactory();
      game.foodList.push(food);
      game.fillCell(food.x, food.y)
    }

    snake.initialize();
    game.intervalId();
  },

  buildGrid: () => {
    for (let x = 0; x < game.size; x++) {
      game.grid[x] = [];
      for (let y = 0; y < game.size; y++) {
        const node = document.createElement('div');
        node.style.position = 'absolute';
        node.style.width = `${game.size}px`;
        node.style.height = `${game.size}px`;
        node.style.left = `${x * game.size}px`;
        node.style.top = `${y * game.size}px`;
        node.style.border = '1px solid #777';
        game.stageElement.appendChild(node);
        game.grid[x][y] = {
          node: node,
          value: false,
        };
      }
    }
  },

  fillCell: (x, y) => game.grid[x][y].value = true,

  update: () => {
    game.scoreElement.innerHTML = game.score;

    snake.update();
    for (let x = 0; x < game.size; x++) {
      for (let y = 0; y < game.size; y++) {
        let cell = game.grid[x][y];
        if (cell.value) {
          cell.node.style.background = 'red';
        } else {
          cell.node.style.background = 'white';
        }

        cell.value = false;
      }
    }

    snake.canTurn = true;
  },
};

window.game = game;
window.snake = snake;
game.initialize();
