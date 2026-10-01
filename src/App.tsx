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

  //
  // react hooks, e.g. useState, useEffect, use*
  //

  // const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);

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
                addNewGameResult={
                  addNewGameResult
                }
              />
            } 
          />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
