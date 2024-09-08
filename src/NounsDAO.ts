import { ponder } from "@/generated";

ponder.on("NounsDAO:DAOWithdrawNounsFromEscrow", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on(
  "NounsDAO:ERC20TokensToIncludeInForkSet",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on("NounsDAO:EscrowedToFork", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsDAO:ExecuteFork", async ({ event, context }) => {
  console.log(event.args);
});
