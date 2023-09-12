import { input } from "@inquirer/prompts";
import { LotteryGame } from "../../src/modules/Lotterie/LotteryGame";

jest.mock("@inquirer/prompts", () => {
    return {
        input: jest.fn(),
        select: jest.fn(),
    };
});

describe("LotteryGame", () => {
    let lotteryGame: LotteryGame;

    beforeEach(() => {
        lotteryGame = new LotteryGame();
    });

    afterEach(() => {
        lotteryGame = null;
    });

    it("should initialize with a jackpot of 200", () => {
        expect(lotteryGame.jackpot).toBe(200);
    });

    it("should initialize with empty winning balls", () => {
        expect(lotteryGame.winningBalls.length).toBe(0);
    });

    it("should initialize with an empty participants array", () => {
        expect(lotteryGame.participants.length).toBe(0);
    });

    it("should generate random balls between 1 and 100", () => {
        const balls = lotteryGame.generateRandomBalls();
        expect(balls.length).toBe(3);
        balls.forEach((ball) => {
            expect(ball).toBeGreaterThanOrEqual(1);
            expect(ball).toBeLessThanOrEqual(100);
        });
    });

    it("should correctly add a participant when purchasing a ticket", async () => {
        const firstName = "John";
        const balls = [1, 2, 3];
        (input as jest.Mock).mockResolvedValue(firstName);
        lotteryGame.generateRandomBalls = jest.fn().mockReturnValue(balls);

        const initialParticipantsCount = lotteryGame.participants.length;
        await lotteryGame.purchaseTicket();
        expect(lotteryGame.participants.length).toBe(
            initialParticipantsCount + 1
        );
        expect(lotteryGame.participants).toContainEqual({ firstName, balls });
    });

    it("should correctly select winners", () => {
        const participants = [
            { firstName: "Alice", balls: [1, 2, 3] },
            { firstName: "Bob", balls: [4, 5, 6] },
            { firstName: "Charlie", balls: [7, 8, 9] },
        ];
        lotteryGame.participants = participants;
        lotteryGame.generateRandomBalls = jest.fn().mockReturnValue([1, 2, 3]);

        const winners = lotteryGame.selectWinners();
        expect(lotteryGame.winningBalls).toEqual([1, 2, 3]);
        expect(winners.length).toBe(3);
    });
});
