import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './App.css'

const defaultOptions = {
  credits: {
    enabled: false
  },
  title: {
    text: 'Race',
    style: {
      color: '#e6e6e6'
    }
  },
  plotOptions: {
    series: {
      borderWidth: 0
    }
  },
  legend: {
    itemStyle: {
      color: '#e6e6e6'
    }
  },
  chart: {
    backgroundColor: '#282c34',
    type: 'column'
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Score'
    }
  }
}

function App () {
  const [options, setOptions] = useState(defaultOptions)

  useEffect(() => {
    console.log('use effect fired')
    const socket = new WebSocket('ws://localhost:3001')
    socket.addEventListener('message', evt => {
      console.log(evt.data)
      const { series, xAxis } = formatData(JSON.parse(evt.data))
      setOptions({
        ...defaultOptions,
        series,
        xAxis
      })
    })
  }, [])

  const formatData = data => {
    return {
      xAxis: {
        categories: data.map((point, i) => i)
      },
      series: [
        {
          name: 'Scores',
          data: data.map(i => i.score)
        }
      ]
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <HighchartsReact
          containerProps={{ style: { width: '95vw' } }}
          highcharts={Highcharts}
          options={options}
        />
      </header>
    </div>
  )
}

export default App
