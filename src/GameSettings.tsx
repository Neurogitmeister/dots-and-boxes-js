import React, {Component, FormEventHandler} from 'react'
import './styles/GameSettings.css'

interface GameSettingsList {
    columns: number
    rows: number
    playerNames: Array<string>
    playerColors: Array<string>
    firstMove: number
    gamesToWin: number
    dotsSize: number
    dotsColor: string
}


let defaultSettings : GameSettingsList = {
    columns: 5,
    rows: 5,
    playerNames: [ 'Petya', 'Vasya', 'Kolya'],
    playerColors: ['333333', '229922', 'f00000'],
    firstMove: 0,
    gamesToWin: 1,
    dotsSize: 3,
    dotsColor: 'f06000'
}

/*validate token and load settings*/
function fetchGameSettings (username: string ) : GameSettingsList {

        let gameSettings : GameSettingsList;
        gameSettings = {
            /*fetch settings from cookies here (delete code inside below)*/
            columns: 15,
            rows: 15,
            playerNames: [ username, 'Petya', 'Vasya', 'Kolya'],
            playerColors: ['333333', '229922', '2299ff', 'f00000'],
            firstMove: 0,
            gamesToWin: 4,
            dotsSize: 7,
            dotsColor: 'f06000'
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
    playersCount:   number;
    gamesToWin:     number;
    dotsSize:       number;
    singleGameTime: number;
    matchTime:      number;
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
        let singleGameTime = this.calculateSingleGameTime(this.gameSettings.columns, this.gameSettings.rows)
        let matchTime = this.calculateMatchTime(this.gameSettings.gamesToWin, this.gameSettings.playerNames.length, singleGameTime)
        this.state = {
            columns :       this.gameSettings.columns,
            rows:           this.gameSettings.rows,
            playerNames:    this.gameSettings.playerNames,
            playersCount:   this.gameSettings.playerNames.length,
            gamesToWin:     this.gameSettings.gamesToWin,
            dotsSize:       this.gameSettings.dotsSize,
            singleGameTime: singleGameTime,
            matchTime:      matchTime
        }
        this.cyka = this.cyka.bind(this)
        this.naka = this.naka.bind(this)
    }

    gameSettings: GameSettingsList;

    calculateSingleGameTime(columns: number, rows: number) :number {
       return (columns * (rows + 1) + rows) * secPerMove
    }

    calculateMatchTime(gamesToWin: number, playersCount : number, singleGameTime: number ) : number {
        let gamesPerMatch = (gamesToWin * (playersCount + 2) - playersCount) / 2
        return singleGameTime * gamesPerMatch
    }

    cyka(stateVar: GameStateField, value: number) {
        let newState = {...this.state}
        newState[stateVar] = value;
        if (stateVar === "columns"|| stateVar === "rows" || stateVar === "gamesToWin" || stateVar === "playersCount") {
            newState.singleGameTime = this.calculateSingleGameTime(newState.columns, newState.rows)
            newState.matchTime = this.calculateMatchTime(newState.gamesToWin, newState.playersCount, newState.singleGameTime)
        }
        this.setState(newState)
    }
    naka(players: string[]) {
        let newState = {...this.state}
        newState["playersCount"] = players.length;
        newState["playerNames"] = players;
        this.setState(newState)
    }
    selectNewPlayer(e: React.FormEvent<HTMLInputElement>){
        e.currentTarget.value = ""
    }
    render() {
        let players: Array<object> = []
        for ( let player of this.gameSettings.playerNames) {
            players.push( <option key={player} value={player}/> )
        }
        return (
            <div id='settings-popup'>
                <form>
                    <h2 id="game-settings-header">GAME SETTINGS</h2>
                    <h2>Gameplay</h2>
                    <RangeInput boundState="columns" onHandleInputChange={this.cyka}
                                id={"input-columns"} label={"Columns"}
                                max={20} min={3} value={this.state.columns}
                    />
                    <RangeInput boundState="rows" onHandleInputChange={this.cyka}
                                id={"input-rows"} label={"Rows"}
                                max={20} min={3} value={this.state.rows}
                    />
                    <div id="settings-players-list">
                        <span>Players</span>
                        <PlayersList onListChange={this.naka} players={this.state.playerNames}/>
                    </div>
                    <div className="row">
                        <p className="col-md-6">First move of player:</p>
                        <div className="col-md-6">
                            <input name="First Move"
                                   list="players-datalist"
                                   id="input-settings-players-move"
                                   onFocus={this.selectNewPlayer}/>
                            <datalist id="players-datalist">
                                {players}
                            </datalist>
                        </div>
                    </div>

                    <div className="estimate-calc row">
                        <p className="col-md-6">Estimated single game time:</p>
                        <span className="col-md-6">{this.state.singleGameTime} sec.</span>
                    </div>

                    <RangeInput boundState={"gamesToWin"} onHandleInputChange={this.cyka}
                        id={"input-games-to-win"} label={"Games to win"}
                        min={1} max={10} value={this.state.gamesToWin}
                    />

                    <div className="estimate-calc row">
                        <p className="col-md-6">Estimated match time:</p>
                        <span className="col-md-6">{this.state.matchTime} sec.</span>
                    </div>

                    <h2>Graphics</h2>
                    <div className="md2">
                        <RangeInput boundState="dotsSize" onHandleInputChange={this.cyka}
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
        this.state = {
            value: this.props.value
        };
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    handleInputChange(e: React.FormEvent<HTMLInputElement>) {
        this.setState({value: e.currentTarget.value})
        this.props.onHandleInputChange(this.props.boundState,+e.currentTarget.value)
    }
    render() {
        return(
            <div className="range">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input type="range" id={this.props.id} max={this.props.max} min={this.props.min} // <-- load from props
                       value={this.state.value} // <-- load from state
                       onChange={this.handleInputChange} // <-- change state while changing input
                />

                <span id={this.props.id + "-span"}>{this.props.value}</span>
            </div>
        )
    }
}
interface PlayerListProps {
    players: Array<string>
    onListChange(players: string[]): void
}

class PlayersList extends Component<PlayerListProps, any> {
    constructor(props : PlayerListProps){
        super(props)
        this.state = {players: this.props.players}
        this.addPlayer = this.addPlayer.bind(this)
        this.deletePlayer = this.deletePlayer.bind(this)
    }

    deletePlayer(e: React.MouseEvent<HTMLLIElement>){
        //console.log(e.currentTarget.parentElement!.children!.item(0)!.innerHTML)
        this.setState( {players: this.state.players.filter(
            (name:string) => name !== e.currentTarget.parentElement!.children!.item(0)!.innerHTML)
        })
        console.log("Deleting " + (this.state.players.length))
        this.props.onListChange(this.state.players)
    }
    addPlayer(e: React.MouseEvent<HTMLLIElement>) {

        // open prompt for new name instead of:
        let counter = 0;
        let nameID = 0;
        let collision = false;
        let name = "Noname" + (counter + 1)
        while (nameID !== this.state.players.length + 1) {
            nameID++;
            counter = 0
            collision = false;
            while (counter !== this.state.players.length) {
                if ("Noname" + nameID == this.state.players[counter++]){
                    collision = true;
                }
            }
            if (collision === false) break;
        }
        name = "Noname" + nameID;
        // then:
        this.state.players.push(name)
        this.setState( {players: this.state.players})
        console.log("Adding " + (this.state.players.length))
        this.props.onListChange(this.state.players)
    }
    render(){
        let players: Array<object> = []
        for ( let player of this.state.players) {
            players.push(
                <li key={player}>
                    <span>{player}</span>
                    <span onClick={this.deletePlayer}>X</span>
                </li>

            )
        }
        players.push( <li onClick={this.addPlayer} key="new">+ Add</li>)
        return(
            <ul id="players-list">
                {players}
            </ul>
        )
    }
}

