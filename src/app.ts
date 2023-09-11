import { input } from "@inquirer/prompts";

async function main() {
    console.log(process.env.NODE_ENV);
    const answer = await input({ message: "Enter your name" });

    console.log(answer);
}

main();
