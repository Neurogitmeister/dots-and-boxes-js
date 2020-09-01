import React, { useState } from 'react'
import '../../styles/Header.scss'
import { AccountContext } from '../../App'


interface HeaderProps {
    settingsMenuToggle() : void
}

// main header component, uses 'Settings' and 'HeaderAccountControl' components
export default function Header(props: HeaderProps) {
    //const [settingsShow, settingsToggle] = useState(false)
    
    return (
        <header>
            <nav className='header-nav'>
                <button 
                    onClick={() => props.settingsMenuToggle()}
                    id='settings-button' className='header-menu-item'
                >Settings</button>
                <a href='./?p=game' className='header-menu-item'>Game</a>
                <a href='./?p=rules' className='header-menu-item'>Rules</a>
                <a href='./?p=about' className='header-menu-item'>About</a>
            </nav>
            <AccountContext.Consumer>
            {
                value => 
                <HeaderAccountControl
                    accountUsername={value.account.player.playerName}
                    accountPictureSrc={value.account.player.playerPicURL}
                />
            }
            </AccountContext.Consumer>
        </header>
    )
}

// Account control via buttons. Contains links to the 'account' page and 'create-acc' page.
function HeaderAccountControl(props: any) {
    const [isLoggedIn, setLoggedIn] = useState(false)
    //let {accountUsername, accountPictureSrc, sessionToken} = props
    
    return(
        <div className='header-login'>
            <a href='./account' className='header-menu-item'>
                <img src={props.accountPictureSrc} alt=''/>
                {props.accountUsername}
            </a>
            {
                isLoggedIn &&
                <button id='logout-button' onClick={() => setLoggedIn(false)} className='header-menu-item'>Logout</button>
            }
            {
                !isLoggedIn && <>
                <button id='sign-in-button' onClick={() => setLoggedIn(true)/*() => showLoginPopup()*/}
                className='header-menu-item'>Sign In
                </button>
                <a href='/create-acc' className='header-menu-item'>Sign Up</a>
                </>
            }
        </div>
    )
}
