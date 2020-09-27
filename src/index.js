"use strict"

let canvas, ctx;
let canvasWidth = 600, canvasHeight = 400;
let cellWidth = 10;
let fps = 12;
let lifeworld;
let showGrid = false;
let paused = true;
let saved = false;

window.onload = init;

function init(){
    canvas = document.querySelector("canvas");
    cellWidth = Math.floor(window.innerWidth / 120);
    canvasWidth = cellWidth * 60;
    canvasHeight = cellWidth * 40;
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
    if (!fullClear){
        ctx.globalAlpha = 4/fps;
    }
    spgLIB.drawRectangle(ctx,0,0,canvasWidth,canvasHeight,"black");
	ctx.restore();
}

function drawWorld(){
    ctx.save();
    for(let col=0;col<lifeworld.numCols;col++){
        for(let row=0;row<lifeworld.numRows;row++){
            drawCell(col,row,cellWidth,lifeworld.world[row][col]);
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
            document.querySelector("#play").disabled = true;
            document.querySelector("#pause").disabled = false;
            document.querySelector("#step").disabled = true;
            document.querySelector("#save").disabled = true;
            document.querySelector("#toggle").style.visibility = "hidden";
        }
    }

    document.querySelector("#pause").onclick = function(e){
        paused = true;
        document.querySelector("#play").disabled = false;
        document.querySelector("#pause").disabled = true;
        document.querySelector("#step").disabled = false;
        document.querySelector("#save").disabled = false;
        document.querySelector("#toggle").style.visibility = "visible";
        draw(true);
    }

    document.querySelector("#reset").onclick = function(e){
        let preset = document.querySelector("#presets").value;
        lifeworld.presetSetup(preset);
        draw(true);
    }
    document.querySelector("#step").onclick = function(e){
        if (paused){
            lifeworld.step();
            draw(true);
        }
    }
    document.querySelector("#save").onclick = function(e){
        lifeworld.save();
        saved=true;
    }
    document.querySelector("#load").onclick = function(e){
        if (saved){
            lifeworld.load();
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

    document.querySelector("#presets").onchange = function(e){
        lifeworld.presetSetup(e.target.value);
        draw(true);
    }

    document.querySelectorAll('input[name="fps"]').forEach(function(radio){
        radio.onchange = function(e){
            fps = e.target.value;
        }
    });

    canvas.onclick = function(e){
        if (paused)
        {
            let rect = e.target.getBoundingClientRect();
            let mouseX = e.clientX - rect.x;
            let mouseY = e.clientY - rect.y;
            let cellX = Math.floor(mouseX / cellWidth);
            let cellY = Math.floor(mouseY / cellWidth);
            console.log(cellX,cellY);
            if (lifeworld.world[cellY][cellX] == 1){
                lifeworld.world[cellY][cellX] = 0;
            }
            else if (lifeworld.world[cellY][cellX] == 0){
                lifeworld.world[cellY][cellX] = 1;
            }
            draw(true);
        }
    }

    window.onresize = function(e){
        cellWidth = Math.floor(window.innerWidth / 120);
        canvasWidth = cellWidth * 60;
        canvasHeight = cellWidth * 40;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        draw(true);
    }
}

function drawGrid()
{
    ctx.save();
    for (let col=0; col<=lifeworld.numCols; col++)
    {
        spgLIB.drawLine(ctx,col*cellWidth,0,col*cellWidth,canvasHeight,'gray',1);
    }
    for (let row=0; row<=lifeworld.numRows; row++)
    {
        ctx.moveTo(0,row*cellWidth);
        ctx.lineTo(canvasWidth,row*cellWidth);
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        ctx.stroke();
        spgLIB.drawLine(ctx,0,row*cellWidth,canvasWidth,row*cellWidth,'gray',1);
    }
    ctx.restore();
}