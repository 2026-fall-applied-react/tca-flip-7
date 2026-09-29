import './App.css'
import {
  HashRouter,
  Routes,
  Route,
} from 'react-router'
import { Home } from './Home'
import { Setup } from './Setup'
import { Play } from './Play'
import { getLeaderboard, type GameResult } from './GameResults'
import { useState } from 'react'

const dummyGameResults: GameResult[] = [
    {
        winner: "Bryson",
        players: [
            "Zack",
            "Bryson",
            "Tom",
        ],
    },
    {
        winner: "Bryson",
        players: [
            "Bryson",
            "Tom",
            "Suzzie",
        ],
    },
    {
        winner: "Zack",
        players: [
            "Zack",
            "Suzzie",
        ]
    },
    {
        winner: "John",
        players: [
            "John",
            "Tom",
        ],
    },
];

const App = () => {

  const [gameResults, setGameResults] = useState(dummyGameResults);
  
  return (
    <div
      className='p-3'
    >
      <HashRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Home 
                leaderboardData={
                  getLeaderboard(gameResults)
                }
              />
            } 
          />
          <Route
            path='/setup'
            element={
              <Setup />
            } 
          />
          <Route
            path='/play'
            element={
              <Play />
            } 
          />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
