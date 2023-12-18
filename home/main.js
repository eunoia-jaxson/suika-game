import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { BALLS_BASE } from "../balls";
import {
  dbService,
  collection,
  orderBy,
  limit,
  query,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "../fbase";

const name = localStorage.getItem("user");
const nameElement = document.getElementById("userName");
nameElement.textContent = name;

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.getElementById("canvas-container"),
  options: {
    wireframes: false,
    background: "#EDE9FA",
    width: 620,
    height: 850,
  },
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#8E41F1" },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#808FF7" },
});

const gradient = render.context.createLinearGradient(0, 0, 620, 0);
gradient.addColorStop(1021 / 10000, "#8E41F1");
gradient.addColorStop(9067 / 10000, "#808FF7");

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: gradient },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: gradient },
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

document.body.style.overflow = "hidden";
if (localStorage.getItem("mode") === null) {
  localStorage.setItem("mode", "false");
}

let currentBody = null;
let currentBall = null;
let disableAction = false;
let interval = null;
let numSuika = 0;
let score = 0;
let collisionId = 0;
let nextIndex = Math.floor(Math.random() * 5);
let isRunning = false;
let millisecond = 0;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let highestScore = 0;
let fastestRecord = 5999999;
async function fetchData() {
  await getDocs(
    query(collection(dbService, "scores"), orderBy("score", "desc"), limit(5))
  )
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc, i) => {
        const scoreElement = document.getElementById(`highScore-${i + 1}`);
        scoreElement.textContent = `${i + 1}   |   ${doc.data().score}   |   ${
          doc.id
        }`;
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  await getDocs(
    query(collection(dbService, "records"), orderBy("record"), limit(5))
  )
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc, i) => {
        const scoreElement = document.getElementById(`highRecord-${i + 1}`);
        const milliseconds = Math.floor((doc.data().record % 1000) / 10);
        const minutes = Math.floor(doc.data().record / 1000 / 60);
        const seconds = Math.floor((doc.data().record / 1000) % 60);
        const record =
          formatTime(minutes) +
          ":" +
          formatTime(seconds) +
          "." +
          formatTime(milliseconds);
        scoreElement.textContent = `${i + 1}   |   ${record}   |   ${doc.id}`;
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  const scoreSnap = await getDoc(doc(dbService, "scores", name));
  highestScore = scoreSnap.data() === undefined ? 0 : scoreSnap.data().score;
  const recordSnap = await getDoc(doc(dbService, "records", name));
  fastestRecord =
    recordSnap.data() === undefined ? 5999999 : recordSnap.data().record;
  updateHighest();
  updateFastest();
}

fetchData();

// 목표 위치의 요소를 가져옴
const nextElement = document.getElementById("next");
const scoreElement = document.getElementById("score");
const highestElement = document.getElementById("highestScore");
const toggleSwitch = document.getElementById("toggleSwitch");
const switchCheckbox = document.getElementById("switchCheckbox");
const labelForSwitch = document.querySelector('label[for="toggleSwitch"]');
const scoreMode = document.getElementById("scoreMode");
const speedRunMode = document.getElementById("speedRunMode");
const scoreBoard = document.getElementById("scoreBoard");
const speedRunBoard = document.getElementById("recordBoard");
const recordElement = document.getElementById("record");
const fastestElement = document.getElementById("fastestRecord");
const modeBar = document.querySelector(".modeBar");
switchCheckbox.checked = localStorage.getItem("mode") === "true";

const nextBall = () => {
  nextElement.src = "../" + BALLS_BASE[nextIndex].name + ".png";
};

const updateScore = () => {
  scoreElement.textContent = score;
};

function updateRecord() {
  millisecond += 10;
  milliseconds++;
  if (milliseconds === 100) {
    milliseconds = 0;
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
  }

  recordElement.textContent =
    formatTime(minutes) +
    ":" +
    formatTime(seconds) +
    "." +
    formatTime(milliseconds);
}

const updateHighest = () => {
  highestElement.textContent = highestScore;
  if (highestScore < score) highestElement.textContent = score;
};

