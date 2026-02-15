import { Agent } from './agent/core';

async function main() {
    const mission = process.argv[2] || "Create a simple Todo list in React";

    console.log("Initializing AI Agent Platform Prototype...");
    const agent = new Agent(mission);

    try {
        await agent.run();
        console.log("Mission Completed Successfully!");
    } catch (error) {
        console.error("Mission Failed:", error);
    }
}

main();
