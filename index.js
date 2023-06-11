(function () {
  'use strict';

  let slideOne;
  let slideTwo;
  let timeOutSlideColumns;
  let controlFly = true;
  let runGame = true;
  let isStopped = false;
  let ground = document.querySelector('.ground');
  let slideColumn = $('.column-slide');
  let secondSlide;
  let checkBirdPosition;
  const bird = document.querySelector('#bird');

  document.addEventListener('keydown', startGame);

  function checkCollision() {
    const birdRect = bird.getBoundingClientRect();
    const columns = document.querySelectorAll('.img-column');

    if (birdRect.top > 416) {
      playSound('hit');
      stopGame();
    }

    columns.forEach((column) => {
      const columnRect = column.getBoundingClientRect();

      if (birdRect.right > columnRect.left && birdRect.left < columnRect.right && birdRect.top < columnRect.bottom && birdRect.bottom > columnRect.top) {
        if (controlFly) {
          playSound('hit');

          setTimeout(() => {
            playSound('die');
          }, 100);

          if (birdRect.right > columnRect.left + 50) {
            bird.style.left = '400px';
            bird.style.transform = 'rotate(200deg)';
          } else {
            bird.style.left = '200px';
            bird.style.transform = 'rotate(-200deg)';
          }

          bird.style.transitionDuration = '.5s';
          bird.style.top = `${birdRect.top - 40}px`;
        }

        stopGame();
      }
    });
  }

  function animateColumns() {
    if (isStopped) {
      return;
    }

    slideColumn.animate({ left: '-1980px' }, 20000, 'linear');

    $('.slide').append(slideColumn.clone());

    secondSlide = $('.column-slide').last().css('left', '900px');

    slideOne = setTimeout(() => {
      secondSlide.animate({ left: '-1980px' }, 20000, 'linear', function () {});
    }, 15000);

    slideTwo = setTimeout(() => {
      slideColumn = secondSlide;
      if (!isStopped) {
        $('.column-slide').first().remove();
      }
    }, 20000);

    timeOutSlideColumns = setTimeout(animateColumns, 15000);
  }

  function stopGame() {
    clearInterval(checkBirdPosition);

    $('h1').html('Game Over Press ENTER');

    controlFly = false;

    clearTimeout(timeOutSlideColumns);
    clearTimeout(slideOne);
    clearTimeout(slideTwo);

    ground.classList.add('poused');
    $('.column-slide').stop();
    slideColumn.stop();
    isStopped = true;
  }

  function playSound(sound) {
    const audio = new Audio(`sounds/${sound}.mp3`);
    audio.play();
  }

  function startGame(event) {
    const birdRect = bird.getBoundingClientRect();

    if (event.keyCode === 13) {
      location.reload();
    }

    if (event.keyCode === 32) {
      if (runGame) {
        checkBirdPosition = setInterval(checkCollision, 40);
        $('h1').html('');
        animateColumns();
        bird.classList.remove('fly');
        runGame = false;
      }

      if (controlFly) {
        playSound('flap');

        bird.style.top = `${birdRect.top - 80}px`;
        bird.style.transition = '.3s';

        bird.addEventListener('transitionend', function () {
          bird.style.top = '455px';
          bird.style.transition = '.5s ease-in';
        });
      }
    }
  }
})();

// function animateGround() {
//   const newGround = ground.cloneNode(true);
//   document.querySelector('.container').appendChild(newGround).style.left = '900px';

//   setTimeout(function () {
//     document.querySelectorAll('.ground')[0].style.left = '-900px';
//     document.querySelectorAll('.ground')[1].style.left = '0';
//   }, 15);

//   setTimeout(function () {
//     ground = newGround;
//     document.querySelectorAll('.ground')[0].remove();
//   }, 6000);

//   timeOutSlideGround = setTimeout(animateGround, 6015);
// }
