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

    const [newPlayerName, setNewPlayerName] = useState("");

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

    const validateAndAddPlayer = () => {

        // check for dupe
        const dupe = availablePlayers.find(
            x => x.name.toUpperCase() === newPlayerName.toUpperCase()
        );

        // add if not dupe
        // if (dupe === undefined) {
        //     setAvailablePlayers();
        // }

        // // otherwise, just check it
        // else {
        //     setAvailablePlayers();
        // }

        // both gonna call setAvailablePlayers... a better way ! ! !
        setAvailablePlayers(
            prev => [
                ...prev.map(
                    p => p === dupe 
                            ? { 
                                ...p, 
                                checked: true,
                            } 
                            : p
                ),
            ...(
                dupe 
                    ? [] 
                    : [
                        { 
                            name: newPlayerName, 
                            checked: true,
                        }
                    ]
            )
        ]);

        // clear out the new player name
        setNewPlayerName(
            ""
        );
    };

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
                    value={
                        newPlayerName
                    }
                    onChange={
                        (e) => setNewPlayerName(
                            e.target.value
                        )
                    }
                />
                <button 
                    className="btn btn-lg join-item rounded-r-full"
                    disabled={
                        newPlayerName.length === 0
                    }
                    onClick={
                        validateAndAddPlayer
                    }
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