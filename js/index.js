window.onload = function () {
  let canvas = document.getElementById('c');
  let ctx = canvas.getContext('2d');
  let width = window.innerWidth - 4;
  let height = window.innerHeight - 4;
  canvas.width = width;
  canvas.height = height;


  function getPresetJSON() {
    return {
      "preset": "Default",
      "closed": false,
      "remembered": {
        "Jelly Slime": {
          "0": {
            "JOIN_DIST": 50,
            "STIFFNESS": 0.02,
            "GRAVITY": 1,
          }
        },
        "Sticky Slime": {
          "0": {
            "JOIN_DIST": 40,
            "STIFFNESS": 0.4,
            "GRAVITY": 0,
          }
        }
      }
    };
  }
  // DAT.GUI CONFIGS
  let config = {
    PARTICLES_COUNT: 200,
    JOIN_DIST: 50,
    STIFFNESS: 0.02,
    GRAVITY: 1,
    POINT_COLOR: '#40ffa6',
    LINE_COLOR: '#1ba364'
  }

  // GUI STUFF
  let gui = new dat.GUI({ load: getPresetJSON() });
  gui.remember(config);

  let CountController = gui.add(config, 'PARTICLES_COUNT', 10, 500).name('Particles Count');
  gui.add(config, 'JOIN_DIST', 10, 200).name('Join Distance');
  gui.add(config, 'STIFFNESS', 0, 2).step(0.01).name('stiffness');
  gui.add(config, 'GRAVITY', -1, 1).step(0.01).name('gravity');
  let PointColorController = gui.addColor(config, 'POINT_COLOR').name('Points Color');
  let LineColorController = gui.addColor(config, 'LINE_COLOR').name('Stick Color');
  PointColorController.onChange((value) => {
    for (let p of fluid.points) {
      p.setColor(value)
    }
  })
  LineColorController.onChange((value) => {
    for (let s of fluid.sticks) {
      s.setColor(value)
    }
  })
  CountController.onChange(() => {
    fluid.points = [];
    fluid.init();
  });



  // init verly
  let verly = new Verly(50, canvas, ctx);
  let fluid = new Fluid(50, verly, config);
  verly.addEntity(fluid);

  function animate() {
    ctx.fillStyle = '#090909';
    ctx.fillRect(0, 0, width, height);

    verly.update();
    verly.render();

    fluid.setGravity(new Vector(0, config.GRAVITY));
    fluid.makeSurfaceTension();

    // make all the points repel each other and also the Mouse
    for (let i = 0; i < fluid.points.length; i++) {
      // check for NaN and reset
      if (isNaN(fluid.points[i].pos.x) || isNaN(fluid.points[i].pos.y)) {
        fluid.points = [];
        fluid.init();
        break;
      }
      fluid.points[i].resolveBehaviors({ pos: verly.mouse.coord }, 200, 15);
      for (let j = 0; j < fluid.points.length; j++) {
        fluid.points[j].resolveBehaviors(fluid.points[i], config.JOIN_DIST - 10, 10);
        fluid.points[i].resolveBehaviors(fluid.points[j], config.JOIN_DIST - 10, 10);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}