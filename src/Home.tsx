import { useNavigate } from "react-router";
import type { GeneralFacts, LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const APP_TITLE = "Flip 7 Companion";

type HomeProps = {
    leaderboard: LeaderboardEntry[];
    setTitle: (t: string) => void;
    generalFacts: GeneralFacts;
};

export const Home: React.FC<HomeProps> = ({
    leaderboard: lb,
    setTitle,
    generalFacts,
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
        <div className="space-y-10">
            <button
                className="btn btn-primary btn-lg mt-3 w-full lg:w-64"
                onClick={
                    () => nav('/setup')
                }
            >
                Setup a Game
            </button>
            <section>
                <h2 className="mb-3 text-2xl font-black uppercase tracking-wide">
                    General Facts
                </h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <tbody>
                            <tr>
                                <td>
                                    Last played
                                </td>
                                <th>
                                    {generalFacts.lastPlayed}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Total games
                                </td>
                                <th>
                                    {generalFacts.totalGames}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Shortest game
                                </td>
                                <th>
                                    {generalFacts.shortestGame}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Longest game
                                </td>
                                <th>
                                    {generalFacts.longestGame}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className="border-t border-base-content/20 pt-6">
                <h2 className="mb-3 text-2xl font-black uppercase tracking-wide">
                    Leaderboard
                </h2>
                {
                    lb.length === 0
                        ? (
                            <p className="py-4">
                                Setup & play a game to see the leaderboard...
                            </p>
                        )
                        : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
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
        </div>
    );
};