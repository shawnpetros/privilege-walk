import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App () {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001')
    socket.addEventListener('message', evt => {
      console.log(evt.data)
      setMessages(JSON.parse(evt.data))
    })
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {messages.map(message => (
          <pre>{message.Body}</pre>
        ))}
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
