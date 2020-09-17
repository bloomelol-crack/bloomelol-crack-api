const SERVICES = [
  'Servicios de PHP',
  'Backend en Node.js',
  'Landing page',
  'Simple mobile app',
  'Servicios informáticos',
  'Java project fixes',
  'Simple Webapp',
  'DB implementation',
  'Asesoramiento en PHP'
];

module.exports = Object.freeze({
  SERVICES,
  getRandomService() {
    return SERVICES[Math.floor(Math.random() * SERVICES.length)];
  }
});
