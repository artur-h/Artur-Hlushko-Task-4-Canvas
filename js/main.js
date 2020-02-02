'use strict';

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

class Square {
  constructor(size, color) {
    this.type = 'square';
    this.x = 0;
    this.y = 0;
    this.radius = Math.ceil(Math.sqrt(((size / 2) ** 2) * 2));
    this.size = size;
    this.color = color;
    this.area = size ** 2;
    this.moveX = 2;
    this.moveY = -2;
  }

  drawSquare() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.fillStyle = `${this.color}`;
    ctx.fill();
  }
}

class Circle {
  constructor(radius, color) {
    this.type = 'circle';
    this.x = radius;
    this.y = radius;
    this.radius = radius;
    this.color = color;
    this.area = Math.round(radius ** 2 * Math.PI);
    this.moveX = 2;
    this.moveY = -2;
  }

  drawCircle() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `${this.color}`;
    ctx.fill();
  }
}

let getRandomSize = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

let getRandomRGB = () => {
  let rand = Math.random() * (255 + 1);
  return Math.floor(rand);
};

let getRandomColor = () => {
  return `rgb(${getRandomRGB()}, ${getRandomRGB()}, ${getRandomRGB()})`;
};

// Create an array and fill it with 10 circles and 10 squares and then mix
// the array randomly.
let initialArray = [];
for (let i = 0; i < 10; i++) {
  initialArray.push(new Circle(getRandomSize(15, 25), getRandomColor()));
  initialArray.push(new Square(getRandomSize(15, 25), getRandomColor()));
}
initialArray.sort(() => Math.random() - 0.5);

// Adds an object to canvas, shows its properties and split it into two arrays
// by shape.
let iteration = 0;
let circles = [];
let squares = [];
let addToCanvas = () => {
  if (iteration < 20) {
    console.log('№' + (iteration + 1) + '; ', 'type: ' + initialArray[iteration].type + '; ',
      'area: ' + initialArray[iteration].area + '; ', 'color: ' + initialArray[iteration].color);

    if (initialArray[iteration].type === 'circle') circles.push(initialArray[iteration]);
    if (initialArray[iteration].type === 'square') squares.push(initialArray[iteration]);

    iteration++;
  }
};

// Checks whether x: 0; y: 0 coordinates of the canvas is empty so we can add a new
// object safely, not worrying it will place a new object on top of an existing one.
let checkStart = (arrayFirst, arraySecond) => {
  if (arrayFirst.length === 0) return true;

  // Checks for the same shaped object.
  for (let i = 0; i < arrayFirst.length; i++) {
    if (arrayFirst[i].x < 35 + arrayFirst[i].radius && arrayFirst[i].y < 35 + arrayFirst[i].radius) return false;
  }

  // Check for the differently shaped object.
  for (let i = 0; i < arrayFirst.length; i++) {
    for (let j = 0; j < arraySecond.length; j++) {
      if (arrayFirst[i].x < 35 + arrayFirst[i].radius &&
        arrayFirst[i].y < 35 + arrayFirst[i].radius ||
        arraySecond[j].x < 35 + arraySecond[j].radius &&
        arraySecond[j].y < 35 + arraySecond[j].radius) return false;
    }
  }

  return true;
};

let startGame = () => {
  if (checkStart(circles, squares) && checkStart(squares, circles)) addToCanvas();
};
setInterval(startGame, 5000);

// Moves objects on the canvas.
let moveShapes = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach(elem => {
    elem.drawCircle();

    // Checks whether circle hits a side of the canvas.
    if (elem.x + elem.moveX > canvas.width - elem.radius || elem.x + elem.moveX < elem.radius) {
      elem.moveX = -elem.moveX;
    }
    if (elem.y + elem.moveY > canvas.height - elem.radius || elem.y + elem.moveY < elem.radius) {
      elem.moveY = -elem.moveY;
    }

    elem.x += elem.moveX;
    elem.y += elem.moveY;

    // Checks for collision of circles.
    for (let i = 0; i < circles.length; i++) {
      if (elem !== circles[i]) {
        let dx = elem.x - circles[i].x;
        let dy = elem.y - circles[i].y;
        let distance = Math.floor(Math.sqrt(dx ** 2 + dy ** 2));

        if (distance < elem.radius + circles[i].radius) {
          elem.moveX = -elem.moveX;
          elem.moveY = -elem.moveY;

          elem.x += elem.moveX;
          elem.y += elem.moveY;
        }
      }
    }
  });

  squares.forEach(elem => {
    elem.drawSquare();

    // Checks whether square hits a side of the canvas.
    if (elem.x + elem.moveX > canvas.width - elem.size || elem.x + elem.moveX < 0) {
      elem.moveX = -elem.moveX;
    }
    if (elem.y + elem.moveY > canvas.height - elem.size || elem.y + elem.moveY < 0) {
      elem.moveY = -elem.moveY;
    }

    elem.x += elem.moveX;
    elem.y += elem.moveY;

    // Checks for collision of squares.
    for (let i = 0; i < squares.length; i++) {
      if (elem !== squares[i]) {
        if (elem.x < squares[i].x + squares[i].size &&
          elem.x + elem.size > squares[i].x &&
          elem.y < squares[i].y + squares[i].size &&
          elem.y + elem.size > squares[i].y) {

          elem.moveX = -elem.moveX;
          elem.moveY = -elem.moveY;

          elem.x += elem.moveX;
          elem.y += elem.moveY;

          let random = Math.random() - 0.5;
          if (random > 0) {
            elem.moveX = -elem.moveX;
          }
        }
      }
    }
  });

  // Checks for collision of objects with different shapes.
  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j < squares.length; j++) {
      let dx = circles[i].x - squares[j].x - squares[j].radius;
      let dy = circles[i].y - squares[j].y - squares[j].radius;
      let distance = Math.floor(Math.sqrt(dx ** 2 + dy ** 2));

      if (distance < circles[i].radius + squares[j].radius) {

        circles[i].moveX = -circles[i].moveX;
        circles[i].moveY = -circles[i].moveY;

        squares[j].moveX = -squares[j].moveX;
        squares[j].moveY = -squares[j].moveY;

        circles[i].x += circles[i].moveX;
        circles[i].y += circles[i].moveY;

        squares[j].x += squares[j].moveX;
        squares[j].y += squares[j].moveY;
      }
    }
  }
};

setInterval(moveShapes, 10);