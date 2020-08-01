import React, {Component} from 'react'
import './styles/GameSettings.scss'

interface GameSettingsList {
    columns: number
    rows: number
    playerNames: Array<string>
    playerColors: Array<string>
    firstMove: string
    gamesToWin: number
    dotsSize: number
    dotsColor: string
}


let defaultSettings : GameSettingsList = {
    columns: 5,
    rows: 5,
    playerNames: ['Guest','Kolya'],
    playerColors: ['#333333', '#66ff66'],
    firstMove: 'Guest',
    gamesToWin: 1,
    dotsSize: 3,
    dotsColor: '#f06000'
}

/*validate token and load settings*/
function fetchGameSettings (username: string ) : GameSettingsList {

        let gameSettings : GameSettingsList;
        gameSettings = {
            /*fetch settings from cookies here (delete code inside below)*/
            columns: 15,
            rows: 15,
            playerNames: [ username, 'Petya', 'Vasya', 'Kolya'],
            playerColors: ['#333333', '#229922', '#2299ff', '#f00000'],
            firstMove: username,
            gamesToWin: 4,
            dotsSize: 7,
            dotsColor: '#f06000'
        }
        return gameSettings
}

interface GameSettingsModuleProps {
    username: string;
    tokenIsValid: boolean;
}


interface GameStateFields {
    columns :       number;
    rows:           number;
    playerNames:    string[],
    playerColors:   string[],
    playersCount:   number;
    firstMove:      string;
    gamesToWin:     number;
    dotsSize:       number;
    singleGameTime: string;
    matchTime:      string;
}

type GameStateField = "columns"|"rows"|"playersCount"|"gamesToWin"|"dotsSize"

let secPerMove = 5

export default class GameSettings extends Component<GameSettingsModuleProps, GameStateFields>{
    // load settings values:
    constructor(props : GameSettingsModuleProps){
        super(props)
        if (this.props.tokenIsValid)
            this.gameSettings = fetchGameSettings(this.props.username);
        else this.gameSettings = defaultSettings;
        let singleSeconds = this.calculateSingleGameTime(this.gameSettings.columns, this.gameSettings.rows)
        let matchTime = this.formatSeconds (this.calculateMatchTime(this.gameSettings.gamesToWin, this.gameSettings.playerNames.length, singleSeconds))
        let singleGameTime = this.formatSeconds(singleSeconds)
        this.state = {
            columns :       this.gameSettings.columns,
            rows:           this.gameSettings.rows,
            playerNames:    this.gameSettings.playerNames,
            playerColors:   this.gameSettings.playerColors,
            playersCount:   this.gameSettings.playerNames.length,
            firstMove:      this.gameSettings.firstMove,
            gamesToWin:     this.gameSettings.gamesToWin,
            dotsSize:       this.gameSettings.dotsSize,
            singleGameTime: singleGameTime,
            matchTime:      matchTime
        }
        this.updateTime = this.updateTime.bind(this)
        this.updateStateValue = this.updateStateValue.bind(this)
        this.updatePlayersList = this.updatePlayersList.bind(this)
        this.updateFirstMove = this.updateFirstMove.bind(this)
    }

    gameSettings: GameSettingsList;

    calculateSingleGameTime(columns: number, rows: number) : number {
       return (columns * (rows + 1) + rows) * secPerMove
    }

