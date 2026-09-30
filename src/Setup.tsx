import { useEffect } from "react";
import { useNavigate } from "react-router";

type SetupProps = {
    setTitle: (t: string) => void;
    previousPlayers: string[];
};

export const Setup: React.FC<SetupProps> = ({
    setTitle,
    previousPlayers,
}) => {

    useEffect(
        () => setTitle("Setup"),
        [],
    );
        
    const nav = useNavigate();

    return (
        <div>
            <button 
                className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
                onClick={
                    () => nav('/play')
                }
            >
                Play the Game
            </button>
            <ul
                className="list-disc ml-3 mt-3"
            >
                {
                    previousPlayers.map(
                        x => (
                            <li>
                                {x}
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    );
};