const updateFastest = () => {
  const milliseconds = Math.floor((fastestRecord % 1000) / 10);
  const minutes = Math.floor(fastestRecord / 60000);
  const seconds = Math.floor((fastestRecord / 1000) % 60);
  const record =
    formatTime(minutes) +
    ":" +
    formatTime(seconds) +
    "." +
    formatTime(milliseconds);
  fastestElement.textContent = record;
};

function updateLabelContent() {
  labelForSwitch.textContent = switchCheckbox.checked
    ? "SpeedRun Mode"
    : "Score Mode";
}

function updateContentVisibility() {
  if (switchCheckbox.checked) {
    speedRunMode.style.display = "block";
    scoreMode.style.display = "none";
    speedRunBoard.style.display = "block";
    scoreBoard.style.display = "none";
  } else {
    speedRunMode.style.display = "none";
    scoreMode.style.display = "block";
    speedRunBoard.style.display = "none";
    scoreBoard.style.display = "block";
  }
}

function formatTime(time) {
  return time < 10 ? "0" + time : time;
}

const addBall = () => {
  const index = nextIndex;
  nextIndex = Math.floor(Math.random() * 5);
  nextBall();
  const ball = BALLS_BASE[index];

  const body = Bodies.circle(300, 50, ball.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `../${ball.name}.png` },
    },
    restitution: 0.3,
  });

  currentBody = body;
  currentBall = ball;

  World.add(world, body);
};

window.onkeydown = (event) => {
  if (disableAction) return;

  switch (event.code) {
    case "KeyA":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x - currentBall.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyD":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x + currentBall.radius < 590)
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyS":
      clearInterval(interval);
      interval = null;
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addBall();
        disableAction = false;
      }, 1000);

      if (world.bodies.length === 6) {
        modeBar.classList.add("disabled");
      }

      if (switchCheckbox.checked) {
        if (isRunning) {
          return;
        } else {
          setInterval(updateRecord, 10);
        }

        isRunning = true;
      }
      break;

    case "ArrowLeft":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x - currentBall.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "ArrowRight":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x + currentBall.radius < 590)
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "ArrowDown":
      clearInterval(interval);
      interval = null;
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addBall();
        disableAction = false;
      }, 1000);

      if (world.bodies.length === 5) {
        modeBar.classList.add("disabled");
      }

      if (switchCheckbox.checked) {
        if (isRunning) {
          return;
        } else {
          setInterval(updateRecord, 10);
        }

        isRunning = true;
      }
      break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
    case "ArrowLeft":
    case "ArrowRight":
      clearInterval(interval);
      interval = null;
  }
};

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach(async (collision) => {
    if (collisionId === collision.bodyB.id) return;

    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;
      if (!switchCheckbox.checked && index === BALLS_BASE.length - 1) {
        score += 66;
        updateScore();
        updateHighest();
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newBall = BALLS_BASE[index + 1];
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newBall.radius,
        {
          render: { sprite: { texture: `../${newBall.name}.png` } },
          index: index + 1,
        }
      );

      World.add(world, newBody);

      if (!switchCheckbox.checked) {
        score += newBall.score;
        updateScore();
        updateHighest();
      }

      if (newBall === BALLS_BASE[10]) {
        numSuika += 1;
      }

      collisionId = collision.bodyB.id;
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")
    ) {
      if (!switchCheckbox.checked && highestScore < score) {
        await setDoc(doc(dbService, "scores", name), {
          score: score,
        });
      }
      disableAction = true;
      alert("Game over");
      location.reload();
    }

    if (switchCheckbox.checked && numSuika === 1) {
      if (millisecond < fastestRecord) {
        await setDoc(doc(dbService, "records", name), {
          record: millisecond,
        });
      }
      alert("Clear!!!");
      location.reload();
    }
  });
});

toggleSwitch.addEventListener("click", function () {
  switchCheckbox.checked = !switchCheckbox.checked;
  localStorage.setItem("mode", `${switchCheckbox.checked}`);
  updateLabelContent();
  updateContentVisibility();
});

updateLabelContent();
updateContentVisibility();
nextBall();
addBall();
