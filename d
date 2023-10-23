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
    openCube(cubeElement); // mở box với giá trị đã lưu trong localstorage
    isOpen = true;
  }
})