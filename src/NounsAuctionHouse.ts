import { ponder } from "@/generated";

ponder.on("NounsAuctionHouse:AuctionBid", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsAuctionHouse:AuctionCreated", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("NounsAuctionHouse:AuctionExtended", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on(
  "NounsAuctionHouse:AuctionMinBidIncrementPercentageUpdated",
  async ({ event, context }) => {
    console.log(event.args);
  },
);
