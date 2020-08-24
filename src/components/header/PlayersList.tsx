import React, { Component } from 'react'
import  { defaultAvatars, getRandomInt, getRandomColor } from './GameSettings'
import '../../styles/PlayersList.scss'
import { v4 as uuidv4 } from 'uuid'

export class playerData {
	login: string
	playerName: string
	playerPicURL : string
	playerColor: string

	constructor(login: string, name: string, picURL: string, color: string){
		this.login = login
		this.playerName = name
		this.playerPicURL = picURL
		this.playerColor = color
	}
}

export interface PlayerListProps {
	playerDataList : Array<playerData>
	addPlayerData(player: playerData): void
	deletePlayerData(login: string): void
	changePlayerData(player: playerData): void
}

export class PlayersList extends Component<PlayerListProps, any> {
	constructor(props: PlayerListProps) {
		super(props);
		this.setListEditMode = this.setListEditMode.bind(this);
		this.addLocalPlayer = this.addLocalPlayer.bind(this);
		this.deletePlayer = this.deletePlayer.bind(this);
		this.changePlayerData = this.changePlayerData.bind(this);
		// this.changePlayerName = this.changePlayerName.bind(this);
		this.state = {
			listEditMode : "choose-player-toggle"
		}
	}

	profilePos = 0;
	
	setListEditMode(mode: string) {
		let newState = {...this.state}
		newState.listEditMode = mode
		this.setState(newState)
	}

	enableReorder(e: React.MouseEvent<HTMLDivElement>) {
		this.setListEditMode("reorder-players-toggle")
	}

	// search in parent element of e.target for a first child element 
	// and use it's contents as a filter for state.players
	deletePlayer(currPlayerLogin: string) {

		if (currPlayerLogin && currPlayerLogin !== this.props.playerDataList[this.profilePos].login) {
			this.props.deletePlayerData(currPlayerLogin);
		}

	}

	addLocalPlayer(e: React.KeyboardEvent<HTMLInputElement>) {

		var x = e.which || e.keyCode;
		if (x === 13) {
			e.preventDefault();
			
			this.props.addPlayerData({
				login : uuidv4(),
				playerName: e.currentTarget.value,
				playerColor: getRandomColor(),
				playerPicURL: defaultAvatars[getRandomInt(0, defaultAvatars.length - 1)] 
			})
		}
	}
	changePlayerData(player: playerData){
		this.props.changePlayerData(player)
	}
	
	render() {
		let players: Array<object> = [];
		let max = this.props.playerDataList.length;
		for (let counter = 0; counter < max; counter++ ) {
			players.push(
				<PlayerOfList
					key={this.props.playerDataList[counter].login}
					// props:
					isActive={false}
					// login={this.props.playerDataList[counter].login}
					// playerName={this.props.playerName}
					// playerColor={this.props.playerColors[counter]}
					// playerPicURL={this.props.playerPicURLs[counter]}
					player={this.props.playerDataList[counter]}

					setListEditMode={this.setListEditMode}
					changePlayerData={this.changePlayerData}
					deletePlayer={this.deletePlayer}
				/>
			);
		}
		return (
			<ul id="players-list" className={"" + this.state.listEditMode}>
				{players}	
				<div id="add-player-input" className="neumorphic-button-circle changable-name" onClick={()=>{}}>
					<div className="bump-shadow-override">
						<span>+</span>
					</div>
				</div>
				
				{/* 
					FIX THIS :
					<PlayerOfList
					// props:
					isActive={false}
					login={uuidv4()}
					playerName={""}
					playerColor={this.props.playerColors[counter]}
					playerPicURL={this.props.playerPicURLs[counter]}
					setListEditMode={this.setListEditMode}
					changePlayerColor={this.changePlayerColor}
					changePlayerName={this.changePlayerName}
					deletePlayer={this.deletePlayer}
				/> */}
			</ul>
		);
	}
}

interface PlayerProps {
	isActive?: boolean,
	player: playerData,
	setListEditMode(mode : string) : void,
	changePlayerData(player: playerData): void,
	deletePlayer(login: string): void,
	// changePlayerColor(e: React.FocusEvent<HTMLInputElement>) : void,
	// changePlayerName(e: React.KeyboardEvent<HTMLInputElement>) : void,
	// deletePlayer(e: React.MouseEvent<HTMLDivElement>) : void,
}
interface PlayerState {
	playerColor: string,
	isActive: boolean
}

class PlayerOfList extends Component<PlayerProps, PlayerState> {
	constructor(props: PlayerProps) {
		super(props);
		this.state = {
			playerColor: this.props.player.playerColor,
			isActive : !!this.props.isActive
		}
		this.changeColorSelf = this.changeColorSelf.bind(this)
		this.changePlayerName = this.changePlayerName.bind(this)
		this.changePlayerColor = this.changePlayerColor.bind(this)
		this.deletePlayer = this.deletePlayer.bind(this)
		this.enableChoose = this.enableChoose.bind(this)
		this.enableEdit = this.enableEdit.bind(this)
	}
	changeColorSelf(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({...this.state, playerColor: e.currentTarget.value})
	}
	changePlayerName(e: React.KeyboardEvent<HTMLInputElement>) {
		var x = e.which || e.keyCode;
		if (x === 13) {
			e.preventDefault();
			this.props.changePlayerData({...this.props.player, playerName: e.currentTarget.value })
		}
	}
	changePlayerColor(e: React.ChangeEvent<HTMLInputElement>) {
		console.log(e.currentTarget.value)
		this.props.changePlayerData({...this.props.player, playerColor: e.currentTarget.value})
	}
	deletePlayer(e: React.MouseEvent<HTMLDivElement>) {
		this.props.deletePlayer(this.props.player.login)
	}
	enableEdit(e: React.MouseEvent<HTMLDivElement>) {
		this.setState({...this.state, isActive: true})
		this.props.setListEditMode("edit-player-toggle")
		
	}
	enableChoose(e: React.MouseEvent<HTMLDivElement>) {
		this.setState({...this.state, isActive: false})
		this.props.setListEditMode("choose-player-toggle")
		
	}
	showInput(e: React.MouseEvent<HTMLDivElement>) {
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
		let { playerName, login, playerColor, playerPicURL} = this.props.player
		// let { changePlayerData, deletePlayer } = this.props
		return (<li id={login} className={this.state.isActive? "active" : ""}>
			
			<div className="overlay disable-edit" onClick={this.enableEdit}></div>
			<div id={login + "-drag-target"} className="overlay drag-target " onClick={function () {}}></div>
			
			<div className="player-edit-group">
				<div className="button-color">
					<div  className="bump-shadow-override">
						<input className="player-color" type="color"
						defaultValue={playerColor}
						onChange={this.changeColorSelf}
						onBlur={this.changePlayerColor} 
						/>
					</div>
				</div>
				<div className="button-apply" onClick={this.enableChoose}><div className="bump-shadow-override">
					<span>OK</span>
				</div></div>
				<div className="button-cancel" onClick={this.enableChoose}><div className="bump-shadow-override">
					<span>X</span>
				</div></div>
				<div className="button-delete" onClick={this.deletePlayer}><div className="bump-shadow-override">
					<span>T</span>
				</div></div>

			</div>
			<div className="player-color-avatar" style={{backgroundColor: this.state.playerColor }}></div>
		
				<div className="profile-container changable-name">
					<img src={playerPicURL} alt="" />
					<span onClick={this.showInput} className="player-name">{playerName}</span>                        
					<input className="some-class" onKeyPress={this.changePlayerName} onBlur={this.hideInput} defaultValue={playerName} />
				</div>

			
		</li>);
  	}

}
  