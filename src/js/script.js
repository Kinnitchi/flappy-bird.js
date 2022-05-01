function RemoveSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
}

function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

function Barrel(reverse = false) {
  this.elementDom = newElement('div', 'barrel');

  const border = newElement('div', 'border');
  const body = newElement('div', 'body');
  this.elementDom.appendChild(reverse ? body : border);
  this.elementDom.appendChild(reverse ? border : body);

  this.setHeight = height => body.style.height = `${height}px`;
}

function BarrelsPair(height, aperture, x) {
  this.elementDom = newElement('div', 'barrel-pair');

  this.roof = new Barrel(true);
  this.ground = new Barrel(false);

  this.elementDom.appendChild(this.roof.elementDom);
  this.elementDom.appendChild(this.ground.elementDom);

  this.sortAperture = () => {
    const heightRoof = Math.random() * (height - aperture);
    const heightGround = height - aperture - heightRoof;
    this.roof.setHeight(heightRoof);
    this.ground.setHeight(heightGround);
  }

  this.getX = () => parseInt(this.elementDom.style.left.split('px')[0]);
  this.setX = x => this.elementDom.style.left = `${x}px`;
  this.getLarge = () => this.elementDom.clientWidth;

  this.sortAperture();
  this.setX(x);
}

function Barrels(height, large, aperture, space, notifyPoint) {
  this.pair = [
    new BarrelsPair(height, aperture, large),
    new BarrelsPair(height, aperture, large + space),
    new BarrelsPair(height, aperture, large + space * 2),
    new BarrelsPair(height, aperture, large + space * 3)
  ];

  const displacement = 2;
  this.animate = () => {
    this.pair.forEach(pair => {
      pair.setX(pair.getX() - displacement);

      // quando o elemento sai da area do game
      if (pair.getX() < -pair.getLarge()) {
        pair.setX(pair.getX() + space * this.pair.length);
        pair.sortAperture();
      }

      const mid = large / 2;
      const middleCross = pair.getX() + displacement >= mid &&
        pair.getX() < mid
      if (middleCross) notifyPoint()
    })
  }
}

function Bird(heightGame) {
  let fly = false;

  this.elementDom = newElement('img', 'bird');
  this.elementDom.src = '../src/styles/imgs/bird.png';

  this.getY = () => parseInt(this.elementDom.style.bottom.split('px')[0]);
  this.setY = y => this.elementDom.style.bottom = `${y}px`;

  window.onkeydown = e => fly = true;
  window.onkeyup = e => fly = false;

  this.animate = () => {
    const newY = this.getY() + (fly ? 5 : -2);
    const heightMax = heightGame - this.elementDom.clientHeight;

    if (newY <= 0) {
      this.setY(0);
    } else if (newY >= heightMax) {
      this.setY(heightMax);
    } else {
      this.setY(newY);
    }
  }
  this.setY(heightGame / 2);
}

function Progress() {
  this.elementDom = newElement('span', 'progress');
  this.addPoints = points => {
    this.elementDom.innerHTML = points;
  }
  this.addPoints(0)
}

function overlapping(elementA, elementB) {
  const a = elementA.getBoundingClientRect();
  const b = elementB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left &&
    b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top &&
    b.top + b.height >= a.top

  return horizontal && vertical
}

function collision(bird, barrels) {
  let collision = false;
  barrels.pair.forEach(BarrelsPair => {
    if (!collision) {
      const rooftop = BarrelsPair.roof.elementDom
      const groundend = BarrelsPair.ground.elementDom
      collision = overlapping(bird.elementDom, rooftop) ||
        overlapping(bird.elementDom, groundend)
    }
  })
  return collision
}

function FlappyBird() {
  let points = 0;

  const gameArea = document.querySelector('[wm-flappy]');
  const height = gameArea.clientHeight;
  const large = gameArea.clientWidth;

  const progress = new Progress();
  const barrels = new Barrels(height, large, 200, 400,
    () => progress.addPoints(++points));
  const bird = new Bird(height);

  gameArea.appendChild(progress.elementDom);
  gameArea.appendChild(bird.elementDom);
  barrels.pair.forEach(pair => gameArea.appendChild(pair.elementDom));

  this.start = () => {
    //loop for game
    const timer = setInterval(() => {
      barrels.animate();
      bird.animate();
      if (collision(bird, barrels)) {
        clearInterval(timer)
      }
    }, 20)
  }
}

new FlappyBird().start()