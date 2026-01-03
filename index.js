export class Gameboard{
    constructor(){
        this.ships = [];
        this.size = 10;
        this.board = [];

        for(let i = 0; i < 10; i++){
            const rows = [];
            for(let j = 0;j < 10; j++){
                rows.push({x: j, y: i, state: "empty", ship: null});
            }
            this.board.push(rows);
    }
}

    placeShip(ship, startX, startY, direction = "horizontal", ){
        let coords = [];

        for(let i = 0; i < ship.length; i ++){
            let x = startX;
            let y = startY;

            if(direction === "horizontal") x += i;
            else y += i;

            if(
                x >= this.size ||
                y >= this.size ||
                this.board[x][y].ship
            ) {
                return false;
            }

            coords.push([x, y]);
        }

        coords.forEach(([x, y]) => {
            this.board[x][y].ship = ship
        });

        this.ships.push(ship);
        return true;
    }

    receiveAttack(x, y){
        let attackCoordinates = this.board[x][y];
        if(attackCoordinates.ship){
                attackCoordinates.ship.hit();
                attackCoordinates.state = "hit";
                return true;
        } else {
                attackCoordinates.state = "miss";
                return false;
            }
    }

    endOfGame(){
    return (this.ships.length > 0 && this.ships.every(ship => ship.sunk));
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
        if(this.hits >= this.length){
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
    nextTarget = [];
    lastMove = [];

    getMove(type){
        if(this.type === "computer" && this.currentTarget.length === 0){
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            this.lastMove = [x, y];
            return[x, y];
        } else if(this.type === "computer" && this.currentTarget.length > 0){
            if(this.nextTarget.length === 0){
                let [x, y] = this.currentTarget[0];
                let adjacentCells = [
                    [x+1, y],
                    [x-1, y],
                    [x, y+1],
                    [x, y-1]
                ];
                this.nextTarget.push(...adjacentCells);
            }
            let randomIndex = Math.floor(Math.random() * this.nextTarget.length);
            let chosenMove = this.nextTarget[randomIndex];
            this.lastMove = chosenMove;
            this.nextTarget.splice(randomIndex, 1);
            return chosenMove;
        } else {
            return null;
        }
    }
        processAttackResults(coordinates, wasHit, isSunk = false){
            if (wasHit) {
                this.previousHits.push(coordinates);

                if(this.currentTarget.length === 0){
                    this.currentTarget.push(coordinates);

                    //if two hits or more - determine direction
                } else if(this.previousHits.length >= 2){
                    let firstHit = this.currentTarget[0];
                    let secondHit = this.previousHits[this.previousHits.length - 1];

                     //horizontal x values are different
                    if(firstHit[0] !== secondHit[0]) {
                        let minX = Math.min(firstHit[0], secondHit[0]);
                        let maxX = Math.max(firstHit[0], secondHit[0]);
                        let y = firstHit[1];

                        this.nextTarget = [[minX-1, y], [maxX+1, y]];
                    } else {
                        let minY = Math.min(firstHit[1], secondHit[1]);
                        let maxY = Math.max(firstHit[1], secondHit[1]);
                        let x = firstHit[0];

                        this.nextTarget = [[x, minY - 1], [x, maxY + 1]];
                    }
                }
                //if more than 2 hits in a row and last move was a miss, determine if left right up or down is the direction to pursue
                else if(this.previousHits.length > 2 && JSON.stringify(this.lastMove) === JSON.stringify(this.previousHits[this.previousHits.length - 1])){
                    let lastHit = this.previousHits[this.previousHits.length - 1];
                    let secondLastHit = this.previousHits[this.previousHits.length - 2];
                    
                    //direction is horizontal
                    if(firstHit[0] !== secondHit[0]){
                        let direction = lastHit[0] - secondLastHit[0]; //determines left or right based on + or -
                        this.nextTarget.push([lastHit[0] + direction, lastHit[1]]);
                    } else {
                        let direction = lastHit[1] - secondLastHit[1]; //determine up or down based on + or -
                        this.nextTarget.push([lastHit[0], lastHit[1] + direction]);
                    }
                }
                    if(isSunk){
                        this.currentTarget = [];
                        this.nextTarget = [];
                    } 
                
                
                else {
                        this.previousMisses.push(coordinates);
                    }
                } 
        }
}