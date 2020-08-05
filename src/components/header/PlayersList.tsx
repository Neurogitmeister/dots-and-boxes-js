import React, { Component } from 'react';
import  { defaultAvatars, getRandomInt, getRandomColor } from './GameSettings'
import '../../styles/PlayersList.scss'
import { stringify } from 'querystring';

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

	accountPos = 0;
	
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
		: e.currentTarget.parentElement.parentElement === null
		? null 
		: e.currentTarget.parentElement.parentElement.parentElement;
		if (el) {
			el.className = el.className.split(" ")
				.filter(_class => _class.substr(_class.length - 7, 7) !== "-toggle")
				.join(" ").concat(" choose-player-toggle")
		}
		el = e.currentTarget.parentElement === null
		? null
		: e.currentTarget.parentElement.parentElement;
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

		let name = e.currentTarget.parentElement === null
			? null
			: e.currentTarget.parentElement.parentElement === null
			? null
			: e.currentTarget.parentElement.parentElement.id;
		//if element was found then assign filtered array to props.players
		// (conditions to restrict deleting a player are still in development)
		if (name !== this.props.players[this.accountPos]) {
			let newList = this.props.players.filter(
				(_name: string) => (_name !== name));
			let newColorList = this.props.playerColors
			.filter((id: string) => (name && (+id !== this.props.players.indexOf(name))));
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
			: e.currentTarget.parentElement.parentElement === null
			? null
			: e.currentTarget.parentElement.parentElement.getElementsByClassName("player-name")[0];
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
				<li key={player} id={player}>
					<PlayerOfList
						player={player}
						playerColor={this.props.playerColors[counter]}
						playerPicURL={this.props.playerPicURLs[counter]}
						enableEdit={this.enableEdit}
						changePlayerColor={this.changePlayerColor}
						enableChoose={this.enableChoose}
						deletePlayer={this.deletePlayer}
						showInput={this.showInput}
						changePlayerName={this.changePlayerName}
						hideInput={this.hideInput} 
					/>
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

interface PlayerProps {
	//isAccount : boolean,
	player : string,
	playerColor: string,
	playerPicURL: string,
	enableEdit(e: React.MouseEvent<HTMLDivElement>): void,
	enableChoose(e: React.MouseEvent<HTMLDivElement>) : void,
	changePlayerColor(e: React.FocusEvent<HTMLInputElement>) : void,
	changePlayerName(e: React.KeyboardEvent<HTMLInputElement>) : void,
	deletePlayer(e: React.MouseEvent<HTMLLIElement>) : void,
	showInput(e: React.MouseEvent<HTMLButtonElement>) : void,
	hideInput(e: React.FocusEvent<HTMLInputElement>) : void
}

class PlayerOfList extends Component<PlayerProps, any> {
	constructor(props: PlayerProps) {
		super(props);
	}

	render() {
		let {/*isAccount,*/ player, playerColor, playerPicURL, enableEdit, changePlayerColor, enableChoose, deletePlayer, showInput, changePlayerName, hideInput} = this.props;
		return (<>
			
			<div className="overlay disable-edit" onClick={enableEdit}></div>
			<div id={player + "-drag-target"} className="overlay drag-target " onClick={function () {}}></div>
			<div className="player-edit-group">
				<input className="player-color" type="color" defaultValue={playerColor} onBlur={changePlayerColor} />
				<span className="button-apply" onClick={enableChoose}>OK</span>
				<span className="button-cancel" onClick={enableChoose}>X</span>
				<span className="button-delete" onClick={deletePlayer}>T</span>

			</div>
			<div className="player-color-avatar"></div>
			{/* {isAccount && 
				<div className="profile-container">
					<img src={playerPicURL} alt="" />
					<span className="player-name">{player}</span>       
				</div>
			}
			{!isAccount &&  */}
				<div className="profile-container changable-name">
					<img src={playerPicURL} alt="" />
					<span onClick={showInput} className="player-name">{player}</span>                        
					<input className="some-class" onKeyPress={changePlayerName} onBlur={hideInput} defaultValue={player} />
				</div>
			{/* } */}
		</>);
  	}

}
  