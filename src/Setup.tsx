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

    //
    // react hooks...
    //

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

    //
    // derived or calculated state and helpers
    //
    const chosenPlayerCount = availablePlayers.filter(
        x => x.checked
    ).length;

    //
    // return jsx
    //
    return (
        <div
            className="flex flex-col"
        >
            <button 
                className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
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
                disabled={
                    chosenPlayerCount === 0
                }
            >
                {
                    chosenPlayerCount == 0
                        ? "Choose player(s) below"
                        : `Play with ${chosenPlayerCount} player${chosenPlayerCount === 1 ? '' : 's'}`
                }
            </button>
            <div 
                className="join w-full lg:w-96 bg-primary123 mt-3"
            >
                <input 
                    className="input input-lg join-item w-full" 
                    placeholder="Enter player name" 
                />
                <button 
                    className="btn btn-lg join-item rounded-r-full"
                >
                    Add
                </button>
            </div>
            {
                availablePlayers.map(
                    x => (
                        <p
                            key={x.name}
                            className="my-3"
                        >
                            <label
                                className="text-lg"
                            >
                                <input 
                                    type="checkbox"
                                    className="checkbox checkbox-lg mr-3"
                                    checked={
                                        x.checked
                                    }
                                    onChange={
                                        (e) => setAvailablePlayers(
                                            players => players.map(
                                                player => player.name === x.name
                                                    ? { 
                                                        ...player,
                                                        checked: e.target.checked,
                                                    }
                                                    : player
                                            )
                                        )
                                    }
                                />
                                {x.name}
                            </label>
                        </p>
                    )
                )
            }
        </div>
    );
};