import { describe, it, expect } from "vitest";
import {
    DECK_COMPOSITION,
    getBustPercent,
    mockGameFreshDeck,
    mockGamePartialDeck,
    type FlipSevenCard,
} from "./GameResults";

// every card in the deck, one entry per physical card
const fullDeck: FlipSevenCard[] = Object.entries(DECK_COMPOSITION).flatMap(
    ([card, count]) => Array(count).fill(card)
) as FlipSevenCard[];

describe("getBustPercent", () => {

    it("returns 0 for a player not in the game", () => {
        expect(
            getBustPercent(mockGameFreshDeck, "Snape")
        ).toBe(0);
    });

    it("returns 0 for a player with no cards drawn", () => {
        expect(
            getBustPercent(mockGameFreshDeck, "Ron")
        ).toBe(0);
    });

    it("returns 8/92 for a player holding 3 and 7 on a fresh deck", () => {
        expect(
            getBustPercent(mockGameFreshDeck, "Harry")
        ).toBe(8 / 92);
    });

    it("returns 7/90 when another player has drawn one of the 7s", () => {
        expect(
            getBustPercent(mockGamePartialDeck, "Harry")
        ).toBe(7 / 90);
    });

    it("returns 0 when the deck is exhausted", () => {
        expect(
            getBustPercent({
                winner: "",
                players: ["Harry"],
                playerCardsDrawn: [
                    {
                        player: "Harry",
                        cardsDrawn: fullDeck,
                    },
                ],
            }, "Harry")
        ).toBe(0);
    });
});