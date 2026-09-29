import { useNavigate } from "react-router";

export const Home = () => {

    const nav = useNavigate();

    return (
        <div>
            <h1>
                Home
            </h1>

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
                                    <tr>
                                        <td>1</td>
                                        <td>1</td>
                                        <td>0.500</td>
                                        <td>Tom</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};