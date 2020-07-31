import React, { useState } from 'react'
import GameSettings from './GameSettings'
import './styles/Header.css'
import defaultProfilePic from './resources/images/icons/logo.svg'


// fetch these from cookies (in near future)
let sessionToken = 0;
let sessionTokenIsValidated = false;
let accountUsername = 'PetyaVasin'
let accountPictureSrc = defaultProfilePic

// main header component, uses 'Settings' and 'HeaderAccountControl' components
export default function Header() {
    const [settingsShow, settingsToggle] = useState(false)
    
    return (
        <>
        <header>
            <nav className='header-nav'>
                <button 
                    onClick={() => settingsToggle(!settingsShow)}
                    id='settings-button' className='header-menu-item'
                >Settings</button>
                <a href='./?p=game' className='header-menu-item'>Game</a>
                <a href='./?p=rules' className='header-menu-item'>Rules</a>
                <a href='./?p=about' className='header-menu-item'>About</a>
            </nav>
            <HeaderAccountControl/>
        </header>
        { settingsShow ?
            <GameSettings username={accountUsername} tokenIsValid={sessionTokenIsValidated} />
            : null
        }
    </>
    )
}

// Account control via buttons. Contains links to the 'account' page and 'create-acc' page.
function HeaderAccountControl() {
    const [isLoggedIn, setLoggedIn] = useState(false)

    if (isLoggedIn) {
        accountUsername = 'PetyaVasin'
        return (
            <div className='header-login'>
                <a href='./account' className='header-menu-item'>
                    <img src={accountPictureSrc} alt=''/>
                    {accountUsername}
                </a>
                <button id='logout-button' onClick={() => setLoggedIn(false)} className='header-menu-item'>Logout</button>
            </div>
        )
    } else {
        accountUsername = 'Guest'
        return (
            <div className='header-login'>
                <a href={'./account&?user=' + accountUsername + '&?token=' + sessionToken} className='header-menu-item'>
                    <img src={defaultProfilePic} alt=''/>
                    Guest
                </a>
                <button id='sign-in-button' onClick={() => setLoggedIn(true)/*() => showLoginPopup()*/}
                        className='header-menu-item'>Sign In
                </button>
                <a href='/create-acc' className='header-menu-item'>Sign Up</a>
            </div>
        )
    }
}


function showLoginPopup() {
    console.log('pidor')
}