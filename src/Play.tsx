import { useNavigate } from "react-router";
import {
    getBustChance,
    getCardsOutOfDeck,
    getPlayerHand,
    type CardDraw,
    type FlipSevenCard,
    type GameResult,
} from "./GameResults";
import { useEffect, useReducer, useState } from "react";

type PlayProps = {
    addNewGameResult: (r: GameResult) => void;
    setTitle: (t: string) => void;
    currentPlayers: string[];
};

//
// reducer
//
type PlayState = {
    round: number;
    order: string[];
    draws: CardDraw[];
    passed: string[];
    expanded: string | null;
    picking: string | null;
};

type PlayAction =
    | { type: "move"; player: string; direction: -1 | 1 }
    | { type: "myTurn"; player: string }
    | { type: "nextPlayer"; player: string }
    | { type: "togglePicking"; player: string }
    | { type: "draw"; player: string; card: FlipSevenCard; timestamp: string }
    | { type: "undoDraw"; player: string }
    | { type: "togglePass"; player: string }
    | { type: "nextRound" };

const toggleIn = (list: string[], item: string) => (
    list.includes(item) ? list.filter(x => x !== item) : [...list, item]
);

const reducer = (state: PlayState, action: PlayAction): PlayState => {
    switch (action.type) {
        case "move": {
            const from = state.order.indexOf(action.player);
            const to = from + action.direction;
            if (to < 0 || to >= state.order.length) {
                return state;
            }
            const order = [...state.order];
            [order[from], order[to]] = [order[to], order[from]];
            return { ...state, order };
        }
        case "myTurn":
            return { ...state, expanded: action.player, picking: null };
        case "nextPlayer": {
            const next = state.order[(state.order.indexOf(action.player) + 1) % state.order.length];
            return { ...state, expanded: next, picking: null };
        }
        case "togglePicking":
            return {
                ...state,
                picking: state.picking === action.player ? null : action.player,
            };
        case "draw":
            return {
                ...state,
                draws: [
                    ...state.draws,
                    {
                        round: state.round,
                        timestamp: action.timestamp,
                        player: action.player,
                        card: action.card,
                    },
                ],
                picking: null,
            };
        case "undoDraw": {
            const last = state.draws.findLastIndex(
                x => x.player === action.player && x.round === state.round
            );
            return last < 0
                ? state
                : { ...state, draws: state.draws.filter((_, i) => i !== last) };
        }
        case "togglePass":
            return {
                ...state,
                passed: toggleIn(state.passed, action.player),
                picking: null,
            };
        case "nextRound":
            return {
                ...state,
                round: state.round + 1,
                passed: [],
                picking: null,
            };
    }
};

