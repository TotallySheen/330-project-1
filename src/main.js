"use strict"

let canvas, ctx;
const canvasWidth = 600, canvasHeight = 400;
const cellWidth = 10;
const fps = 12;
let lifeworld;
let showGrid = false;
let paused = true;

window.onload = init;

function init(){
	canvas = document.querySelector("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");

    // setting up event handlers
    setEvents();

    lifeworld = new Lifeworld(60,40,.2)
	draw();
}

function loop(){
    if (paused) return;
	setTimeout(loop,1000/fps);
    lifeworld.step();
    draw();
}

function draw(fullClear = false){
    drawBackground(fullClear);
    drawWorld();
    if (showGrid)
    {
        drawGrid();
    }
}

function drawBackground(fullClear = false){
	ctx.save();
    ctx.fillStyle = "white";
    if (!fullClear){
        ctx.globalAlpha = 4/fps;
    }
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
}

function drawWorld(){
    ctx.save();
    for(let col=0;col<lifeworld.numCols;col++){
        for(let row=0;row<lifeworld.numRows;row++){
            drawCell(col,row,cellWidth,lifeworld.world[col][row]);
        }
    }
    ctx.restore();
}

function drawCell(col,row,dimensions,alive) {
   spgLIB.drawRectangle(ctx,col*dimensions,row*dimensions,dimensions,dimensions, alive ? 'lime' : 'rgba(0,0,0,0)');
}

function setEvents()
{
    document.querySelector("#grid").onchange = function(e){
        showGrid = e.target.checked;
        if (paused && showGrid)
        {
            drawGrid();
        }
        else if (paused)
        {
            drawBackground(true);
            drawWorld();
        }
    }

    document.querySelector("#play").onclick = function(e){
        if (paused)
        {
            paused = false;
            loop();
            document.querySelector("#step").disabled = true;
        }
    }

    document.querySelector("#pause").onclick = function(e){
        paused = true;
        document.querySelector("#step").disabled = false;
        draw(true);
    }

    document.querySelector("#reset").onclick = function(e){
        lifeworld.randomSetup();
        if (paused){
            draw(true);
        }
    }
    document.querySelector("#step").onclick = function(e){
        if (paused){
            lifeworld.step();
            draw(true);
        }
    }

    document.querySelector("#minAlive").oninput = function(e){
        document.querySelector("#minAliveNum").innerHTML = e.target.value;
        lifeworld.minLiving = e.target.value;
    }
    document.querySelector("#maxAlive").oninput = function(e){
        document.querySelector("#maxAliveNum").innerHTML = e.target.value;
        lifeworld.maxLiving = e.target.value;
    }
    document.querySelector("#minDead").oninput = function(e){
        document.querySelector("#minDeadNum").innerHTML = e.target.value;
        lifeworld.minDead = e.target.value;
    }
    document.querySelector("#maxDead").oninput = function(e){
        document.querySelector("#maxDeadNum").innerHTML = e.target.value;
        lifeworld.maxDead = e.target.value;
    }
}

function drawGrid()
{
    ctx.save();
    for (let col=0; col<=lifeworld.numCols; col++)
    {
        ctx.moveTo(col*cellWidth,0);
        ctx.lineTo(col*cellWidth,canvasHeight);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    for (let row=0; row<=lifeworld.numRows; row++)
    {
        ctx.moveTo(0,row*cellWidth);
        ctx.lineTo(canvasWidth,row*cellWidth);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    ctx.restore();
}