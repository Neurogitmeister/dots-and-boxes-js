import React, { Component } from 'react';

export interface PlayerListProps {
    players: Array<string>
    playerColors: Array<string>
    onListChange(players: string[], playerColors: string[]): void
}

export class PlayersList extends Component<PlayerListProps, any> {
    constructor(props: PlayerListProps) {
        super(props);
        this.addPlayer = this.addPlayer.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.setPlayerColor = this.setPlayerColor.bind(this);
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
                this.props.playerColors.push(this.getRandomColor());
                e.currentTarget.value = "";
                this.props.onListChange(this.props.players, this.props.playerColors);
                let el = e.currentTarget.parentElement === null
                    ? null
                    : e.currentTarget.parentElement.parentElement;
                if (el)
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

        let index = this.props.players.indexOf(e.currentTarget.parentElement!.id);
        //console.log(e.currentTarget.parentElement!.id + " on position " + index)
        let newColors = this.props.playerColors;
        newColors[index] = e.currentTarget.value;
        this.props.onListChange(this.props.players, newColors);

    }
    showInput(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        let el = e.currentTarget.parentElement;
        if (el) {
            el.className = el.className.concat(" active");
            (document.getElementById("add-player-input")!.firstElementChild as HTMLElement).focus();
        }

    }
    hideInput(e: React.FocusEvent<HTMLInputElement>) {
        let el = e.currentTarget.parentElement === null
            ? null
            : e.currentTarget.parentElement.parentElement;
        if (el)
            el.className = el.className.split(" ").filter(_class => _class !== "active").join();
    }
    render() {
        let players: Array<object> = [];
        let counter = 0;
        for (let player of this.props.players) {

            players.push(
                <li key={player} id={player}>
                    <input type="color"
                        defaultValue={this.props.playerColors[counter++]}
                        onBlur={this.setPlayerColor} />
                    <span className="player-name">{player}</span>
                    <span className="button-delete" onClick={this.deletePlayer}>X</span>

                </li>
            );
        }
        return (
            <ul id="players-list">
                {players}
                <button onClick={this.showInput}>Add</button>
                <li className="" id="add-player-input">
                    <input onKeyPress={this.addPlayer} onBlur={this.hideInput} />
                </li>
            </ul>
        );
    }
}
