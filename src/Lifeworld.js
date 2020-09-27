// model class Lifeworld
"use strict"
class Lifeworld{
    constructor(numCols=60,numRows=40,percentAlive=0.1){
        this.numCols = numCols;
        this.numRows = numRows;
        this.percentAlive = percentAlive;
        this.minLiving = 2;
        this.maxLiving = 3;
        this.minDead = 3;
        this.maxDead = 3;
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.savedWorld = this.buildArray();
        this.randomSetup();
        console.table(this.world); // debugging
    }

    buildArray(){
        let grid = [];
        for (let col=0;col<this.numCols;col++){
            let newColumn = new Array(this.numRows).fill(0);
            grid.push(newColumn);
        }
        return grid;
    }

    randomSetup(){
        for (let col=0;col<this.numCols;col++){
            for (let row=0;row<this.numRows;row++){
                this.world[row][col] = Math.random() < this.percentAlive ? 1 : 0;
            }
        }
    }

    presetSetup(preset){
        this.clear();
        if (preset == "random")
        {
            this.randomSetup();
        }
        else if (preset == "empty")
        {
            return;
        }
        else if (preset == "full")
        {
            for (let col=0;col<this.numCols;col++){
                for (let row=0;row<this.numRows;row++){
                    this.world[row][col] = 1;
                }
            }
        }
        else
        {
            let targetPreset = presets[preset];
            let rowOffset = 0;
            let colOffset = 0;
            for (let col=0;col<this.numCols;col++){
                for (let row=0;row<this.numRows;row++){
                    if (row == 0 && col == 0)
                    {
                        rowOffset = targetPreset[row][1];
                        colOffset = targetPreset[row][0];
                    }
                    else if (targetPreset[row+1] == undefined)
                    {
                        this.world[row+rowOffset][col+colOffset] = 0;
                    }
                    else if (targetPreset[row+1][col] == undefined)
                    {
                        this.world[row+rowOffset][col+colOffset] = 0;
                    }
                    else
                    {
                        this.world[row+rowOffset][col+colOffset] = targetPreset[row+1][col];
                    }
                }
            }
        }
    }

    clear()
    {
        for (let col=0;col<this.numCols;col++){
            for (let row=0;row<this.numRows;row++){
                this.world[row][col] = 0;
            }
        }
    }

    getLivingNeighbors(x,y){
        let arr= this.world; // creating an alias
        if (x > 0 && y > 0 && x < this.numRows - 1 && y < this.numCols - 1){
            let totalAlive=
                arr[x-1][y-1]+
                arr[x][y-1]+
                arr[x+1][y-1]+
                arr[x-1][y]+
                //arr[x][y]+
                arr[x+1][y]+
                arr[x-1][y+1]+
                arr[x][y+1]+
                arr[x+1][y+1];
            return totalAlive;
        }
        else{
            return 0;
        }
    }

    step(){
        if (this.minLiving > this.maxLiving){
            let temp = this.minLiving;
            this.minLiving = this.maxLiving;
            this.maxLiving = temp;
        }
        if (this.minDead > this.maxDead){
            let temp = this.minDead;
            this.minDead = this.maxDead;
            this.maxDead = temp;
        }
        
        for(let x = 0; x < this.numCols; x++){
            for(let y = 0; y < this.numRows; y++){
                let alives = this.getLivingNeighbors(y,x);
                let cell = this.world[y][x];
                this.worldBuffer[y][x] = 0;
                if (cell == 1){
                    if (alives >= this.minLiving && alives <= this.maxLiving){
                        this.worldBuffer[y][x] = 1;
                    }
                }
                else if (cell == 0 && alives >= this.minDead && alives <= this.maxDead){
                    this.worldBuffer[y][x] = 1;
                }
            }
        }

        let temp = this.world;
        this.world = this.worldBuffer;
        this.worldBuffer = temp; 
    }

    save(){
        for(let x = 0; x < this.numCols; x++){
            for(let y = 0; y < this.numRows; y++){
                this.savedWorld[y][x] = this.world[y][x];
            }
        }
    }

    load(){
        for(let x = 0; x < this.numCols; x++){
            for(let y = 0; y < this.numRows; y++){
                this.world[y][x] = this.savedWorld[y][x];
            }
        }
    }
}