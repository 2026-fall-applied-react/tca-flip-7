import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type SetupProps = {
    setTitle: (t: string) => void;
    previousPlayers: string[];
    setCurrentPlayers: (players: string[]) => void;
};

export const Setup: React.FC<SetupProps> = ({
    setTitle,
    previousPlayers,
    setCurrentPlayers,
}) => {

    const [availablePlayers, setAvailablePlayers] = useState(
        previousPlayers.map(
            x => (
                {
                    name: x,
                    checked: false,
                }
            )
        )
    );

    useEffect(
        () => setTitle("Setup"),
        [],
    );

    const nav = useNavigate();

    return (
        <div>
            <button 
                className="btn btn-primary btn-lg mt-3 w-full lg:w-64"
                onClick={
                    () => {
                        setCurrentPlayers(
                            availablePlayers
                                .filter(
                                    x => x.checked
                                )
                                .map(
                                    x => x.name
                                )
                        );
                        nav('/play');
                    }
                }
            >
                Play the Game
            </button>
            <div
                className="my-5 flex flex-col"
            >
                {
                    availablePlayers.map(
                        x => (
                            <label
                                key={x.name}
                            >
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-lg my-3" 
                                    checked={x.checked}
                                    onChange={
                                        (e) => setAvailablePlayers(
                                            players => players.map(
                                                player => player.name === x.name
                                                    ? { ...player, checked: e.target.checked }
                                                    : player
                                            )
                                        )
                                    }
                                />
                                <span
                                    className="text-lg ml-3"
                                >
                                    {x.name}
                                </span>
                            </label>
                        )
                    )
                }
            </div>
        </div>
    );
};