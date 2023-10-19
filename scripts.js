document.addEventListener("DOMContentLoaded", function () {

  const cubes = document.querySelectorAll(".box-cube");

  const transitionTime = "750ms";
  const shakeButtons = document.querySelectorAll(".shakeButton");
  const randomSale = {
    "1": "sale-100k.png",
    "2": "sale-150k.png",
    "3": "sale-200k.png",
    "4": "sale-250k.png",
  };
  let randomValue;
  cubes.forEach(function (cube) {
    const ctop = cube.querySelector(".top");
    const cleft = cube.querySelector(".left");
    const cright = cube.querySelector(".right");
    const glow = cube.querySelector(".hexagon");
    const powerup = cube.querySelector(".powerup");

    ctop.style.transition = `all ${transitionTime}`;
    cleft.style.transition = `all ${transitionTime}`;
    cright.style.transition = `all ${transitionTime}`;
    powerup.style.transition = `all ${transitionTime}`;
    glow.style.transition = `all ${transitionTime}`;
    
    let isOpen = false;

    cube.addEventListener("click", function () {
      if (!isOpen) { // Kiểm tra xem cube có được mở hay không
        cube.classList.add("shake");
        setTimeout(function () {
          cube.classList.remove("shake");
          openCube(cube);
          isOpen = true; // Đánh dấu cube đã được mở
          showExplotion()
          disableOtherCubes(); // Vô hiệu hóa các cube khác
        }, 2000);
        setTimeout(function () {
          showPopup();
        }, 4000);
      }
    });

    function openCube(cube) {
      award(cube);
      ctop.style.transform = "translateY(-3rem)";
      cleft.style.transform = "translateX(-3rem)";
      cright.style.transform = "translateX(3rem)";
      ctop.style.opacity = 0.1;
      cleft.style.opacity = 0.1;
      cright.style.opacity = 0.1;
      glow.style.opacity = 0.5;
      powerup.style.opacity = 1;
      cube.style.animationPlayState = "paused";
      powerup.style.zIndex = 10;
      powerup.style.height = "250px";
      powerup.style.width = "250px";
    }
    function changeVar(cube, glow) {
      cube.style.setProperty("--glow", glow);
    }

    function award(cube) {
      const keys = Object.keys(randomSale);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      randomValue = randomSale[randomKey];
      // Các phần tử powerup trong cube cụ thể
      const cubePowerup = cube.querySelector(".powerup");
      cubePowerup.style.backgroundImage = `url(${randomValue})`;
      document.getElementById("img-sale").setAttribute("src", randomValue);
      changeVar(cube, "rgba(69,185,251,0.33)");
    }
    function disableOtherCubes() {
      cubes.forEach(function (otherCube) {
        if (otherCube !== cube) {
          otherCube.classList.add("no-click");
        }
      });
    }
    
    function showExplotion() {
      const animation = document.getElementById("confetti");
      animation.style.display = "block";
      // global variables
      const confetti = document.getElementById('confetti');
      const confettiCtx = confetti.getContext('2d');
      let container, confettiElements = [], clickPosition;

      // helper
      rand = (min, max) => Math.random() * (max - min) + min;

      // params to play with
      const confettiParams = {
        // number of confetti per "explosion"
        number: 70,
        // min and max size for each rectangle
        size: { x: [5, 20], y: [10, 18] },
        // power of explosion
        initSpeed: 25,
        // defines how fast particles go down after blast-off
        gravity: 0.65,
        // how wide is explosion
        drag: 0.08,
        // how slow particles are falling
        terminalVelocity: 6,
        // how fast particles are rotating around themselves
        flipSpeed: 0.017,
      };
      const colors = [
        { front: '#3B870A', back: '#235106' },
        { front: '#B96300', back: '#6f3b00' },
        { front: '#E23D34', back: '#88251f' },
        { front: '#CD3168', back: '#7b1d3e' },
        { front: '#664E8B', back: '#3d2f53' },
        { front: '#394F78', back: '#222f48' },
        { front: '#008A8A', back: '#005353' },
        { front: '#3B870A', back: '#235106' },
        { front: '#B96300', back: '#6f3b00' },
        { front: '#E23D34', back: '#88251f' },
        { front: '#CD3168', back: '#7b1d3e' },
        { front: '#664E8B', back: '#3d2f53' },
        { front: '#394F78', back: '#222f48' },
        { front: '#008A8A', back: '#005353' },
      ];

      setupCanvas();
      updateConfetti();

      confetti.addEventListener('click', addConfetti);
      window.addEventListener('resize', () => {
        setupCanvas();
        hideConfetti();
      });

      // Confetti constructor
      function Conf() {
        this.randomModifier = rand(-1, 1);
        this.colorPair = colors[Math.floor(rand(0, colors.length))];
        this.dimensions = {
          x: rand(confettiParams.size.x[0], confettiParams.size.x[1]),
          y: rand(confettiParams.size.y[0], confettiParams.size.y[1]),
        };
        this.position = {
          x: clickPosition[0],
          y: clickPosition[1]
        };
        this.rotation = rand(0, 2 * Math.PI);
        this.scale = { x: 1, y: 1 };
        this.velocity = {
          x: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.4,
          y: rand(-confettiParams.initSpeed, confettiParams.initSpeed)
        };
        this.flipSpeed = rand(0.2, 1.5) * confettiParams.flipSpeed;

        if (this.position.y <= container.h) {
          this.velocity.y = -Math.abs(this.velocity.y);
        }

        this.terminalVelocity = rand(1, 1.5) * confettiParams.terminalVelocity;

        this.update = function () {
          this.velocity.x *= 0.98;
          this.position.x += this.velocity.x;

          this.velocity.y += (this.randomModifier * confettiParams.drag);
          this.velocity.y += confettiParams.gravity;
          this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
          this.position.y += this.velocity.y;

          this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
          this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
        }
      }

      function updateConfetti() {
        confettiCtx.clearRect(0, 0, container.w, container.h);

        confettiElements.forEach((c) => {
          c.update();
          confettiCtx.translate(c.position.x, c.position.y);
          confettiCtx.rotate(c.rotation);
          const width = (c.dimensions.x * c.scale.x);
          const height = (c.dimensions.y * c.scale.y);
          confettiCtx.fillStyle = c.color;
          confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
          confettiCtx.setTransform(1, 0, 0, 1, 0, 0)
        });

        confettiElements.forEach((c, idx) => {
          if (c.position.y > container.h ||
            c.position.x < -0.5 * container.x ||
            c.position.x > 1.5 * container.x) {
            confettiElements.splice(idx, 1)
          }
        });
        window.requestAnimationFrame(updateConfetti);
      }

      function setupCanvas() {
        container = {
          w: confetti.clientWidth,
          h: confetti.clientHeight
        };
        confetti.width = container.w;
        confetti.height = container.h;
      }

      function addConfetti(e) {
        const canvasBox = confetti.getBoundingClientRect();
        if (e) {
          clickPosition = [
            e.clientX - canvasBox.left,
            e.clientY - canvasBox.top
          ];
        } else {
          clickPosition = [
            canvasBox.width * Math.random(),
            canvasBox.height * Math.random()
          ];
        }
        for (let i = 0; i < confettiParams.number; i++) {
          confettiElements.push(new Conf())
        }
      }

      function hideConfetti() {
        confettiElements = [];
        window.cancelAnimationFrame(updateConfetti)
      }

      confettiLoop();
      function confettiLoop() {
        addConfetti();
        setTimeout(confettiLoop, 700 + Math.random() * 1700);
      }
    }
    function showPopup() {
      const popup = document.getElementById("myPopup");
      popup.style.display = "block";
    }

  });
});
