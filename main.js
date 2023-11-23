import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  },
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" },
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;
let numSuika = 0;
let score = 0;
let nextIndex = Math.floor(Math.random() * 5);
const highestScore = localStorage.getItem("highest");

// 목표 위치의 요소를 가져옴
const nextElement = document.getElementById("next");
const scoreElement = document.getElementById("score");
const highestElement = document.getElementById("highest");

const updateScore = () => {
  scoreElement.textContent = score;
};

const nextFruit = () => {
  nextElement.src = FRUITS_BASE[nextIndex].name + ".png";
};

const updateHighest = () => {
  highestElement.textContent = highestScore;
};

const addFruit = () => {
  const index = nextIndex;
  nextIndex = Math.floor(Math.random() * 5);
  nextFruit();
  const fruit = FRUITS_BASE[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` },
    },
    restitution: 0.3,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
};

window.onkeydown = (event) => {
  if (disableAction) {
    return;
  }

  switch (event.code) {
    case "KeyA":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyD":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590)
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);
      break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
};

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;
      if (index === FRUITS_BASE.length - 1) {
        score += 66;
        updateScore();
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS_BASE[index + 1];
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: { sprite: { texture: `${newFruit.name}.png` } },
          index: index + 1,
        }
      );

      World.add(world, newBody);

      score += newFruit.score;
      updateScore();

      if (newFruit === FRUITS_BASE[10]) {
        numSuika += 1;
      }
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")
    ) {
      alert("Game over");
      if (highestScore < score) {
        localStorage.setItem("highest", `${score}`);
      }
      location.reload();
    }

    /* if (numSuika === 2) {
      alert("Clear!!!");
    } */
  });
});

updateHighest();
updateScore();
nextFruit();
addFruit();
