import { input, select } from "@inquirer/prompts";
import { Prize, Winner } from "./props/types";

export class LotteryGame {
    private _winners: Winner[];
    private _jackpot: number = 200;
    private _winningBalls: Array<number> = [];
    private _participants: Array<{ firstName: string; balls: number[] }> = [];

    get jackpot() {
        return this._jackpot;
    }

    get winningBalls() {
        return this._winningBalls;
    }

    get participants() {
        return this._participants;
    }

    set participants(participants) {
        this._participants = participants;
    }

    private generateRandomBall(): number {
        let ball: number;
        do {
            ball = Math.floor(Math.random() * 100) + 1;
        } while (this._winningBalls.includes(ball));
        return ball;
    }

    public generateRandomBalls(): number[] {
        const balls: number[] = [];
        while (balls.length < 3) {
            const ball = this.generateRandomBall();
            balls.push(ball);
        }
        return balls;
    }

    private async getUserFirstName(): Promise<string> {
        return input({ message: "Enter your first name :" });
    }

    private async mainMenu(): Promise<string> {
        const command = await select({
            message: "Select a command (or 'exit' to exit) :",
            choices: [
                { value: "purchase", name: "Purchase" },
                { value: "draw", name: "Draw" },
                { value: "winners", name: "Winners" },
                { value: "exit", name: "Quit" },
            ],
        });
        return command;
    }

    public async purchaseTicket(): Promise<void> {
        const firstName = await this.getUserFirstName();
        const balls = this.generateRandomBalls();
        this._participants.push({ firstName, balls });
        console.log(`Tickets purchased for ${firstName}: ${balls.join(", ")}`);
    }

    public selectWinners(): Array<Winner> {
        console.log("Please wait...");
        const allBalls = this._participants.flatMap(
            (participant) => participant.balls
        );
        const shuffledParticipants = [...this._participants].sort(
            () => 0.5 - Math.random()
        );
        const selectedWinners: Array<Winner> = [];

        while (selectedWinners.length < 3 && shuffledParticipants.length > 0) {
            this._winningBalls = this.generateRandomBalls();
            const shuffledBalls = allBalls.sort(() => 0.5 - Math.random());
            const newWinners = shuffledBalls.slice(0, 3);
            const matchingParticipants = shuffledParticipants.filter(
                (participant) =>
                    participant.balls.some((ball) =>
                        newWinners.includes(ball)
                    ) &&
                    !selectedWinners.some(
                        (winner) => winner.firstName === participant.firstName
                    )
            );
            const remainingSlots = 3 - selectedWinners.length;
            if (matchingParticipants.length > remainingSlots) {
                matchingParticipants.splice(remainingSlots);
            }
            selectedWinners.push(...matchingParticipants);
            matchingParticipants.forEach((participant) => {
                const index = shuffledParticipants.findIndex(
                    (p) => p.firstName === participant.firstName
                );
                if (index !== -1) {
                    shuffledParticipants.splice(index, 1);
                }
            });
        }

        console.log("We randomly selected three winners.");
        return selectedWinners;
    }

    public displayResults(winners: Array<Winner>): void {
        console.log("CodeCraft Challenge Results :");
        console.log("");
        console.log(`1st ball : ${this._winningBalls[0]}`);
        console.log(`2nd ball : ${this._winningBalls[1]}`);
        console.log(`3rd ball : ${this._winningBalls[2]}`);
        console.log("");

        console.log("Winners :");
        winners.slice(0, 3).forEach((winner, index) => {
            const prizes: Prize = {
                0: (75 / 100) * this._jackpot,
                1: (15 / 100) * this._jackpot,
                2: (10 / 100) * this._jackpot,
            };
            const prize = prizes[index];
            console.log(`${winner.firstName} : ${prize}€`);
        });
        console.log("");
    }

    public async start(): Promise<void> {
        let command: string;
        do {
            command = await this.mainMenu();
            switch (command) {
                case "purchase":
                    await this.purchaseTicket();
                    break;
                case "draw":
                    this._winners = this.selectWinners();
                    break;
                case "winners":
                    this.displayResults(this._winners);
                    break;
                default:
                    break;
            }
        } while (command !== "exit");
    }
}
