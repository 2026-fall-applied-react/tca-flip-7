//
// type defs/aliases
//
export type FlipSevenCard = 12
    | 11
    | 10
    | 9
    | 8
    | 7
    | 6
    | 5
    | 4
    | 3
    | 2
    | 1
    | 0
    | "+2"
    | "+4"
    | "+6"
    | "+8"
    | "+10"
    | "x2"
    | "Freeze"
    | "Flip Three"
    | "Second Chance"
;

// 1 - 0, 1 -1, 2 - 2 ... 12 - 12, 1 each of plus and times modifiers, 3 freeze, 3 flip three, 3 second chance
export const DECK_COMPOSITION: Record<FlipSevenCard, number> = {
    0: 1,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    "+2": 1,
    "+4": 1,
    "+6": 1,
    "+8": 1,
    "+10": 1,
    "x2": 1,
    "Freeze": 3,
    "Flip Three": 3,
    "Second Chance": 3,
};

export type GameResult = {
    winner: string;
    players: string[];
    playerCardsDrawn?: {
        player: string;
        cardsDrawn: FlipSevenCard[];
    }[];
};

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: number;
    player: string;
};

//
// public funcs
//
export const getLeaderboard = (
    games: GameResult[]
): LeaderboardEntry[] => getPreviousPlayers(
    games
)
    .map(
        x => ({
            ...getLeaderboarEntry(
                games,
                x,
            )
        })
    )
    .sort(
        (a, b) => (
            a.avg !== b.avg
                // if diff avgs, sort highest avg first
                ? b.avg - a.avg
                : a.wins === 0 && b.wins === 0
                    // if tied avg, and zero wins, rank player with more games without a win lower
                    ? (a.wins + a.losses) - (b.wins + b.losses)
                    // if tied avg, and some wins, rank player with more games higher, 
                    // they maintained that avg for more games so higher ranked
                    : (b.wins + b.losses) - (a.wins + a.losses)
        )
    )
;

// chance, as a decimal between 0 and 1, that a player's next card drawn
// will be a bust, i.e. a number card they already have a copy of
export const getBustPercent = (
    game: GameResult,
    player: string,
): number => {

    const playerEntry = (game.playerCardsDrawn ?? []).find(
        x => x.player === player
    );

    // player isn't in this game, or hasn't drawn any cards yet
    if (!playerEntry) {
        return 0;
    }

    const remainingDeck = getRemainingDeck(game);

    const totalCardsRemaining = Object.values(remainingDeck).reduce(
        (sum, count) => sum + count,
        0,
    );

    // deck is empty, no cards left to draw
    if (totalCardsRemaining === 0) {
        return 0;
    }

    const heldNumbers = getHeldNumberCards(playerEntry.cardsDrawn);

    const bustCardsRemaining = heldNumbers.reduce<number>(
        (sum, n) => sum + remainingDeck[n],
        0,
    );

    return bustCardsRemaining / totalCardsRemaining;
};

//
// helper funcs
//

// remaining copies of each card still in the deck, after removing every
// card already drawn by any player in this game (single shared deck)
const getRemainingDeck = (
    game: GameResult,
): Record<FlipSevenCard, number> => {

    const remainingDeck = {
        ...DECK_COMPOSITION,
    };

    (game.playerCardsDrawn ?? []).forEach(
        x => x.cardsDrawn.forEach(
            card => remainingDeck[card] = Math.max(
                0,
                remainingDeck[card] - 1,
            )
        )
    );

    return remainingDeck;
};

// unique number cards (0-12) a player currently holds, these are the
// cards that would bust the player if drawn again
const getHeldNumberCards = (
    cardsDrawn: FlipSevenCard[],
): Extract<FlipSevenCard, number>[] => cardsDrawn

    .filter(
        (x): x is Extract<FlipSevenCard, number> => typeof x === "number"
    )

    // unique
    .filter(
        (x, i, a) => i === a.findIndex(
            y => y === x
        )
    )
;

const getLeaderboarEntry = (
    games: GameResult[],
    player: string,
): LeaderboardEntry => {

    const numberOfPlayerGames = games.filter(
        x => x.players.some(
            y => y === player
        )
    ).length;

    const numerOfPlayerWins = games.filter(
        x => x.winner === player
    ).length;

    return {
        wins: numerOfPlayerWins,
        losses: numberOfPlayerGames - numerOfPlayerWins,
        avg: numberOfPlayerGames > 0
            ? numerOfPlayerWins / numberOfPlayerGames
            : 0,
        player: player
    };
};

const getPreviousPlayers = (
    games: GameResult[],
): string[] => games

    // just the players as a string array
    .flatMap(
        x => x.players
    )

    // unique players
    .filter(
        (x, i, a) => i === a.findIndex(
            y => y === x
        )
    )

    // sorted alphabetically
    .sort(
        (a, b) => a.localeCompare(b)
    )
;

//
// mock data, for manually sanity checking getBustPercent, e.g. in the
// console: console.log(getBustPercent(mockGameFreshDeck, "Harry"))
//

// fresh deck, Harry holds 3 and 7, nobody else has drawn anything yet
// expect bust % = (remaining 3s + remaining 7s) / 94 = (3 + 7) / 94
export const mockGameFreshDeck: GameResult = {
    winner: "",
    players: [
        "Harry",
        "Ron",
    ],
    playerCardsDrawn: [
        {
            player: "Harry",
            cardsDrawn: [3, 7],
        },
        {
            player: "Ron",
            cardsDrawn: [],
        },
    ],
};

// deck has been drawn into by both players, Harry holds 3 and 7, and
// one of the remaining 7s has already been drawn by Ron
// expect bust % = (remaining 3s + remaining 7s) / totalRemaining
//               = (3 + 6) / (94 - 2) = 9 / 92
export const mockGamePartialDeck: GameResult = {
    winner: "",
    players: [
        "Harry",
        "Ron",
    ],
    playerCardsDrawn: [
        {
            player: "Harry",
            cardsDrawn: [3, 7],
        },
        {
            player: "Ron",
            cardsDrawn: [7, "Freeze"],
        },
    ],
};