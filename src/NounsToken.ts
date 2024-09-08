import { ponder } from "@/generated";

ponder.on("NounsToken:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsToken:ApprovalForAll", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsToken:DelegateChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsToken:DelegateVotesChanged", async ({ event, context }) => {
  console.log(event.args);
});
