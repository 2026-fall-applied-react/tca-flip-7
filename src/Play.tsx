import { useNavigate } from "react-router";
import type { GameResult } from "./GameResults";
import { useEffect } from "react";

type PlayProps = {
    setTitle: (t: string) => void;
    addNewGameResult: (r: GameResult) => void;
};

export const Play: React.FC<PlayProps> = ({
    setTitle,
    addNewGameResult,
}) => {

    useEffect(
        () => setTitle("Play"),
        [],
    );
    
    const nav = useNavigate();

    return (
        <div>
            <button 
                className="btn btn-soft btn-lg mt-3"
                onClick={
                    () => {
                        addNewGameResult(
                            {
                                winner: "Hermione",
                                players: [
                                    "Harry",
                                    "Ron",
                                    "Hermione",
                                ],
                            }
                        );
                        nav(-2);
                    }
                }
            >
                Game Over
            </button>
        </div>
    );
};