import './App.css'
import {
  HashRouter,
  Routes,
  Route,
} from 'react-router'
import { APP_NAME, Home } from './Home'
import { Setup } from './Setup'
import { Play } from './Play'
import { getLeaderboard, getPreviousPlayers, type GameResult } from './GameResults'
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

  //
  // react hooks, state, effect, b, b, blah
  //
  const [gameResults, setGameResults] = useState(dummyGameResults);

  const [title, setTitle] = useState(APP_NAME);

  //
  // helper funcs and calculated, derived state...
  //
  const addNewGameResult = (newResult: GameResult) => setGameResults(
    [
      ...gameResults,
      newResult,
    ]
  );

  //
  // return jsx
  //
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm m-0">
        <p className="text-xl font-bold">{title}</p>
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
                  setTitle={
                    setTitle
                  }
                  leaderboardData={
                    getLeaderboard(gameResults)
                  }
                />
              }
            />
            <Route
              path='/setup'
              element={
                <Setup 
                  setTitle={
                    setTitle
                  }
                  previousPlayers={
                    getPreviousPlayers(gameResults)
                  }
                />
              }
            />
            <Route
              path='/play'
              element={
                <Play
                  setTitle={
                    setTitle
                  }
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
