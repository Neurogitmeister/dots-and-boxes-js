
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import Header from './components/header/Header'
import { DynamicPageContent } from './components/DynamicPageContent'
import Footer from './components/Footer'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <React.StrictMode>
      <Header />
      <DynamicPageContent page={0}/>
      <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
