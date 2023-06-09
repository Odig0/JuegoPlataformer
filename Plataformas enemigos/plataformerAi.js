const Player = function(x, y, source_x, behavior) {

    this.x = x; this.y = y; this.source_x = source_x;
    this.behavior = behavior;

};
let img = "platformer-ai.png"
Player.prototype.behave = function() { this.behavior(this); }

const Block = function(x, y, behavior) {

    Player.call(this, x, y, 160, behavior);

    this.state = "waiting";
    this.vy = 0;
    this.anchor_y = y;

}

Object.assign(Block.prototype, Player.prototype);

const Dude = function(x, y, behavior) {

    Player.call(this, x, y, 144, behavior);

    this.vx = this.vy = 0;
    this.jumping = true;

}

Object.assign(Dude.prototype, Player.prototype);

const Fox = function(x, y, behavior) {

    Player.call(this, x, y, 192, behavior);

    this.vx = this.vy = 0;
    this.jumping = true;
    this.target = undefined;

}

Object.assign(Fox.prototype, Player.prototype);

const Ghost = function(x, y, behavior) {

    Player.call(this, x, y, 128, behavior);

    this.vx = 0;
    this.destination_x = x;

}

Object.assign(Ghost.prototype, Player.prototype);

const Spike = function(x, y, behavior) {

    Player.call(this, x, y, 176, behavior);

    this.anchor_x = x;
    this.anchor_y = y;
    this.d = 0;
    this.range = 20;

}

Object.assign(Spike.prototype, Player.prototype);

function blockBehavior(block) {

    switch(block.state) {

        case "waiting":

            for (let index = players.length - 1; index > -1; -- index) {

                let player = players[index];

                if (player == block) continue;

                if (player.x + tile_size * 0.5 > block.x && player.x + tile_size * 0.5 < block.x + tile_size) { block.state = "falling"; return; }

            }

        break;
        case "falling":

            block.vy += gravity;

            block.y += block.vy;

            block.vy *= friction;

            if (block.y > floor) { block.y = floor; block.vy = 0; this.state = "rising"; }

        break;
        case "rising":

            block.vy = -0.5;

            block.y += block.vy;

            if (block.y < block.anchor_y) { block.y = block.anchor_y; block.vy = 0; block.state = "waiting"; }

        break;

    }

}

function dudeBehavior(dude) {

    dude.vy += gravity;

    if (pointer.down && !dude.jumping && pointer.y < dude.y) {

        dude.jumping = true;
        dude.vy = -16;

    }

    if (dude.jumping) dude.vx = (pointer.x - dude.x - tile_size * 0.5) * 0.1;
    else dude.vx = (pointer.x - dude.x - tile_size * 0.5) * 0.025;

    dude.x += dude.vx;
    dude.y += dude.vy;

    dude.vy *= friction;

    if (dude.y > floor) { dude.y = floor; dude.jumping = false; }

}

function foxBehavior(fox) {

    let d = fox.target.x - fox.x;

    fox.vy += gravity;

    if (d * d > 1000) {

        if (fox.jumping)fox.vx += d * 0.025;
        else fox.vx = d * 0.025;

    }

    if (fox.target.jumping && !fox.jumping) {

        fox.jumping = true;
        fox.vy = -10;

    }

    if (fox.vx > 4) fox.vx = 4;
    else if (fox.vx < -4) fox.vx = -4;

    fox.x += fox.vx;
    fox.y += fox.vy;

    fox.vx *= friction;
    fox.vy *= friction;

    if (fox.y > floor) { fox.jumping = false; fox.y = floor; fox.vy = 0; }

}

function ghostBehavior(ghost) {

    let d = ghost.destination_x - ghost.x;

    ghost.vx += d * 0.001;

    if (d * d < 16) ghost.destination_x = Math.random() * map_columns * tile_size - tile_size;

    if (ghost.vx > 0.5) ghost.vx = 0.5;
    else if (ghost.vx < -0.5) ghost.vx = -0.5;

    ghost.x += ghost.vx;

    ghost.vx *= friction;

}

