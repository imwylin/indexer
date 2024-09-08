import { ponder } from "@/generated";

ponder.on("NounsAuctionHouseV2:AuctionBid", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on(
  "NounsAuctionHouseV2:AuctionBidWithClientId",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on("NounsAuctionHouseV2:AuctionCreated", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsAuctionHouseV2:AuctionExtended", async ({ event, context }) => {
  console.log(event.args);
});
