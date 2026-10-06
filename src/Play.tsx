import { useNavigate } from "react-router";
import type { GameResult } from "./GameResults";
import { useEffect, useState } from "react";

type PlayProps = {
    addNewGameResult: (r: GameResult) => void;
    setTitle: (t: string) => void;
    currentPlayers: string[];
};

export const Play: React.FC<PlayProps> = ({
    addNewGameResult,
    setTitle,
    currentPlayers,
}) => {

    //
    // react hooks...
    //
    const [startTimestamp] = useState(
        new Date().toISOString()
    );

    useEffect(
        () => setTitle("Play"),
        [],
    );


    const nav = useNavigate();

    //
    // calculated state...
    //

    //
    // return jsx...
    //
    return (
        <div>
            {
                currentPlayers.map(
                    x => (
                        <button 
                            className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
                            onClick={
                                () => {
                                    addNewGameResult({
                                        winner: x,
                                        players: currentPlayers,
                                        start: startTimestamp,
                                        end: new Date().toISOString(),
                                    });
                                    nav(-2);
                                }
                            }
                        >
                            {x} Won
                        </button>

                    )
                )
            }
        </div>
    );
};