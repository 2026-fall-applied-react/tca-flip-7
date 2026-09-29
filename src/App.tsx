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

  const addNewGameResult = (newResult: GameResult) => setGameResults(
    [
      ...gameResults,
      newResult,
    ]
  );

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm m-0">
        <a className="text-xl font-bold">Flip 7 Companion</a>
      </div>
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
                <Play
                  addNewGameResult={addNewGameResult}
                />
              }
            />
          </Routes>
        </HashRouter>
      </div>
    </>
  )
}

export default App