//
// card choices for the draw picker
//
const NUMBER_CARDS: FlipSevenCard[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MODIFIER_CARDS: FlipSevenCard[] = ["+2", "+4", "+6", "+8", "+10", "x2"];
const ACTION_CARDS: FlipSevenCard[] = ["Freeze", "Flip Three", "Second Chance"];

export const Play: React.FC<PlayProps> = ({
    addNewGameResult,
    setTitle,
    currentPlayers,
}) => {

    //
    // react hooks...
    //
    useEffect(
        () => setTitle("Play"),
        [],
    );

    const [startTimestamp] = useState(
        new Date().toISOString()
    );

    const [state, dispatch] = useReducer(
        reducer,
        currentPlayers,
        (players): PlayState => ({
            round: 1,
            order: players,
            draws: [],
            passed: [],
            expanded: null,
            picking: null,
        }),
    );

    const nav = useNavigate();

    //
    // calculated state...
    //
    const cardsOutOfDeck = getCardsOutOfDeck(state.draws);

    const getRoundCards = (player: string, round: number) => state.draws
        .filter(x => x.player === player && x.round === round)
        .map(x => x.card);

    const rounds = Array.from({ length: state.round }, (_, i) => i + 1);

    const endGame = (winner: string) => {
        addNewGameResult({
            winner,
            players: currentPlayers,
            start: startTimestamp,
            end: new Date().toISOString(),
            cardDraws: state.draws,
        });
        nav(-2);
    };

    const gameTotals = currentPlayers.map(
        player => ({
            player,
            total: rounds.reduce(
                (acc, r) => acc + getPlayerHand(getRoundCards(player, r)).total,
                0
            ),
        })
    );
    const topScore = Math.max(...gameTotals.map(x => x.total));

    //
    // return jsx...
    //
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between sticky top-0 z-10 bg-base-100 py-2">
                <h2 className="text-xl font-bold text-primary">
                    Round {state.round}
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => dispatch({ type: "nextRound" })}
                >
                    Next Round
                </button>
            </div>
            {
                state.order.map(
                    (player, i) => {
                        const cards = getRoundCards(player, state.round);
                        const hand = getPlayerHand(cards);
                        const bustChance = getBustChance(hand, cardsOutOfDeck);
                        const roundScores = rounds.map(
                            r => getPlayerHand(getRoundCards(player, r)).total
                        );
                        const gameTotal = roundScores.reduce((acc, x) => acc + x, 0);
                        const passed = state.passed.includes(player);
                        const canDraw = !hand.busted && !passed;
                        const expanded = state.expanded === player;
                        const picking = state.picking === player;

                        return (
                            <section
                                key={player}
                                className={`card card-border bg-base-100 ${canDraw ? "border-primary/40" : "border-base-300 opacity-70"}`}
                            >
                                <div className="card-body p-3 gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col">
                                            <button
                                                className="btn btn-ghost btn-xs px-1 min-h-0 h-5"
                                                aria-label={`Move ${player} up`}
                                                disabled={i === 0}
                                                onClick={() => dispatch({ type: "move", player, direction: -1 })}
                                            >
                                                ▲
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-xs px-1 min-h-0 h-5"
                                                aria-label={`Move ${player} down`}
                                                disabled={i === state.order.length - 1}
                                                onClick={() => dispatch({ type: "move", player, direction: 1 })}
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-primary flex-1">
                                            {player}
                                        </h3>
                                        {hand.busted && <span className="badge badge-error">Bust</span>}
                                        {passed && <span className="badge badge-neutral">Passed</span>}
                                        {hand.secondChance && <span className="badge badge-info">2nd Chance</span>}
                                        <button
                                            className={`btn btn-sm ${expanded ? "btn-primary" : "btn-outline"}`}
                                            onClick={() => dispatch({ type: expanded ? "nextPlayer" : "myTurn", player })}
                                        >
                                            {expanded ? "Next" : "My Turn"}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="text-xs opacity-70">Round</div>
                                            <div className="text-2xl font-bold">{hand.total}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs opacity-70">Game</div>
                                            <div className="text-2xl font-bold">{gameTotal}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs opacity-70">Bust chance</div>
                                            <div
                                                className={`text-2xl font-bold ${bustChance >= 0.4 ? "text-error" : bustChance >= 0.2 ? "text-warning" : "text-success"}`}
                                            >
                                                {Math.round(bustChance * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 min-h-6">
                                        {
                                            cards.length === 0
                                                ? <span className="opacity-60 text-sm">No cards drawn</span>
                                                : cards.map(
                                                    (card, j) => (
                                                        <span key={j} className="badge badge-outline">
                                                            {card}
                                                        </span>
                                                    )
                                                )
                                        }
                                    </div>
                                    {
                                        expanded && (
                                            <div className="flex flex-col gap-2 pt-2 border-t border-base-300">
                                                {
                                                    rounds.slice(0, -1).map(
                                                        r => (
                                                            <div key={r} className="flex items-center gap-2 text-sm">
                                                                <span className="font-semibold w-8">R{r}</span>
                                                                <div className="flex flex-wrap gap-1 flex-1">
                                                                    {
                                                                        getRoundCards(player, r).map(
                                                                            (card, j) => (
                                                                                <span key={j} className="badge badge-outline badge-sm">
                                                                                    {card}
                                                                                </span>
                                                                            )
                                                                        )
                                                                    }
                                                                </div>
                                                                <span className="font-bold">{roundScores[r - 1]}</span>
                                                            </div>
                                                        )
                                                    )
                                                }
                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-primary flex-1"
                                                        disabled={!canDraw}
                                                        onClick={() => dispatch({ type: "togglePicking", player })}
                                                    >
                                                        Draw
                                                    </button>
                                                    <button
                                                        className="btn btn-outline"
                                                        disabled={hand.busted}
                                                        onClick={() => dispatch({ type: "togglePass", player })}
                                                    >
                                                        {passed ? "Resume" : "Pass"}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline"
                                                        disabled={cards.length === 0}
                                                        onClick={() => dispatch({ type: "undoDraw", player })}
                                                    >
                                                        Undo
                                                    </button>
                                                </div>
                                                {
                                                    picking && canDraw && (
                                                        <div className="flex flex-col gap-2">
                                                            {
                                                                [NUMBER_CARDS, MODIFIER_CARDS, ACTION_CARDS].map(
                                                                    (group, g) => (
                                                                        <div
                                                                            key={g}
                                                                            className={`grid gap-1 ${g === 2 ? "grid-cols-3" : "grid-cols-5 sm:grid-cols-7"}`}
                                                                        >
                                                                            {
                                                                                group.map(
                                                                                    card => (
                                                                                        <button
                                                                                            key={card}
                                                                                            className={`btn btn-sm ${typeof card === "number" && hand.numbers.includes(card) ? "btn-error btn-outline" : "btn-secondary btn-outline"}`}
                                                                                            onClick={
                                                                                                () => dispatch({
                                                                                                    type: "draw",
                                                                                                    player,
                                                                                                    card,
                                                                                                    timestamp: new Date().toISOString(),
                                                                                                })
                                                                                            }
                                                                                        >
                                                                                            {card}
                                                                                        </button>
                                                                                    )
                                                                                )
                                                                            }
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </section>
                        );
                    }
                )
            }
            <section className="border-t-2 border-primary/40 pt-3">
                <h2 className="text-xl font-bold text-primary pb-2">
                    Game Over
                </h2>
                <div className="flex flex-col">
                    {
                        gameTotals.map(
                            ({ player: x, total }) => {
                                return (
                                <button
                                    key={x}
                                    className={`btn btn-primary btn-lg mt-3 w-full lg:w-64 ${total === topScore ? "" : "btn-outline"}`}
                                    onClick={() => endGame(x)}
                                >
                                    {x} Won ({total})
                                </button>
                                );
                            }
                        )
                    }
                </div>
            </section>
        </div>
    );
};