function spikeBehaviorA(spike) {

    spike.d += 0.05;

    spike.x = spike.anchor_x + Math.cos(spike.d) * spike.range;
    spike.y = spike.anchor_y + Math.sin(spike.d) * spike.range * 0.5;

}

function spikeBehaviorB(spike) {

    spike.d += 0.05;

    spike.x = spike.anchor_x + Math.cos(spike.d) * spike.range * 0.5;
    spike.y = spike.anchor_y + Math.sin(spike.d) * spike.range;

}

var tile_set = new Image();
var tile_size = 16;
var map_columns = 16;
var map_rows = 12;
var map_ratio = map_columns / map_rows;
var map_scale = 1;
var map = [1,1,0,0,1,0,0,1,1,0,1,0,1,1,0,0,
                   0,1,0,1,0,1,0,0,1,1,0,1,0,0,1,1,
                   1,0,1,1,1,0,0,1,0,0,0,1,0,1,0,0,
                   0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,
                   1,0,1,0,0,1,1,1,0,0,0,0,1,1,0,0,
                   0,1,0,0,1,0,0,0,0,1,0,1,0,0,1,0,
                   0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,
                   7,7,0,7,0,0,0,0,0,7,0,7,0,0,7,0,
                   6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
                   4,4,4,4,4,4,4,4,4,4,5,0,2,4,4,5,
                   4,4,4,4,4,5,2,4,4,4,0,0,3,4,5,0,
                   5,0,2,4,5,0,3,4,4,5,0,0,3,4,0,0];

var floor = 116;
var friction = 0.9;
var gravity = 1;

var context = document.querySelector("canvas").getContext("2d");
var buffer = document.createElement("canvas").getContext("2d");

var screen_h = document.documentElement.clientHeight - 16;
var screen_w = document.documentElement.clientWidth - 16;

var pointer = { x:map_columns * tile_size * 0.5, y:0, down:false };

var players = [ new Block(32, 16, blockBehavior),
                                new Dude(64, floor, dudeBehavior),
                                new Fox (80, floor, foxBehavior),
                                new Ghost(96, floor, ghostBehavior),
                                new Ghost(112, floor, ghostBehavior),
                                new Spike(160, 80, spikeBehaviorA),
                                new Spike(208, 80, spikeBehaviorB)];

players[2].target = players[1];

function loop() {

    window.requestAnimationFrame(loop);

    screen_h = document.documentElement.clientHeight - 16;
    screen_w = document.documentElement.clientWidth - 16;

    if (screen_h / buffer.canvas.height < screen_w / buffer.canvas.width) screen_w = screen_h * map_ratio;
    else screen_h = screen_w / map_ratio;

    map_scale = screen_h / (map_rows * tile_size);

    context.canvas.height = screen_h;
    context.canvas.width = screen_w;
    context.imageSmoothingEnabled = false;

    for (let index = map.length - 1; index > -1; -- index) {

        let value = map[index];
        let tile_x = (index % map_columns) * tile_size;
        let tile_y = Math.floor(index / map_columns) * tile_size;

        buffer.drawImage(tile_set, value * tile_size, 0, tile_size, tile_size, tile_x, tile_y, tile_size, tile_size);

    }

    for (let index = players.length - 1; index > -1; -- index) {

        let player = players[index];

        player.behave();

        // Added Math.round after video
        buffer.drawImage(tile_set, player.source_x, 0, tile_size, tile_size, Math.round(player.x), Math.round(player.y), tile_size, tile_size);

    }

    pointer.down = false;

    context.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);

}

buffer.canvas.height = map_rows * tile_size;
buffer.canvas.width = map_columns * tile_size;

tile_set.addEventListener("load", (event) => { loop(); });
tile_set.src = "platformer-ai.png";

context.canvas.addEventListener("click", (event) => {

    var rectangle = event.target.getBoundingClientRect();

    pointer.x = (event.pageX - rectangle.left) / map_scale;
    pointer.y = (event.pageY - rectangle.top) / map_scale;
    pointer.down = true;

});
