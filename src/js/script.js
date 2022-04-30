function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

function Barrel(reverse = false) {
  this.divBarrels = newElement('div', 'barrel');

  const border = newElement('div', 'border');
  const body = newElement('div', 'body');
  this.divBarrels.appendChild(reverse ? body : border);
  this.divBarrels.appendChild(reverse ? border : body);

  this.setHeight = height => body.style.height = `${height}px`;
}

function BarrelsPair(height, aperture, x) {
  this.divBarrels = newElement('div', 'barrel-pair');

  this.roof = new Barrel(true);
  this.ground = new Barrel(false);

  this.divBarrels.appendChild(this.roof.divBarrels);
  this.divBarrels.appendChild(this.ground.divBarrels);

  this.sortAperture = () => {
    const heightRoof = Math.random() * (height - aperture);
    const heightGround = height - aperture - heightRoof;
    this.roof.setHeight(heightRoof);
    this.ground.setHeight(heightGround);
  }

  this.getX = () => parseInt(this.divBarrels.style.left.split('px')[0]);
  this.setX = x => this.divBarrels.style.left = `${x}px`;
  this.getLarge = () => this.divBarrels.clientWidth;

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

  const displacement = 3;
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


// TESTE ANIMAÇÂP
const b = new Barrels(700, 1200, 200, 400);
const a = document.querySelector('[wm-flappy]');
b.pair.forEach(pair => a.appendChild(pair.divBarrels));
setInterval(() => {
  b.animate()
}, 20);