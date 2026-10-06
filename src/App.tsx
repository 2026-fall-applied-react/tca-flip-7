import './App.css'
import {
  HashRouter,
  Routes,
  Route,
} from 'react-router'
import { APP_TITLE, Home } from './Home'
import { Setup } from './Setup'
import { Play } from './Play'
import { getGeneralFacts, getLeaderboard, getPreviousPlayers, type GameResult } from './GameResults'
import { useState } from 'react'

const dummyGameResults: GameResult[] = [
  {
    winner: "Bryson",
    players: [
      "Zack",
      "Bryson",
      "Tom",
    ],
    start: "2026-10-06T12:30:00.123Z",
    end: "2026-10-06T12:58:12.123Z",
  },
  {
    winner: "Bryson",
    players: [
      "Bryson",
      "Tom",
      "Suzzie",
    ],
    start: "2026-10-06T12:30:00.123Z",
    end: "2026-10-06T12:58:12.123Z",
  },
  {
    winner: "Zack",
    players: [
      "Zack",
      "Suzzie",
    ],
    start: "2026-10-06T12:30:00.123Z",
    end: "2026-10-06T12:58:12.123Z",
  },
  {
    winner: "John",
    players: [
      "John",
      "Tom",
    ],
    start: "2026-10-06T12:30:00.123Z",
    end: "2026-10-06T12:58:12.123Z",
  },
];


const App = () => {

  //
  // react hooks, e.g. useState, useEffect, use*
  //

  // const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);

  const [title, setTitle] = useState(APP_TITLE);

  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);

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
                  generalFacts={
                    getGeneralFacts(gameResults)
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
                  setCurrentPlayers={
                    setCurrentPlayers
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
                  currentPlayers={
                    currentPlayers
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
