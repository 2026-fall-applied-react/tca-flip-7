import { useNavigate } from "react-router";
import type { GameDurationEntry, GeneralFacts, LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const APP_TITLE = "Flip 7 Companion";

type HomeProps = {
    leaderboard: LeaderboardEntry[];
    setTitle: (t: string) => void;
    generalFacts: GeneralFacts;
    gameDurations: GameDurationEntry[];
};

export const Home: React.FC<HomeProps> = ({
    leaderboard: lb,
    setTitle,
    generalFacts,
    gameDurations,
}) => {

    //
    // react hooks...
    //
    useEffect(
        () => setTitle(APP_TITLE),
        [],
    );

    const nav = useNavigate();

    // 
    // calculated or derived state...
    //


    //
    // return jsx...
    //
    return (
        <div>
            <button
                className="btn btn-secondary btn-lg mt-3 w-full lg:w-64"
                onClick={
                    () => nav('/setup')
                }
            >
                Setup a Game
            </button>
            <section className="mt-8 border-t-4 border-base-content pt-2">
                <h2 className="text-lg font-black uppercase tracking-widest mb-1">
                    General
                </h2>
                <div className="overflow-x-auto">
                    <table className="table [&_td]:px-0 [&_th]:px-0 [&_td]:py-2">
                        <tbody>
                            <tr>
                                <td>Last played</td>
                                <th>{generalFacts.lastPlayed}</th>
                            </tr>
                            <tr>
                                <td>Total games</td>
                                <th>{generalFacts.totalGames}</th>
                            </tr>
                            <tr>
                                <td>Shortest game</td>
                                <th>{generalFacts.shortestGame}</th>
                            </tr>
                            <tr>
                                <td>Longest game</td>
                                <th>{generalFacts.longestGame}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className="mt-8 border-t-4 border-base-content pt-2">
                <h2 className="text-lg font-black uppercase tracking-widest mb-1">
                    Leaderboard
                </h2>
                {
                    lb.length === 0
                        ? (
                            <p 
                                className="py-3"
                            >
                                Setup & play a game to see the leaderboard...
                            </p>
                        )
                        : (
                            <div className="overflow-x-auto">
                                <table className="table [&_td]:px-0 [&_th]:px-0 [&_td]:py-2">
                                    <thead>
                                        <tr>
                                            <th>W</th>
                                            <th>L</th>
                                            <th>AVG</th>
                                            <th>PLAYER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            lb.map(
                                                x => (
                                                    <tr
                                                        key={x.player}
                                                    >
                                                        <td>{x.wins}</td>
                                                        <td>{x.losses}</td>
                                                        <td>{x.avg.toFixed(3)}</td>
                                                        <td>{x.player}</td>
                                                    </tr>
                                                )
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                }
            </section>
            <section className="mt-8 border-t-4 border-base-content pt-2">
                <h2 className="text-lg font-black uppercase tracking-widest mb-1">
                    Game Durations
                </h2>
                {
                    gameDurations.length === 0
                        ? (
                            <p
                                className="py-3"
                            >
                                Setup & play a game to see game durations...
                            </p>
                        )
                        : (
                            <div className="overflow-x-auto">
                                <table className="table [&_td]:px-0 [&_th]:px-0 [&_td]:py-2">
                                    <thead>
                                        <tr>
                                            <th>PLAYERS</th>
                                            <th>GAMES</th>
                                            <th>AVG</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            gameDurations.map(
                                                x => (
                                                    <tr
                                                        key={x.players}
                                                    >
                                                        <td>{x.players}</td>
                                                        <td>{x.games}</td>
                                                        <td>{x.avg}</td>
                                                    </tr>
                                                )
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                }
            </section>
        </div>
    );
};
