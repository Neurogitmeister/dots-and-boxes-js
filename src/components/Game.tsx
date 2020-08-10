import React, { Component } from 'react'
import { GameSettingsList } from './header/GameSettings'

interface GameScreenState extends GameSettingsList {
    playerCount: number
}

export class Game extends Component<GameScreenState, GameScreenState> {
    constructor(props : any) {
        super(props)
        this.state = {
            columns :       this.props.columns,
            rows:           this.props.rows,
            playerNames:    this.props.playerNames,
            playerPicURLs:  this.props.playerPicURLs,
            playerColors:   this.props.playerColors,
            firstMove:      this.props.firstMove,
            playerCount:    this.props.playerCount,
            gamesToWin:     this.props.gamesToWin,
            dotsSize:       this.props.dotsSize,
            dotsColor:      this.props.dotsColor,
        }
    }
    logic = new GameLogic(
        this.props.columns, 
        this.props.rows,
        this.props.playerCount, 
        this.props.playerNames.indexOf( this.props.firstMove ) + 1,
        this.props.gamesToWin
    );
    test() {
        this.logic.GameLogicArray[0][1] = 1;
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Game

class Point {
    X : number;
    Y : number;
    constructor(_x : number, _y: number){
        this.X = _x;
        this.Y = _y;
    }
}

class GameLogic {

    score: Array<Array<number>> // Games players have won
    gamesToWin: number; gameNum = 1; // Games one player should win to win a match and a number of the current game
    GameLogicArray : number[][]; // Initialize memory space for the Array's field 
    squareFlag = false; // Indicates that square was found after a line is placed
    counter = 0; // Recursive function iterations counter
    player: number; // Number of a player to make the move
    playerCount: number;
    line : Point[];
    lineOld : Point[];
    points : Point[][]; // Graphics array with pixel coordinates for each point
    x = 0; y = 0;
    a = 0; b = 0; // Vertical and horizontal pixel distance between dots
    index_x = 0; index_y = 0; // Index numbers to find a starting point of current line in Graphics array 

    public constructor(x : number, y : number, playerCount: number, firstMove: number, gamesToWin: number)
    {
        this.playerCount = playerCount;
        this.player = firstMove;
        this.gamesToWin = gamesToWin;
        this.score = Array<Array<number>>(3)
        for (let i = 0; i < 3; i++)
            this.score[i] = Array<number>(this.playerCount)
        this.line = new Array<Point>(2); // Stores current line position
        this.line[0] = new Point(0, 0);
        this.line[1] = new Point(0, 0);
        this.lineOld = new Array<Point>(2); // Stores last placed line's position
        this.lineOld[0] = new Point(0, 0);
        this.lineOld[1] = new Point(0, 0);
        this.points = new Array<Array<Point>>(x);
        for (let i = 0; i < x; i++)
            this.points[i] = new Array<Point>(y);
        this.GameLogicArray = new Array<Array<number>>(x * y);
        for (let i = 0, max = x * y; i < max; i++)
            this.GameLogicArray[i] = new Array<number>(5);
    }

    public convertPixelsToPointNumber(width : number, height : number, p: Point) // Is used to determine point's number by it's pixel coordinates
    {
        let number = (p.Y - (height / this.y) / 2) / (height / this.y) * this.x + (p.X - (width / this.x) / 2) / (width / this.x);
        return number;
    }
    
    public indexTracker(cursorX : number, cursorY: number) // Determines which square sector between points current cursor position belongs by finding indexes for future reference point
    {
        for (let i = 1; i < this.x; i++)
            if (cursorX >= this.points[i - 1][ 0].X && cursorX < this.points[i][ 0].X)
                this.index_x = i - 1;
        for (let i = 1; i < this.y; i++)
            if (cursorY >= this.points[0][ i - 1].Y && cursorY < this.points[0][ i].Y)
                this.index_y = i - 1;
    }

    public checkAfterClick(pointNum1: number) // Checks if line is going to be placed according to the rules and determines what to do after it's placed
    {
        let pointNum2 : number;
        for (let j = 1; j <= 2; j++)
        {
            if (this.GameLogicArray[pointNum1][j] == 0)
            {
                if (this.line[0].X < this.line[1].X) // Locating the current this.line's 2nd point's number
                    pointNum2 = pointNum1 + 1;
                else
                    pointNum2 = pointNum1 + this.x;
                if (!(Math.abs(this.GameLogicArray[pointNum1][ 1] - pointNum2) == 0)) // Check for not repainting the this.line
                {
                    this.GameLogicArray[pointNum1][ j + 2] = this.player;
                   

                    this.GameLogicArray[pointNum1][ j] = pointNum2; // Writing the connected point to the column of index
                    this.squareFlag = false; // Unchecking the SquareFound flag
                    this.checkSquareComplete(pointNum1, pointNum2); // Checking current this.line's points for square completions
                    if (!this.squareFlag) // If square wasn't found during the process turn is changed
                       if (this.player === this.playerCount)
                            this.player = 1;
                        else
                            this.player++;                   
                }
                break;
            }
        }
    }

    public dots(width: number, height: number) // Generatig points
    {
        this.points = Array<Array<Point>>(this.x);
        this.GameLogicArray = Array<Array<number>>(5);
        for (let i = 0; i < 5; i++)
            this.GameLogicArray[i] = Array(this.x * this.y)
        for (let i = 0; i < this.x; i++) {
            this.points[i] = Array<Point>(this.y)
            for (let j = 0; j < this.y; j++)
            {
                this.points[i][ j] = new Point(i * (width / this.x) + (width / this.x) / 2, j * (height / this.y) + (height / this.y) / 2);
            }
        }
    }

    public dotsCheck(index_x: number, index_y: number, eX: number, eY: number) // Finding the points to write them into this.line and remember for further operations
    {
        this.b = this.points[1][ 0].X - this.points[0][ 0].X;
        this.a = this.points[0][ 1].Y - this.points[0][ 0].Y;
        if (eY - this.points[index_x][ index_y].Y <= (this.points[index_x][ index_y].X - eX )* this.a / this.b + this.a)
            if (eY - this.points[index_x][ index_y].Y >= (eX - this.points[index_x][ index_y].X) * this.a / this.b)
            {
                this.line[0] = this.points[index_x][ index_y];
                this.line[1] = this.points[index_x][ index_y + 1];
            }                       
            else
            {
                this.line[0] = this.points[index_x][ index_y];
                this.line[1] = this.points[index_x + 1][ index_y];
            }
        else 
            if (eY - this.points[index_x][ index_y].Y >= (eX - this.points[index_x][ index_y].X) * this.a / this.b)
            {
                this.line[0] = this.points[index_x][ index_y + 1];
                this.line[1] = this.points[index_x + 1][ index_y + 1];
            }
            else
            {
                this.line[0] = this.points[index_x + 1][ index_y];
                this.line[1] = this.points[index_x + 1][ index_y + 1];
            }
    }
    public checkSquareComplete(point1: number, point2: number) // Check GameLogicArray if a 1x1 square of this.lines starting diagonally from point with number "point1" is complete.
    {
        if (this.GameLogicArray[point1][ 1] != 0 && this.GameLogicArray[point1][ 2] != 0)
        {
            let nextPoint = Math.min(this.GameLogicArray[point1 + this.x][ 1], this.GameLogicArray[point1 + this.x][ 2]);
            if (nextPoint == 0)
                nextPoint = Math.max(this.GameLogicArray[point1 + this.x][ 1], this.GameLogicArray[point1 + this.x][ 2]);
            if (Math.max(this.GameLogicArray[point1 + 1][ 1], this.GameLogicArray[point1 + 1][ 2]) == point1 + 1 + this.x && nextPoint == point1 + 1 + this.x && this.GameLogicArray[point1][ 0] == 0) // Checking if points are connected in 1x1 square fashion
            {
                this.score[this.player][0]++;
                this.score[this.player][1]++;
                this.GameLogicArray[point1][ 0] = this.player;
                this.squareFlag = true;
            }
            else this.counter = 0;
        }
        this.counter++; // Using the counter for recursion to make sure the function doesn't run more than 2 times
        if (this.counter > 1)
        {
            this.counter = 0;
            return;
        }

        if (point1 < this.x && point2 - point1 == 1 || point1 == 0) // Rules that don't allow recursively checking above and left of the first row
        {
            this.counter = 0;
            return;
        }

        if (point2 - point1 > 1) // Finding the next square to check recursively
        {
            this.checkSquareComplete(point1 - 1, point1);
        }
        else
        {
            this.checkSquareComplete(point1 - this.x, point1);
        }
    }


}