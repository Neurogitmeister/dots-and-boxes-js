import React, { Component } from 'react';
import  { defaultAvatars, getRandomInt, getRandomColor } from './GameSettings'

export interface PlayerListProps {
    players: Array<string>
    playerColors: Array<string>
    playerPicURLs : Array<string>
    onListChange(players: string[], playerColors: string[]): void
}

export class PlayersList extends Component<PlayerListProps, any> {
    constructor(props: PlayerListProps) {
        super(props);
        this.addPlayer = this.addPlayer.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.changePlayerColor = this.changePlayerColor.bind(this);
        this.changePlayerName = this.changePlayerName.bind(this);
    }
    
    enableEdit(e: React.MouseEvent<HTMLDivElement>) {
        let el = e.currentTarget.parentElement === null 
        ? null
        : e.currentTarget.parentElement.parentElement
        if (el && !el.getElementsByClassName("active").length) {
            
            el.className = el.className.split(" ")
                .filter(_class => _class.substr(_class.length - 7, 7) !== "-toggle")
                .join(" ").concat(" edit-player-toggle")
            el = e.currentTarget.parentElement
            if (el)
                el.className = el.className.concat(" active")
        }
        
    }
    enableChoose(e: React.MouseEvent<HTMLDivElement>) {
        let el = e.currentTarget.parentElement === null 
        ? null
        : e.currentTarget.parentElement.parentElement
        if (el) {
            el.className = el.className.split(" ")
                .filter(_class => _class.substr(_class.length - 7, 7) !== "-toggle")
                .join(" ").concat(" choose-player-toggle")
        }
        el = e.currentTarget.parentElement
        if (el) 
        el.className = el.className.split(" ").filter(_class => _class !== "active").join(" ");
    }
    enableReorder(e: React.MouseEvent<HTMLDivElement>) {
        let el = e.currentTarget.parentElement;
        if (el) {
            el.className = el.className.split(" ")
                .filter(_class => _class.substr(_class.length - 7, 7) !== "-toggle")
                .join(" ").concat(" reorder-players-toggle")
        }
    }
    // search in parent element of e.target for a first child element 
    // and use it's contents as a filter for state.players
    deletePlayer(e: React.MouseEvent<HTMLLIElement>) {

        let el = e.currentTarget.parentElement === null
            ? null
            : e.currentTarget.parentElement.getElementsByClassName("player-name")[0];
        //if element was found then assign filtered array to props.players
        // (conditions to restrict deleting a player are still in development)
        if (el && el.innerHTML !== this.props.players[0]) {
            let newList = this.props.players.filter(
                (name: string) => (el && el.innerHTML !== name));
            let newColorList = this.props.playerColors.filter(
                (id: string) => (+id !== this.props.players.indexOf(el!.innerHTML)));
            this.props.onListChange(newList, newColorList);
        }

    }

    addPlayer(e: React.KeyboardEvent<HTMLInputElement>) {

        var x = e.which || e.keyCode;
        if (x === 13) {
            e.preventDefault();
            let name = e.currentTarget.value;
            if (this.props.players.indexOf(name) === -1) {
                this.props.players.push(e.currentTarget.value);
                this.props.playerColors.push(getRandomColor());
                // for (let i = 0; i < 100; i++) {
                //     console.log(this.getRandomInt(0, this.defaultAvatars.length - 1))
                // }
                this.props.playerPicURLs.push(defaultAvatars[getRandomInt(0, defaultAvatars.length - 1)]);
                console.log(defaultAvatars.length)
                e.currentTarget.value = "";
                this.props.onListChange(this.props.players, this.props.playerColors);
                let el = e.currentTarget.parentElement 
                if (el)
                    el.className = el.className.split(" ").filter(_class => _class !== "active").join(" ");
                console.log(this.props)
            }
        }
    }
    changePlayerName(e: React.KeyboardEvent<HTMLInputElement>){
        var x = e.which || e.keyCode;
        if (x === 13) {
            e.preventDefault();
            let newName = e.currentTarget.value;
            let el = e.currentTarget.parentElement === null
            ? null
            : e.currentTarget.parentElement.getElementsByClassName("player-name")[0];
            if (el) {
                let prevIndex = this.props.players.indexOf(el.innerHTML)
                let index = this.props.players.indexOf(newName)
                if ( index === -1 ) {
                    this.props.players[prevIndex] = newName
                    this.props.onListChange(this.props.players, this.props.playerColors);
                }
            }
        }
    }
    
    changePlayerColor(e: React.FocusEvent<HTMLInputElement>) {
        let el = e.currentTarget.parentElement === null
            ? null
            : e.currentTarget.parentElement.getElementsByClassName("player-name")[0];
        if (el) {

            let index = this.props.players.indexOf(el.innerHTML);
            console.log(el.innerHTML + " on position " + index)
            let newColors = this.props.playerColors;
            newColors[index] = e.currentTarget.value;
            this.props.onListChange(this.props.players, newColors);
        }

    }
    showInput(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        let el = e.currentTarget.parentElement
        if (el) {
            //console.log(e.currentTarget.innerHTML , e.currentTarget.innerText)
            el.className = el.className.concat(" active");
            (el.lastElementChild as HTMLElement).focus();
            (el.lastElementChild as HTMLInputElement).defaultValue = e.currentTarget.innerText;
            
        }

    }
    hideInput(e: React.FocusEvent<HTMLInputElement>) {
        //console.log("Hiding")
        let el = e.currentTarget.parentElement 
        if (el)
            el.className = el.className.split(" ").filter(_class => _class !== "active").join(" ");
    }
    render() {
        let players: Array<object> = [];
        let counter = 0;
        for (let player of this.props.players) {
            players.push(
                <li key={player} >
                    {/* hidable elements */}
                    <div className="overlay disable-edit" onClick={this.enableEdit}></div>
                    <div id={player + "-drag-target"} className="overlay drag-target "
                     onClick={function() {}}></div>
                    <span className="button-delete" onClick={this.deletePlayer}>X</span>
                    <span className="button-apply" onClick={this.enableChoose}>OK</span>
                    {/* regular elements */}
                    <input className="input-player-color" type="color"
                        defaultValue={this.props.playerColors[counter]}
                        onBlur={this.changePlayerColor} 
                    />
                        {counter === 0 &&
                            <div className="profile-container">
                                <img src={this.props.playerPicURLs[counter]} alt=""/>
                                <span className="player-name">{player}</span>       
                            </div>	       
                        }
                        {counter > 0 &&
                            <div className="profile-container changable-name">
                                <img src={this.props.playerPicURLs[counter]} alt=""/>
                                <span onClick={this.showInput} className="player-name">{player}</span>                        
                                <input className="some-class" onKeyPress={this.changePlayerName} onBlur={this.hideInput} defaultValue={player}/>
                            </div>
                        }
                </li>
            );
            counter++;
        }
        return (
            <ul id="players-list" className="choose-player-toggle">
                {players}     
                <div className="changable-name" id="add-player-input">
                    <button onClick={this.showInput}>Add</button>
                    <input onKeyPress={this.addPlayer} onBlur={this.hideInput} />
                </div>
            </ul>
        );
    }
}
