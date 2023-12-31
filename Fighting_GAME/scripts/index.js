const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './images/background.png'
})

const shop = new Sprite({
    position: {
        x: 630,
        y: 139
    },
    imageSrc: './images/shop_anim.png',
    scale: 2.7,
    framesMax: 6,
})


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './images/Samurai Mack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './images/Samurai Mack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './images/Samurai Mack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/Samurai Mack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/Samurai Mack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './images/Samurai Mack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './images/Samurai Mack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './images/Samurai Mack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './images/Kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 173
    },
    sprites: {
        idle: {
            imageSrc: './images/Kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './images/Kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './images/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './images/Kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './images/Kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './images/Kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './images/Kenji/Death2.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

console.log(player);

const keys = {
    //player keys
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    //enemy keys
    ArrowRight: {
        pressed:  false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

//decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    
    player.velocity.x = 0
    enemy.velocity.x = 0
    
    //player mvmnt
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    
    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    
    
    //enemy mvmnt
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    
    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    
    //detect collision
    if (
        rectCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }
    
    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }
    
    //if player gets hit
    if (
        rectCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }
    
    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }
    
    //end based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }
    
    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                keys.ArrowUp.pressed = true
                enemy.velocity = -20
                break
            case 'ArrowDown':
                enemy.attack()
                
                break
        }
    }
})

window.addEventListener('keyup',  (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
            
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
    console.log(event.key)
})
