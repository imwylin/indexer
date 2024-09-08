import { ponder } from "@/generated";

ponder.on(
  "NounsDAOV4:DAONounsSupplyIncreasedFromEscrow",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on(
  "NounsDAOV4:DAOWithdrawNounsFromEscrow",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on(
  "NounsDAOV4:ERC20TokensToIncludeInForkSet",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on("NounsDAOV4:EscrowedToFork", async ({ event, context }) => {
  console.log(event.args);
});
