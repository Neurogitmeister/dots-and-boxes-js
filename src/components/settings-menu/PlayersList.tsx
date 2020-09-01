import React, { Component } from 'react'
import  { defaultAvatars, getRandomInt, getRandomColor } from './GameSettings'
import '../../styles/PlayersList.scss'
import { v4 as uuidv4 } from 'uuid'

interface cya {
	fuc: boolean,
	kek: string
}
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
		this.addLocalPlayer = this.addLocalPlayer.bind(this);
		this.deletePlayer = this.deletePlayer.bind(this);
		this.changePlayerData = this.changePlayerData.bind(this);
		this.state = {
			listEditMode : "choose-player-toggle"
		}
	}
	
	// profileLogins: Array<string> = [] <--- new feature in future
	hostPlayerPos = 0;
	
	enableReorder(e: React.MouseEvent<HTMLDivElement>) {
		this.setState({listEditMode: "reorder-players-toggle"})
	}

	// search in parent element of e.target for a first child element 
	// and use it's contents as a filter for state.players
	deletePlayer(currPlayerLogin: string) {

		if (currPlayerLogin !== this.props.playerDataList[this.hostPlayerPos].login) {
			this.props.deletePlayerData(currPlayerLogin);
			this.setState({listEditMode: "choose-player-toggle"})
		}
	}

	
	addLocalPlayer(e: React.MouseEvent<HTMLDivElement>) {
		
		this.props.addPlayerData({
			login : uuidv4(),
			playerName: "New Player",
			playerColor: getRandomColor(),
			playerPicURL: defaultAvatars[getRandomInt(0, defaultAvatars.length - 1)] 
		})
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
					isProfile={counter? false : true}
					key={this.props.playerDataList[counter].login}
					// props:
					listEditMode={this.state.listEditMode}
					player={this.props.playerDataList[counter]}

					setListEditMode={(mode) => this.setState({listEditMode: mode})}
					changePlayerData={this.changePlayerData}
					deletePlayer={this.deletePlayer}
				/>
			);
		}
		return (
			<ul id="players-list" className={"" + this.state.listEditMode}>
				{players}	
				<div id="add-player-input" className="neumorphic-button-circle changable-name" onClick={this.addLocalPlayer}>
					<div className="bump-shadow-override">
						<span>+</span>
					</div>
					
					{/* <input className="player-name-input" onKeyPress={this.changePlayerName} onBlur={this.hideInput} defaultValue="" /> */}
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
	isProfile?: boolean,
	isActive?: boolean,
	isEditingName?: boolean,
	listEditMode: string,
	player: playerData,
	setListEditMode(mode : string) : void,
	changePlayerData(player: playerData): void,
	deletePlayer(login: string): void,
}
interface PlayerState {
	playerColor: string,
	isActive: boolean,
	isEditingName: boolean
}

class PlayerOfList extends Component<PlayerProps, PlayerState> {
	constructor(props: PlayerProps) {
		super(props);
		this.state = {
			playerColor: this.props.player.playerColor,
			isActive : !!this.props.isActive,
			isEditingName: false //!!this.props.isEditingName
		}
		this.changeColorSelf = this.changeColorSelf.bind(this)
		this.changePlayerName = this.changePlayerName.bind(this)
		this.changePlayerColor = this.changePlayerColor.bind(this)
		this.deletePlayer = this.deletePlayer.bind(this)
		this.enableChoose = this.enableChoose.bind(this)
		this.enableEdit = this.enableEdit.bind(this)
		this.showInput = this.showInput.bind(this)
		this.hideInput = this.hideInput.bind(this)
	}
	componentDidMount() {
		if (this.props.isActive) {
			this.showInput()
		}
	}
	changeColorSelf(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({playerColor: e.currentTarget.value})
	}
	changePlayerName(e: React.KeyboardEvent<HTMLInputElement>) {
		var x = e.which || e.keyCode;
		if (x === 13) {
			e.preventDefault();
			this.props.changePlayerData({...this.props.player, playerName: e.currentTarget.value })
			this.setState({isEditingName: false})
		}
	}
	changePlayerColor(e: React.ChangeEvent<HTMLInputElement>) {
		console.log(e.currentTarget.value)
		this.props.changePlayerData({...this.props.player, playerColor: e.currentTarget.value})
	}
	deletePlayer() {
		this.props.deletePlayer(this.props.player.login)
	}
	enableEdit() {
		if (this.props.listEditMode !== "edit-player-toggle") {
			this.setState({isActive: true})
			this.props.setListEditMode("edit-player-toggle")
		}
		
	}
	enableChoose() {
		this.setState({isActive: false})
		this.props.setListEditMode("choose-player-toggle")
		
	}
	showInput() {
		
		this.setState({isEditingName : true}, () => {		
			let input = (document.getElementById(this.props.player.login)?.querySelector(".player-name-input") as HTMLElement)
			if (input) input.focus()
		})

	}
	showHint() {
		alert("Editing your profile name can be done only at your profile page!");
	}
	hideInput() {
		this.setState({isEditingName : false})
	}
	render() {
		let { playerName, login, playerColor, playerPicURL} = this.props.player
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
				{ !this.props.isProfile &&
					<div className="button-delete" onClick={this.deletePlayer}><div className="bump-shadow-override">
						<span>T</span>
					</div></div>
				}

			</div>
			<div className="player-color-avatar" style={{backgroundColor: this.state.playerColor }}></div>
		
				<div className={`profile-container changable-name${this.state.isEditingName? " active" : ""}`}>
					<img src={playerPicURL} alt="" />
					
					<span onClick={ this.props.isProfile? this.showHint : this.showInput} className="player-name">{playerName}</span> 

					{ !this.props.isProfile &&
					<input 
						className="player-name-input" 
						onKeyPress={this.changePlayerName} 
						onBlur={this.hideInput} defaultValue={playerName}
					/>}                
				</div>

			
		</li>);
  	}

}
  