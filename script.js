let fireParticles = [];

let introFinished = false;

let bgValue = 0;
let transition = false;

let headerShown = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initial explosion
  for (let i = 0; i < 300; i++) {
    fireParticles.push(new FireParticle(width / 2, height / 2, true));
  }
}

function draw() {

  // Background transition
  if (transition) {

    bgValue += 3;

    if (bgValue > 255) {
      bgValue = 255;
    }

    background(bgValue);

  } else {
    background(0, 35);
  }

  // Continuous inferno AFTER intro
  if (introFinished) {

    // rising flames from bottom
    for (let i = 0; i < 6; i++) {

      let x = width / 2 + random(-250, 250);

      fireParticles.push(
        new FireParticle(x, height - 50, false)
      );
    }

    // mouse fire interaction
    if (mouseIsPressed) {

      for (let i = 0; i < 10; i++) {

        fireParticles.push(
          new FireParticle(mouseX, mouseY, false, true)
        );
      }
    }
  }

  // Update + draw particles (FIXED LOOP)
  for (let i = fireParticles.length - 1; i >= 0; i--) {

    let p = fireParticles[i];

    p.update();
    p.show();

    if (p.finished()) {
      fireParticles.splice(i, 1);
    }
  }

  // Show header only once, after explosion calms down
  if (!headerShown && introFinished && fireParticles.length < 80) {

    headerShown = true;

    document.getElementById("header").classList.add("show");
  }
}

/* =========================
   FIRE PARTICLE
========================= */

class FireParticle {

  constructor(x, y, explosion = false, mouseFire = false) {

    this.pos = createVector(x, y);

    if (explosion) {

      let angle = random(TWO_PI);
      let speed = random(2, 12);

      this.vel = p5.Vector.fromAngle(angle).mult(speed);

    } else {

      this.vel = createVector(
        random(-1.5, 1.5),
        random(-6, -2)
      );
    }

    // mouse attraction (FIXED)
    if (mouseFire) {

      let mouseVector = createVector(
        mouseX - this.pos.x,
        mouseY - this.pos.y
      );

      mouseVector.mult(0.002);

      this.vel.add(mouseVector);
    }

    this.alpha = 255;

    this.size = random(8, 24);

    // fire color palette
    this.r = random(220, 255);
    this.g = random(50, 180);
    this.b = random(0, 40);
  }

  update() {

    this.pos.add(this.vel);

    // rising fire motion
    this.vel.y -= 0.02;

    // flicker drift
    this.vel.x += random(-0.05, 0.05);

    this.alpha -= 3;
  }

  show() {

    noStroke();

    // glow
    fill(this.r, this.g, this.b, this.alpha * 0.25);
    circle(this.pos.x, this.pos.y, this.size * 2);

    // core flame
    fill(this.r, this.g, this.b, this.alpha);
    circle(this.pos.x, this.pos.y, this.size);
  }

  finished() {
    return this.alpha <= 0;
  }
}

/* =========================
   INTRO CONTROL
========================= */

function mousePressed() {
  beginSite();
}

function keyPressed() {
  beginSite();
}

function beginSite() {

  if (introFinished) return;

  introFinished = true;

  transition = true;

  // optional: clear explosion instantly for clean transition
  fireParticles = [];

  const overlay = document.getElementById("overlay");

  overlay.style.opacity = "0";

  setTimeout(() => {

    overlay.style.display = "none";

    document.body.style.background = "black";

    document.getElementById("mainPage").style.display = "flex";

  }, 1000);
}

/* =========================
   BUTTONS
========================= */

const aboutBtn = document.getElementById("aboutBtn");
const aboutBubble = document.getElementById("aboutBubble");

aboutBtn.addEventListener("click", () => {

  aboutBubble.style.display =
    aboutBubble.style.display === "block"
      ? "none"
      : "block";
});


const testBtn = document.getElementById("testBtn");
const testBubble = document.getElementById("testBubble");

testBtn.addEventListener("click", () => {

  testBubble.style.display =
    testBubble.style.display === "block"
      ? "none"
      : "block";
});

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function openAgent() {
  window.open(
    "https://m365.cloud.microsoft/chat/?titleId=T_35842a7d-e7d8-25c3-87a4-290cf3d0593b&source=embedded-builder"
  );
}