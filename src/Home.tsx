import { useNavigate } from "react-router";
import { MIN_STREAK_LENGTH, type GameDurationEntry, type GeneralFacts, type LeaderboardEntry, type WinStreak, type WinStreakEntry } from "./GameResults";
import { useEffect, useState } from "react";

export const APP_TITLE = "Flip 7 Companion";

type HomeProps = {
    leaderboard: LeaderboardEntry[];
    setTitle: (t: string) => void;
    generalFacts: GeneralFacts;
    gameDurations: GameDurationEntry[];
    winStreaks: WinStreakEntry[];
};

const formatGameDate = (iso: string) => new Date(iso).toLocaleDateString(
    undefined,
    { year: "numeric", month: "short", day: "numeric" },
);

const StreakGames: React.FC<{ title: string; streak: WinStreak | null }> = ({
    title,
    streak,
}) => (
    <div className="mb-4">
        <h4 className="font-bold mb-1">
            {title}{streak ? ` (${streak.length} wins)` : ""}
        </h4>
        {
            streak === null
                ? <p className="opacity-70">No active streak</p>
                : (
                    <ul className="list-disc pl-5">
                        {
                            streak.games.map(
                                x => (
                                    <li key={x.end}>
                                        <span className="font-semibold">{formatGameDate(x.end)}</span>
                                        {" vs "}
                                        {x.players.filter(p => p !== x.winner).join(", ") || "nobody"}
                                    </li>
                                )
                            )
                        }
                    </ul>
                )
        }
        {
            streak?.brokenBy && (
                <div className="alert alert-warning mt-2 py-2">
                    <span>
                        💥 Streak broken by <span className="font-bold">{streak.brokenBy.winner}</span>
                        {" on "}
                        {formatGameDate(streak.brokenBy.end)}
                    </span>
                </div>
            )
        }
    </div>
);

export const Home: React.FC<HomeProps> = ({
    leaderboard: lb,
    setTitle,
    generalFacts,
    gameDurations,
    winStreaks,
}) => {

    const [streakPlayer, setStreakPlayer] = useState<string | null>(null);
    const selectedStreak = winStreaks.find(
        x => x.player === streakPlayer
    );

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
        <div className="-mx-3 -mb-3">
            <button
                className="btn btn-primary btn-lg mb-3 mx-3 w-[calc(100%-1.5rem)] lg:w-64"
                onClick={
                    () => nav('/setup')
                }
            >
                Setup a Game
            </button>
            <section className="border-t-2 border-primary/40 py-3">
                <div>
                    <h2 className="text-xl font-bold text-primary px-3 pb-2">
                        General
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
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
                </div>
            </section>
            <section className="border-t-2 border-primary/40 py-3">
                <div>
                    <h2 className="text-xl font-bold text-primary px-3 pb-2">
                        Leaderboard
                    </h2>
                    {
                        lb.length === 0
                            ? (
                                <p 
                                    className="px-3 pb-2"
                                >
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
                </div>
            </section>
            <section className="border-t-2 border-primary/40 py-3">
                <div>
                    <h2 className="text-xl font-bold text-primary px-3 pb-2">
                        Win Streaks
                    </h2>
                    {
                        winStreaks.length === 0
                            ? (
                                <p
                                    className="px-3 pb-2"
                                >
                                    Win {MIN_STREAK_LENGTH}+ games in a row to start a streak...
                                </p>
                            )
                            : (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>CURRENT</th>
                                                <th>LONGEST</th>
                                                <th>PLAYER</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                winStreaks.map(
                                                    x => (
                                                        <tr
                                                            key={x.player}
                                                        >
                                                            <td>{x.current?.length ?? "-"}</td>
                                                            <td>{x.longest.length}</td>
                                                            <td>{x.player}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-xs btn-outline btn-primary"
                                                                    onClick={
                                                                        () => setStreakPlayer(x.player)
                                                                    }
                                                                >
                                                                    Details
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                    }
                </div>
            </section>
            <dialog
                className={`modal ${selectedStreak ? "modal-open" : ""}`}
                onClose={() => setStreakPlayer(null)}
            >
                <div className="modal-box">
                    {
                        selectedStreak && (
                            <>
                                <h3 className="text-lg font-bold text-primary mb-3">
                                    {selectedStreak.player}'s Win Streaks
                                </h3>
                                <StreakGames
                                    title="Current streak"
                                    streak={selectedStreak.current}
                                />
                                <StreakGames
                                    title="Longest streak"
                                    streak={selectedStreak.longest}
                                />
                            </>
                        )
                    }
                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => setStreakPlayer(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
                <div
                    className="modal-backdrop"
                    onClick={() => setStreakPlayer(null)}
                />
            </dialog>
            <section className="border-t-2 border-primary/40 py-3">
                <div>
                    <h2 className="text-xl font-bold text-primary px-3 pb-2">
                        Game Durations
                    </h2>
                    {
                        gameDurations.length === 0
                            ? (
                                <p 
                                    className="px-3 pb-2"
                                >
                                    Setup & play a game to see game durations...
                                </p>
                            )
                            : (
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
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
                </div>
            </section>
        </div>
    );
};