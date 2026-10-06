import './App.css'
import {
  HashRouter,
  Routes,
  Route,
} from 'react-router'
import { APP_TITLE, Home } from './Home'
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

  //
  // react hooks, e.g. useState, useEffect, use*
  //

  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  // const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);

  const [title, setTitle] = useState(APP_TITLE);

  //
  // derived or calculated state and helper funcs
  //
  const addNewGameResult = (newGameResult: GameResult) => setGameResults(
    [
      ...gameResults,
      newGameResult,
    ]
  );

  //
  // returns jsx
  //
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <p className="font-bold text-xl">{title}</p>
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
                  leaderboard={
                    getLeaderboard(gameResults)
                  }
                  setTitle={
                    setTitle
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
                />
              }
            />
            <Route
              path='/play'
              element={
                <Play
                  addNewGameResult={
                    addNewGameResult
                  }
                  setTitle={
                    setTitle
                  }
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