    calculateMatchTime(gamesToWin: number, playersCount : number, singleGameTime: number ) : number {
        let gamesPerMatch = (gamesToWin * (playersCount + 2) - playersCount) / 2
        return singleGameTime * gamesPerMatch
    }
    formatSeconds(fullSeconds : number) : string {
       let seconds = fullSeconds % 60
       let minutes = Math.floor(fullSeconds / 60) % 60
       let hours = Math.floor(fullSeconds / 3600)
       return (hours + "h " + minutes + "m " + seconds + "s")
    }
    updateStateValue(stateVar: GameStateField, value: number){
        let newState = {...this.state}
        newState[stateVar] = value;
        if (stateVar === "columns"|| stateVar === "rows" || stateVar === "gamesToWin" || stateVar === "playersCount") {
            newState = this.updateTime(newState)
        }
        this.setState(newState)
    }
    updateTime( State: GameStateFields) : GameStateFields {
        
        let singleSeconds = this.calculateSingleGameTime(State.columns, State.rows)
        State.matchTime = this.formatSeconds(this.calculateMatchTime(State.gamesToWin, State.playersCount, singleSeconds))
        State.singleGameTime = this.formatSeconds(singleSeconds)
        
        return State;
    }
    updatePlayersList(players: string[], playerColors: string[]) {
    
        let newState = {...this.state}
        newState.playersCount = players.length;   
        newState.playerNames = players;
        newState.playerColors = playerColors;
        newState = this.updateTime(newState) 
        this.setState(newState)
    }
    selectNewPlayer(e: React.FormEvent<HTMLInputElement>){
        e.currentTarget.value = ""
    }
    updateFirstMove(e: React.FocusEvent<HTMLInputElement>){
        if (e.currentTarget.value) {
            let newState = {...this.state}
            newState.firstMove = e.currentTarget.value
            this.setState(newState)
        } else {
            e.currentTarget.value = this.state.firstMove
        }
    }
    mySubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); 
        try {
            this.checkInput(e);
        } catch (err) {
         throw new Error(err.message);
        }
        return false;
    }
    checkInput(e: React.FormEvent<HTMLFormElement>){

    }
    render() {
        let players: Array<object> = []
        for ( let player of this.state.playerNames) {
            players.push( <option key={player} value={player}/> )
        }
        return (
            <div id='settings-popup'>
                <form onSubmit={this.mySubmit}>
                    <h2 id="game-settings-header">GAME SETTINGS</h2>
                    <h2>Gameplay</h2>
                    <RangeInput boundState="columns" onHandleInputChange={this.updateStateValue}
                                id={"input-columns"} label={"Columns"}
                                max={20} min={3} value={this.state.columns}
                    />
                    <RangeInput boundState="rows" onHandleInputChange={this.updateStateValue}
                                id={"input-rows"} label={"Rows"}
                                max={20} min={3} value={this.state.rows}
                    />
                    

                    <div id="settings-players-list">
                        <span>Players</span>
                        <PlayersList onListChange={this.updatePlayersList} 
                        players={this.state.playerNames} playerColors={this.state.playerColors}/>
                    </div>


                    <div className="row">
                        <p className="col-md-6">First move of player:</p>
                        <div className="col-md-6">
                            <input name="sglsbbxxcvcx"
                                   list="players-datalist"
                                   id="input-settings-players-move"
                                   onFocus={this.selectNewPlayer}
                                   onBlur={this.updateFirstMove}
                                   defaultValue={this.state.firstMove}/>


                            <datalist id="players-datalist">
                                {players}
                            </datalist>


                        </div>
                    </div>

                    <div className="estimate-calc row">
                        <p className="col-6">Estimated single game time:</p>
                        <span className="col-6">{this.state.singleGameTime}</span>
                    </div>

                    <RangeInput boundState={"gamesToWin"} onHandleInputChange={this.updateStateValue}
                        id={"input-games-to-win"} label={"Games to win"}
                        min={1} max={10} value={this.state.gamesToWin}
                    />

                    <div className="estimate-calc row">
                        <p className="col-6">Estimated match time:</p>
                        <span className="col-6">{this.state.matchTime}</span>
                    </div>

                    <h2>Graphics</h2>
                    <div className="md2">
                        <RangeInput boundState="dotsSize" onHandleInputChange={this.updateStateValue}
                            id={"input-dots-size"} label={"Dots size"}
                            max={20} min={3} value={this.state.dotsSize}
                        />
                        <div className="color-dialog">
                            <label htmlFor="">Dots color</label>
                            <input type="color" id='input-dots-color'/>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

interface RangeInputProps {
    min: number
    max: number
    value: number
    id: string
    label: string
    boundState: GameStateField
    onHandleInputChange(stateVar: string, value: number): void
}

class RangeInput extends Component<RangeInputProps, any>{
    constructor(props : RangeInputProps){
        super(props)
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    handleInputChange(e: React.FormEvent<HTMLInputElement>) {
        this.props.onHandleInputChange(this.props.boundState,+e.currentTarget.value)
    }
    render() {
        return(
            <div className="range">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input type="range" id={this.props.id} max={this.props.max} min={this.props.min} // <-- load from props
                       value={this.props.value} // <-- load from state
                       onChange={this.handleInputChange} // <-- change state while changing input
                />

                <span id={this.props.id + "-span"}>{this.props.value}</span>
            </div>
        )
    }
}
interface PlayerListProps {
    players: Array<string>
    playerColors: Array<string>
    onListChange(players: string[], playerColors: string[]): void
}

class PlayersList extends Component<PlayerListProps, any> {
    constructor(props : PlayerListProps){
        super(props)
        this.addPlayer = this.addPlayer.bind(this)
        this.deletePlayer = this.deletePlayer.bind(this)
        this.setPlayerColor = this.setPlayerColor.bind(this)
    }

    // search in parent element of e.target for a first child element 
    // and use it's contents as a filter for state.players

    deletePlayer(e: React.MouseEvent<HTMLLIElement>){
        // el should be first HTML tag or null
        //let el = e.currentTarget.previousElementSibling // <-- for same elements
        let el = e.currentTarget.parentElement === null  //<-- for different elements
        ? null 
        : e.currentTarget.parentElement.getElementsByClassName("player-name")[0]
        //if element was found then assign filtered array to props.players
        if (el && el.innerHTML !== this.props.players[0]) {
            let newList = this.props.players.filter(
                (name:string) => ( el && el.innerHTML !== name));
            let newColorList = this.props.playerColors.filter(
                (id: string) => (+id !== this.props.players.indexOf(el!.innerHTML)))
            this.props.onListChange(newList, newColorList)
        }
        
    }
    
    addPlayer(e: React.KeyboardEvent<HTMLInputElement>) {
        
        var x = e.which || e.keyCode
        if (x === 13) {
            e.preventDefault();
            let name = e.currentTarget.value
            if (this.props.players.indexOf(name) === -1) {
                this.props.players.push(e.currentTarget.value)
                this.props.playerColors.push(this.getRandomColor())
                e.currentTarget.value = ""
                this.props.onListChange(this.props.players, this.props.playerColors)
                let el = e.currentTarget.parentElement === null
                ? null
                : e.currentTarget.parentElement.parentElement;
                if(el) 
                    el.className = el.className.split(" ").filter(_class => _class !== "active").join();
                
            }    
        }
    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    setPlayerColor(e: React.FocusEvent<HTMLInputElement>) {

        let index = this.props.players.indexOf(e.currentTarget.parentElement!.id)
        //console.log(e.currentTarget.parentElement!.id + " on position " + index)
        let newColors = this.props.playerColors
        newColors[index] = e.currentTarget.value;
        this.props.onListChange(this.props.players, newColors)

    }
    showInput(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault(); 
        let el = e.currentTarget.parentElement;
        if (el) {
           el.className = el.className.concat(" active");
           (document.getElementById("add-player-input")!.firstElementChild as HTMLElement).focus()
        }

    }
    hideInput(e: React.FocusEvent<HTMLInputElement>){
        let el = e.currentTarget.parentElement === null
        ? null
        : e.currentTarget.parentElement.parentElement;
        if(el) 
            el.className = el.className.split(" ").filter(_class => _class !== "active").join();
    }
    render(){
        let players: Array<object> = []
        let counter = 0;
        for ( let player of this.props.players) {
            
            players.push(
                <li key={player} id={player}>
                    <input type="color" 
                        defaultValue={this.props.playerColors[counter++]}
                        onBlur={this.setPlayerColor}/>
                    <span className="player-name">{player}</span>
                    <span className="button-delete" onClick={this.deletePlayer}>X</span>
                    
                </li>
            )
        }
        return(
            <ul id="players-list">
                {players}
                <button onClick={this.showInput}>Add</button>
                <li className="" id="add-player-input">
                    <input onKeyPress={this.addPlayer} onBlur={this.hideInput}/>
                </li>
            </ul>
        )
    }
}

// open prompt for new name instead of:
        // let counter = 0;
        // let nameID = 0;
        // let collision = false;
        // let name = "Noname" + (counter + 1)
        // while (nameID !== this.state.players.length + 1) {
        //     nameID++;
        //     counter = 0
        //     collision = false;
        //     while (counter !== this.state.players.length) {
        //         if ("Noname" + nameID === this.state.players[counter++]){
        //             collision = true;
        //         }
        //     }
        //     if (collision === false) break;
        // }
        // name = "Noname" + nameID;
        // then: