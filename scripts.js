document.addEventListener("DOMContentLoaded", function () {
  // lấy tất cả các box ra
  const cubes = document.querySelectorAll(".box-cube");
  const transitionTime = "750ms";

  // Phần này random các hình theo mảng
  const randomSale = {
    "1": "sale-100k.png",
    "2": "sale-150k.png",
    "3": "sale-200k.png",
    "4": "sale-250k.png",
    "5": "sale-300k.png",
    "6": "sale-100k.png",
  };
  // tạo sẵn giá trị random để lưu vào local storage khi người dùng đã mở hộp rồi
  let randomValue;


  //các nút đóng và xử lý input cho chuỗi
  const closeButton = document.querySelector(".close")
  closeButton.addEventListener("click", function () {
    closePopupGift()
  });
  const getGiftButton = document.querySelector(".btn-get-sale");
  getGiftButton.addEventListener("click", function () {
    closePopupGift();
    showPopupDataUser()
  })
  const closeGetData = document.querySelector(".closeGetData");
  closeGetData.addEventListener("click", function () {
    closePopupDataUser()
  })
  const closeCoupon = document.querySelector(".closeShowCoupon");
  closeCoupon.addEventListener("click", function () {
    closeShowCoupon();
  })
  const btnGetData = document.querySelector(".btn-get-data");
  btnGetData.addEventListener("click", function () {
    var fullName = document.getElementById("fullName").value;
    var phoneNumber = document.getElementById("phoneNumber").value;

    var fullNameRegex = /^[A-Za-z\s]+$/;
    var phoneRegex = /^\d{10}$/;

    var errorMessage = "";

    if (!fullName.match(fullNameRegex)) {
      errorMessage += "Họ và tên không hợp lệ. </br>";
    }

    if (!phoneNumber.match(phoneRegex)) {
      errorMessage += "Số điện thoại không hợp lệ. Số điện thoại phải có 10 chữ số.";
    }

    var errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.innerHTML = errorMessage;

    if (!errorMessage) {
      // Đóng popup cũ và chỗ này cho người dùng mã coupon
      // Chỗ này để gửi dữ liệu của khách hàng và nhận mã code ở đây
      closePopupDataUser();
      showCoupon();
      const getGift = document.querySelector(".popup-get-gift");
      getGift.style.display = "none";
    }
  })


  // Xử lý nút copy coupon cho người dùng
  $(document).ready(function () {
    $('#copyButton').click(function () {
      var couponCode = $('#coupon').text();

      // Yêu cầu sự cho phép của người dùng để truy cập clipboard
      navigator.clipboard.writeText(couponCode)
        .then(function () {
          var buttonCopy = document.querySelector(".img-copy");
          buttonCopy.src = "done-icon.png";
          var couponShow = document.querySelector(".Coupon-show");
          couponShow.style.background = "rgb(167 236 136)";

        })
        .catch(function (err) {
          console.error('Lỗi khi sao chép vào clipboard: ', err);
        });
    });
  });
  function showCoupon() {
    const popupShowCoupon = document.getElementById("popupShowCoupon");
    popupShowCoupon.style.display = "block";
  }



  //thay đổi cái glow đằng sau box khi mở box
  function changeVar(cube, glow) {
    cube.style.setProperty("--glow", glow);
  }

  function award(cube) {
    // Xử lý random ở đây
    const keys = Object.keys(randomSale);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    randomValue = randomSale[randomKey];
    // Các phần tử powerup trong cube cụ thể
    const cubePowerup = cube.querySelector(".powerup");
    cubePowerup.style.backgroundImage = `url(${randomValue})`;
    document.getElementById("img-sale").setAttribute("src", randomValue);
    changeVar(cube, "rgba(69,185,251,0.33)");
  }



  //hiệu ứng pháo bông khi mở box
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

  //show và close các popup
  function showPopupGift() {
    const popup = document.getElementById("popupShowGift");
    popup.style.display = "block";
  }
  function showPopupDataUser() {
    const getDataUser = document.getElementById("formDataUser");
    getDataUser.style.display = "block";
  }
  function closePopupGift() {
    const popupGift = document.getElementById("popupShowGift");
    const animation = document.getElementById("confetti");
    popupGift.style.display = "none";
    animation.style.display = "none";
  }
  function closePopupDataUser() {
    const popupDataUser = document.getElementById("formDataUser");
    popupDataUser.style.display = "none";
  }
  function closeShowCoupon() {
    const closeShowCoupon = document.getElementById("popupShowCoupon");
    closeShowCoupon.style.display = "none"
  }

  //hàm kiểm tra xem biến giá trị random value và id của box có trong localstorage hay không
  // nếu có thì ta sẽ mở sẵn giá trị đó khi tải trang
  // nếu không thì mới cho người dùng mở hộp
  if (localStorage.getItem("randomValue") && localStorage.getItem("cubeId")) {
    const randomValue = localStorage.getItem("randomValue");
    const cubeId = localStorage.getItem("cubeId");
    const cubeElement = document.getElementById(cubeId);
    let isOpen = false;

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

      //hàm kiểm tra xem đã có box nào mở chưa nếu có add class không cho mở nữa
      function disableOtherCubes() {
        cubes.forEach(function (otherCube) {
          if (otherCube !== cube) {
            otherCube.classList.add("no-click");
          }
        });
      }
      function openCube(cube) {
        const cubePowerup = cube.querySelector(".powerup");
        cubePowerup.style.backgroundImage = `url(${randomValue})`;
        document.getElementById("img-sale").setAttribute("src", randomValue);
        changeVar(cube, "rgba(69,185,251,0.33)");

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
      if (!isOpen) {
        disableOtherCubes(); //không cho mở box khi có box đã mở
        openCube(cubeElement); // mở box với giá trị đã lưu trong localstogare
        isOpen = true;
        const getGift = document.querySelector(".popup-get-gift"); // hiện button nhận thưởng
        getGift.style.display = "block";
        getGift.addEventListener("click", function () {
          showPopupGift();
        });
      }
    })

    // khi không tồn tại giá trị nào trong local storage
  } else {
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
      function disableOtherCubes() {
        cubes.forEach(function (otherCube) {
          if (otherCube !== cube) {
            otherCube.classList.add("no-click");
          }
        });
      }
      function openCube(cube) {
        award(cube); //random cho các voucher và lấy hình ản
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
      cube.addEventListener("click", function () {
        if (!isOpen) { // Kiểm tra xem cube có được mở hay không
          cube.classList.add("shake");
          disableOtherCubes();
          setTimeout(function () {
            cube.classList.remove("shake");
            openCube(cube);
            isOpen = true; // Đánh dấu cube đã được mở
            showExplotion()
            const cubeId = cube.getAttribute("id");
            localStorage.setItem("cubeId", cubeId);
            localStorage.setItem("randomValue", randomValue);
            const getGift = document.querySelector(".btn-get-gift");
            getGift.style.display = "block";
            getGift.addEventListener("click", function () {
              showPopupGift();
            });
          }, 2000);
          setTimeout(function () {
            showPopupGift();
          }, 4000);
        }
      });
    })
  }
});
