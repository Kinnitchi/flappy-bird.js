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
      this.setY(0)
    } else if (newY >= heightMax) {
      this.setY(heightMax)
    } else {
      this.setY(newY)
    }
  }
  this.setY(heightGame / 2)
}

// TESTE ANIMAÇÂP
const b = new Barrels(700, 1200, 200, 400);
const bird = new Bird(700)
const a = document.querySelector('[wm-flappy]');

a.appendChild(bird.elementDom)
b.pair.forEach(pair => a.appendChild(pair.elementDom));
setInterval(() => {
  b.animate();
  bird.animate();
}, 20);