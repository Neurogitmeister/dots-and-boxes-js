import React from 'react';

import Header from './components/header/Header'
import Footer from './components/Footer'
import GameSettings, { defaultAvatars } from './components/settings-menu/GameSettings'
import { playerData } from './components/settings-menu/PlayersList'

import { DynamicPageContent } from './components/DynamicPageContent'

interface IAccountData {
    account: {
        sessionToken: string
        player: playerData,
    }
}

interface AppState extends IAccountData {
    settingsShow : boolean,
    sessionTokenIsValidated: boolean
}

// default context data should be overwritten in .Provider
export const AccountContext = React.createContext({
    account: {
        sessionToken: "",
        player: new playerData("","","","")
    },
    setAccountData: (accData: IAccountData) => {}
})

export default class App extends React.Component<any, AppState> {
	constructor() {
		super(null);
		this.state = {
            settingsShow: false,
            account: {
                sessionToken: "",
                player: new playerData("guest0", "Guest", defaultAvatars[0], "#ffffff")
            },
            sessionTokenIsValidated: false,
            //gameSettings : defaultGameSettings
        };
        this.setAccountContextData = this.setAccountContextData.bind(this)
    }
    setAccountContextData (accData: IAccountData) {
        this.setState({
            account: accData.account
        })
    }
	render() {
        return(
            <AccountContext.Provider value={{
                account: this.state.account,
                setAccountData: (accData) => this.setAccountContextData(accData)
            }}>

                <Header settingsMenuToggle={(show = this.state.settingsShow) => this.setState({settingsShow: !show})}/>
                
                { this.state.settingsShow ?
                <GameSettings username = { this.state.account.player.playerName } tokenIsValid = { this.state.sessionTokenIsValidated } />
                : null
                }

                <DynamicPageContent page={0}/>

                <Footer />

            </AccountContext.Provider>
            
        )
    }
}

