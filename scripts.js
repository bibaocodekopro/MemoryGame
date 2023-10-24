document.addEventListener("DOMContentLoaded", function () {
  // lấy tất cả các box ra
  const cubes = document.querySelectorAll(".box-cube");
  const transitionTime = "750ms";

  // Phần này random các hình theo mảng
  // const randomSale = {
  //   "100k1": "https://dev.khoavang.vn/resources/uploads/mistery-box/sale-100k-1698051402.png?_t=1698051402",
  //   "100k2": "https://dev.khoavang.vn/resources/uploads/mistery-box/sale-100k-1698051402.png?_t=1698051402",
  //   "100k3": "https://dev.khoavang.vn/resources/uploads/mistery-box/sale-100k-1698051402.png?_t=1698051402",
  //   "150k": "https://dev.khoavang.vn/resources/uploads/mistery-box/sale-150k-1698051402.png?_t=1698051402",
  //   "200k": "https://dev.khoavang.vn/resources/uploads/mistery-box/sale-200k-1698051402.png?_t=1698051403",
  //   "250k": "https://dev.khoavang.vn/resources/uploads/mistery-box/sale-250k-1698051403.png?_t=1698051403",
  // };
  const randomSale = [
    { money: 100000, percent: 8.89, img: 'https://dev.khoavang.vn/resources/uploads/mistery-box/sale-100k-1698051402.png?_t=1698051402' },
    { money: 150000, percent: 13.33, img: 'https://dev.khoavang.vn/resources/uploads/mistery-box/sale-150k-1698051402.png?_t=1698051402' },
    { money: 200000, percent: 20, img: 'https://dev.khoavang.vn/resources/uploads/mistery-box/sale-200k-1698051402.png?_t=1698051403' },
    { money: 250000, percent: 27.78, img: 'https://dev.khoavang.vn/resources/uploads/mistery-box/sale-250k-1698051403.png?_t=1698051403' },
    { money: 300000, percent: 24.44, img: 'https://dev.khoavang.vn/resources/uploads/mistery-box/sale-300k-1698051403.png?_t=1698051403' },
    { money: 400000, percent: 5.56, img: 'https://dev.khoavang.vn/resources/uploads/mistery-box/sale-400k-1698141687.png?_t=1698141687' },
  ];
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
      //lưu IP vào local storage để so sánh, tránh để người dùng nhập đi nhập lại nhiều lần
      if (typeof (Storage) !== "undefined") {
        getIpAddress(function (ipAddress) {
          localStorage.setItem("userIpAddress", ipAddress);
        });
      }
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
          buttonCopy.src = "https://dev.khoavang.vn/resources/uploads/mistery-box/done-icon-1698051402.png?_t=1698051402";
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
  // Hàm chọn ngẫu nhiên một mục từ mảng dựa trên phần trăm
  function getRandomItemByPercent(arr) {
    const totalPercent = arr.reduce((acc, item) => acc + item.percent, 0);
    let randomValue = Math.random() * totalPercent;

    for (const item of arr) {
      if (randomValue < item.percent) {
        return item;
      }
      randomValue -= item.percent;
    }

    // Trong trường hợp không tìm thấy giá trị (sai số hoặc percent lớn hơn tổng percent)
    return null;
  }
  function award(cube) {
    // Xử lý random ở đây
    randomValue = getRandomItemByPercent(randomSale).img;
    if (randomValue) {
      const cubePowerup = cube.querySelector(".powerup");
      cubePowerup.style.backgroundImage = `url(${randomValue})`;
      document.getElementById("img-sale").setAttribute("src", randomValue);
      changeVar(cube, "rgba(69,185,251,0.33)");
    } else {
      console.log("Không tìm thấy giá trị phù hợp.");
    }
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

  function getIpAddress(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.ipify.org?format=json", true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        const ipAddress = response.ip;
        callback(ipAddress);
      }
    };

    xhr.send();
  }


  //hàm kiểm tra xem biến giá trị random value và id của box có trong localstorage hay không
  // nếu có thì ta sẽ mở sẵn giá trị đó khi tải trang
  // nếu không thì mới cho người dùng mở hộp
  //hàm kiểm tra xem đã có box nào mở chưa nếu có add class không cho mở nữa
  function disableOtherCubes(openedCube, allCubes) {
    allCubes.forEach(function (otherCube) {
      if (otherCube !== openedCube) {
        otherCube.classList.add("no-click");
      }
    });
  }
  //đầu tiên ta điều kiện người này đã nhận voucher chưa (theo ip) nếu rồi thì hiện ra mã đã nhận
  if (localStorage.getItem("userIpAddress")) {
    const savedIpAddress = localStorage.getItem("userIpAddress");
    getIpAddress(function (currentIpAddress) {
      if (savedIpAddress === currentIpAddress) {
        const randomValue = localStorage.getItem("randomValue");
        const cubeId = localStorage.getItem("cubeId");
        const cubeElement = document.getElementById(cubeId);

        const ctop = cubeElement.querySelector(".top");
        const cleft = cubeElement.querySelector(".left");
        const cright = cubeElement.querySelector(".right");
        const glow = cubeElement.querySelector(".hexagon");
        const powerup = cubeElement.querySelector(".powerup");

        ctop.style.transition = `all ${transitionTime}`;
        cleft.style.transition = `all ${transitionTime}`;
        cright.style.transition = `all ${transitionTime}`;
        powerup.style.transition = `all ${transitionTime}`;
        glow.style.transition = `all ${transitionTime}`;


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
        disableOtherCubes(cubeElement, cubes); // Pass both cubeElement and cubes
        openCube(cubeElement); // mở cube với giá trị đã lưu trong local storage
      }
    });
    //ta kiểm tra xem người mã đã mở chưa nếu mở rồi mà chưa nhận voucher thì hiện nút cho ngta nhận thưởng
  } else {
    if (localStorage.getItem("randomValue") && localStorage.getItem("cubeId")) {
      const randomValue = localStorage.getItem("randomValue");
      const cubeId = localStorage.getItem("cubeId");
      const cubeElement = document.getElementById(cubeId);

      const ctop = cubeElement.querySelector(".top");
      const cleft = cubeElement.querySelector(".left");
      const cright = cubeElement.querySelector(".right");
      const glow = cubeElement.querySelector(".hexagon");
      const powerup = cubeElement.querySelector(".powerup");

      ctop.style.transition = `all ${transitionTime}`;
      cleft.style.transition = `all ${transitionTime}`;
      cright.style.transition = `all ${transitionTime}`;
      powerup.style.transition = `all ${transitionTime}`;
      glow.style.transition = `all ${transitionTime}`;

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

      disableOtherCubes(cubeElement, cubes); // Pass both cubeElement and cubes
      openCube(cubeElement); // mở cube với giá trị đã lưu trong local storage
      const getGift = document.querySelector(".popup-get-gift"); // hiện button nhận thưởng
      getGift.style.display = "block";
      getGift.addEventListener("click", function () {
        showPopupGift();
      });


      // nếu người dùng chưa mở cái nào và chưa nhận cái nào thì cho họ mở mới.
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
              console.log("randomvaue: " + randomValue + "cubeId:" + cubeId);
              console.log(cube)
              const getGift = document.querySelector(".popup-get-gift");
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
  }
  // chỉnh sửa form bootstrap lại tiếng việt
  $(document).ready(function () {

    $('#table-get-user').DataTable({
      "language": {
        "lengthMenu": "Hiển thị _MENU_ dòng",
        "zeroRecords": "Không tìm thấy kết quả",
        "info": "Hiển thị _START_ đến _END_ trong tổng số _TOTAL_ dòng",
        "infoEmpty": "Hiển thị 0 đến 0 trong tổng số 0 dòng",
        "infoFiltered": "(được lọc từ _MAX_ tổng dòng)",
        "search": "Tìm kiếm:",
        "paginate": {
          "first": "Đầu",
          "previous": "<",
          "next": ">",
          "last": "Cuối"
        }
      }
    });
  });

});


