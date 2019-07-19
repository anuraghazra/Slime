// class Fluid
class Fluid extends Entity {
  constructor(itteration, verly, config) {
    super(itteration, verly)
    this.config = config;

    this.init();
  }

  init() {
    for (let i = 0; i < this.config.PARTICLES_COUNT; i++) {
      this.addFluid();
    }
  }

  addFluid() {
    let p = new Point(random(this.verlyInstance.WIDTH), random(this.verlyInstance.HEIGHT)).setRadius(5);
    this.addPoint(p).setColor(this.config.POINT_COLOR)
  }

  // fancy named function
  makeSurfaceTension() {
    this.sticks = [];
    for (let i = 0; i < this.points.length; i++) {
      for (let j = 0; j < this.points.length; j++) {
        let dist = this.points[i].pos.dist(this.points[j].pos);

        if (dist > 0 && dist < this.config.JOIN_DIST) {
          let s = this.addStick(i, j)
            .setStiffness(this.config.STIFFNESS)
            .setColor(this.config.LINE_COLOR);
        }
      }
    }
  }
}