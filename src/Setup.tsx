import { useEffect } from "react";
import { useNavigate } from "react-router";

type SetupProps = {
    setTitle: (t: string) => void;
};

export const Setup: React.FC<SetupProps> = ({
    setTitle,
}) => {

    useEffect(
        () => setTitle("Setup"),
        [],
    );
        
    const nav = useNavigate();

    return (
        <div>
            <button 
                className="btn btn-soft btn-lg mt-3"
                onClick={
                    () => nav('/play')
                }
            >
                Play the Game
            </button>
        </div>
    );
};