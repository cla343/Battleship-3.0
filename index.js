export class Gameboard{
    constructor(){
        this.
    }
}

export class Ship{
    constructor(length){
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    hit(){
        this.hits++;
        this.isSunk();
    }

    isSunk(){
        if(this.hits > this.length){
            this.sunk = true;
            return true;
        }
    }
}

export class Player{
    constructor(name, type = "human"){
        this.name = name;
        this.type = type;
        this.board = new Gameboard();
    } 

    previousHits = [];
    previousMisses = [];
    currentTarget = [];

    getMove(type){
        if(this.type === "computer" && this.currentTarget === null){
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            return[x, y];
        }
        return null;
    }
}