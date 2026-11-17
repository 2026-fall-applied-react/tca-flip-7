import { durationFormatter } from "human-readable";

const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>(
    {
        allowMultiples: [
            "y",
            "mo",
            "d",
        ]
    }
);

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

export type CardDraw = {
    // 1-based round of the game the card was drawn in
    round: number;
    timestamp: string;
    player: string;
    card: FlipSevenCard;
};

export type PlayerHand = {
    numbers: number[];
    secondChance: boolean;
    busted: boolean;
    total: number;
};

export type GameResult = {
    winner: string;
    players: string[];
    start: string;
    end: string;
    cardDraws: CardDraw[];
};

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: number;
    player: string;
};

export type GeneralFacts = {
    lastPlayed: string;
    totalGames: number;
    shortestGame: string;
    longestGame: string;
};

export type GameDurationEntry = {
    players: number;
    games: number;
    avg: string;
};

export type WinStreak = {
    length: number;
    games: GameResult[];
    // the game that ended the streak, null if it's still active
    brokenBy: GameResult | null;
};

export type WinStreakEntry = {
    player: string;
    current: WinStreak | null;
    longest: WinStreak;
};

// a streak is 2+ wins in a row, games the player sat out don't break it
export const MIN_STREAK_LENGTH = 0;

//
// public funcs
//
// a duplicate number busts the player unless they hold a second chance, which it consumes
export const getPlayerHand = (
    cards: FlipSevenCard[],
): PlayerHand => {
    const numbers: number[] = [];
    let secondChance = false;
    let busted = false;
    let plus = 0;
    let doubled = false;

    for (const card of cards) {
        if (busted) {
            break;
        }
        if (typeof card === "number") {
            if (numbers.includes(card)) {
                if (secondChance) {
                    secondChance = false;
                }
                else {
                    busted = true;
                }
            }
            else {
                numbers.push(card);
            }
        }
        else if (card === "Second Chance") {
            secondChance = true;
        }
        else if (card === "x2") {
            doubled = true;
        }
        else if (card.startsWith("+")) {
            plus += Number(card.slice(1));
        }
    }

    const numberSum = numbers.reduce((acc, x) => acc + x, 0);

    return {
        numbers,
        secondChance,
        busted,
        total: busted ? 0 : numberSum * (doubled ? 2 : 1) + plus,
    };
};

// cards no longer in the draw pile; the deck carries over between rounds and is
// reshuffled when it runs out, leaving only the cards in play that round out of it
export const getCardsOutOfDeck = (
    draws: CardDraw[],
): FlipSevenCard[] => {
    const deckSize = Object.values(DECK_COMPOSITION).reduce<number>(
        (acc, x) => acc + x,
        0,
    );

    return draws
        .reduce<CardDraw[]>(
            (out, draw) => [
                ...(
                    out.length >= deckSize
                        ? out.filter(x => x.round === draw.round)
                        : out
                ),
                draw,
            ],
            [],
        )
        .map(x => x.card);
};

// chance (0 - 1) the next card from the shared deck busts a player with this hand
export const getBustChance = (
    hand: PlayerHand,
    allDrawnCards: FlipSevenCard[],
): number => {
    if (hand.busted || hand.secondChance) {
        return 0;
    }

    const drawnCount = (card: FlipSevenCard) => allDrawnCards.filter(
        x => x === card
    ).length;

    const remaining = (card: FlipSevenCard) => Math.max(
        0,
        DECK_COMPOSITION[card] - drawnCount(card),
    );

    const deckSize = Object.keys(DECK_COMPOSITION)
        .map(parseCardKey)
        .reduce<number>((acc, x) => acc + remaining(x), 0);

    if (deckSize === 0) {
        return 0;
    }

    const bustCards = hand.numbers.reduce<number>(
        (acc, x) => acc + remaining(x as FlipSevenCard),
        0,
    );

    return bustCards / deckSize;
};

export const getWinStreaks = (
    games: GameResult[],
): WinStreakEntry[] => {

    const gamesOldestFirst = [...games].sort(
        (a, b) => Date.parse(a.end) - Date.parse(b.end)
    );

    return getPreviousPlayers(games)
        .map(
            player => {
                let run: GameResult[] = [];
                let longest: WinStreak = { length: 0, games: [], brokenBy: null };

                gamesOldestFirst
                    .filter(
                        x => x.players.includes(player)
                    )
                    .forEach(
                        x => {
                            if (x.winner === player) {
                                run = [...run, x];

                                // >= so a tie goes to the more recent streak
                                if (run.length >= longest.length) {
                                    longest = { length: run.length, games: run, brokenBy: null };
                                }
                            }
                            else {
                                // this loss ended the longest streak so far
                                if (run.length > 0 && longest.games === run) {
                                    longest = { ...longest, brokenBy: x };
                                }
                                run = [];
                            }
                        }
                    );

                return {
                    player,
                    current: run.length >= MIN_STREAK_LENGTH
                        ? { length: run.length, games: run, brokenBy: null }
                        : null,
                    longest,
                };
            }
        )
        .filter(
            x => x.longest.length >= MIN_STREAK_LENGTH
        )
        .sort(
            (a, b) => (
                b.longest.length - a.longest.length
                || (b.current?.length ?? 0) - (a.current?.length ?? 0)
                || a.player.localeCompare(b.player)
            )
        );
};

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

export const getGeneralFacts = (
    games: GameResult[],
): GeneralFacts => {

    // bail early if no game results
    if (
        games.length === 0
    ) {
        return (
            {
                lastPlayed: "N/A",
                totalGames: 0,
                shortestGame: "N/A",
                longestGame: "N/A",
            }
        );
    }

    const nowForCalcs = Date.now();

    const gamesLastPlayedInMs = games.map(
        x => nowForCalcs - Date.parse(x.end)
    );

    const mostRecentGameInMs = Math.min(
        ...gamesLastPlayedInMs
    );

    const gameDurationsInMs = games.map(
        x => Date.parse(x.end) - Date.parse(x.start)
    );

    return (
        {
            lastPlayed: `${formatLastPlayed(mostRecentGameInMs)} ago`,
            totalGames: games.length,
            shortestGame: formatGameDuration(
                Math.min(
                    ...gameDurationsInMs,
                ),
            ),
            longestGame: formatGameDuration(
                Math.max(
                    ...gameDurationsInMs,
                ),
            ),
        }
    );
};

export const getGameDurations = (
    games: GameResult[],
): GameDurationEntry[] => games

    // unique player counts
    .map(
        x => x.players.length
    )
    .filter(
        (x, i, a) => i === a.indexOf(x)
    )

    // sorted 1 - n
    .sort(
        (a, b) => a - b
    )

    .map(
        playerCount => {
            const durationsInMs = games
                .filter(
                    x => x.players.length === playerCount
                )
                .map(
                    x => Date.parse(x.end) - Date.parse(x.start)
                );

            return {
                players: playerCount,
                games: durationsInMs.length,
                avg: formatGameDuration(
                    durationsInMs.reduce(
                        (acc, x) => acc + x,
                        0,
                    ) / durationsInMs.length
                ),
            };
        }
    )
;

export const getPreviousPlayers = (
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
// helper funcs
//
// Object.keys turns numeric cards into strings, this restores them
const parseCardKey = (key: string): FlipSevenCard => (
    /^\d+$/.test(key) ? Number(key) as FlipSevenCard : key as FlipSevenCard
);

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
