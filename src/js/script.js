function newElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element
}

function Barrels(reverse = false) {
  this.divBarrels = newElement('div', 'barrel');

  const border = newElement('div', 'border');
  const body = newElement('div', 'body');
  this.divBarrels.appendChild(reverse ? body : border);
  this.divBarrels.appendChild(reverse ? border : body);

  this.setHeight = height => body.style.height = `${height}px`
}

// const b = new Barrels(true);
// b.setHeight(200);
// document.querySelector('[wm-flappy]').appendChild(b.divBarrels)

function BarrelsPair(height, aperture, x) {
  this.divBarrels = newElement('div', 'barrel-pair');

  this.roof = new Barrels(true);
  this.ground = new Barrels(false);

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

const b = new BarrelsPair(700, 200, 400);
document.querySelector('[wm-flappy]').appendChild(b.divBarrels);