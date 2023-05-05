
/*Nombre del juego; Rey maldito 
Nombre del grupo: DS creative
Integrantes: Sergio Ortiz (creativo y diseños)
              Diego Guzman (programador)
Fecha : 04/05/2023
MAteria: DESARROLLO DE VIDEOJUEGOS
Docente: Dennnis Delgado A.
*/

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 // 1024
canvas.height = 64 * 9 // 576

let parsedCollisions
let collisionBlocks
let background
let doors
const player = new Player({
  imageSrc: './img/king/idle.png',
  frameRate: 11,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idle.png',
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idleLeft.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runRight.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runLeft.png',
    },
    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: './img/king/enterDoor.png',
      onComplete: () => {
        console.log('completed animation')
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++

            if (level === 4) level = 1
            levels[level].init()
            player.switchSprite('idleRight')
            player.preventInput = false
            gsap.to(overlay, {
              opacity: 0,
            })
          },
        })
      },
    },
  },
})

//crear el jugador
const playerpig = new Player({
  imageSrc: './img_pig/Ground.png',
  frameRate: 2,
  animations: {
    idleRight: {
      frameRate: 2,
      frameBuffer: 50,
      loop: true,
      imageSrc: './img_pig/Ground.png',
    },
    idleLeft: {
      frameRate: 20,
      frameBuffer: 70,
      loop: true,
      imageSrc: './img_pig/Attack (38x28).png',
    },
    runRight: {
      frameRate: 2,
      frameBuffer: 50,
      loop: true,
      imageSrc: './img_pig/Run (38x28).png',
    },
    runLeft: {
      frameRate: 2,
      frameBuffer: 50,
      loop: true,
      imageSrc: './img_pig/Run (38x28).png',
    },
    enterDoor: {
      frameRate: 2,
      frameBuffer: 50,
      loop: false,
      imageSrc: './img/king/enterDoor.png',
      onComplete: () => {
        console.log('completed animation')
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++

            if (level === 4) level = 1
            levels[level].init()
            player.switchSprite('idleRight')
            player.preventInput = false
            gsap.to(overlay, {
              opacity: 0,
            })
          },
        })
      },
    },
  },
})
let level = 3
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      if (player.currentAnimation) player.currentAnimation.isActive = false
      if (playerpig.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel1.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 767,
            y: 270,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      player.position.x = 96
      player.position.y = 140
      playerpig.position.x = 120
      playerpig.position.y = 160

      if (player.currentAnimation) player.currentAnimation.isActive = false
      if (playerpig.currentAnimation) player.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel2.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 772.0,
            y: 336,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D()
      player.collisionBlocks = collisionBlocks
      player.position.x = 750
      player.position.y = 230
      playerpig.collisionBlocks = collisionBlocks
      playerpig.position.x = 750
      if (player.currentAnimation) player.currentAnimation.isActive = false
      if (playerpig.currentAnimation) playerpig.currentAnimation.isActive = false

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel3.png',
      })

      doors = [
        new Sprite({
          position: {
            x: 176.0,
            y: 335,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
}

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

const overlay = {
  opacity: 0,
}

//funcion donde inicia todo
function animate() {
  window.requestAnimationFrame(animate)

  background.draw()


  doors.forEach((door) => {
    door.draw()
  })

  player.handleInput(keys)
  player.draw()
  player.update()

  playerpig.handleInput(keys)
  playerpig.draw()
  playerpig.update()

  c.save()
  c.globalAlpha = overlay.opacity
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.restore()

}

levels[level].init()
animate()
//ToDo: Implementar que al terminar el juego se pasa a la parte de la pelea final
// if (gameOver) {
//   window.location.replace("index.js");
// }

function startGame(){
  location.href = 'index.html';
  
  const audio = new Audio('./enter-hallownest.mp3');
  audio.loop = true; 
  audio.play();
}
function startHistory(){
  location.href = 'index3.html';
}
function FinalLevel(){
  location.href = '../Peleas/fighting-game/index.html';
}
function Menu() {
  location.href = 'index2.html';
}

function instructions(){
  alert('Utiliza los botones a y d para moverte hacia la izquierda y hacia la derecha . Presiona w para saltar. Y flecha de de abajo y s para atacar (En el nivel final)')
}
const botonIniciar = document.getElementById("boton-iniciar");
const tituloJuego = document.getElementById("titulo-juego");
const instruccionesJuego = document.getElementById("instrucciones-juego");

botonIniciar.addEventListener("click", function() {
  tituloJuego.style.display = "block";
  instruccionesJuego.style.display = "block";
});
function playMusic(){
  const audio = new Audio('./musica.mp3');
  audio.loop = true; // para que la música se repita en un bucle
  audio.play(); // para reproducir la música automáticamente
}
