import { useNavigate } from "react-router";
import type { LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const APP_NAME = "Flip 7 Companion";

type HomeProps = {
    leaderboardData: LeaderboardEntry[];
    setTitle: (t: string) => void;
};

export const Home: React.FC<HomeProps> = ({
    leaderboardData,
    setTitle,
}) => {

    useEffect(
        () => setTitle(APP_NAME),
        [],
    );

    const nav = useNavigate();

    return (
        <div>
            <button
                className="btn btn-soft btn-lg mt-3"
                onClick={
                    () => nav('/setup')
                }
            >
                Setup a Game
            </button>

            <div className="card w-full bg-base-100 card-md shadow-lg my-5">
                <div className="card-body p-0">
                    <h2 className="card-title ml-3 mt-3">
                        Leaderboard
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table">
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
                                    leaderboardData.map(
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
                </div>
            </div>
        </div>
    );
};