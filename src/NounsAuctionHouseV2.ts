import { ponder } from "@/generated";

ponder.on("NounsAuctionHouseV2:AuctionCreated", async ({ event, context }) => {
  const { Auction } = context.db;
  const { nounId, startTime, endTime } = event.args;

  await Auction.create({
    id: nounId.toString(),
    data: {
      nounId,
      startTime,
      endTime,
      amount: 0n,
      bidder: "0x0000000000000000000000000000000000000000",
      settled: false,
    },
  });
});

ponder.on("NounsAuctionHouseV2:AuctionBidWithClientId", async ({ event, context }) => {
  const { Auction, Bid } = context.db;
  const { nounId, value, clientId } = event.args;
  
  // Get the bidder address from the transaction sender
  const bidder = event.transaction.from;

  await Bid.create({
    id: `${nounId}-${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      auction: nounId.toString(),
      bidder,
      amount: value,
      clientId: BigInt(clientId), // Convert number to bigint
      timestamp: BigInt(event.block.timestamp),
      extended: false, // We don't have this information in the event, so we'll set it to false
    },
  });

  await Auction.update({
    id: nounId.toString(),
    data: {
      amount: value,
      bidder,
      // We don't have 'extended' information, so we'll leave endTime as is
    },
  });
});

ponder.on("NounsAuctionHouseV2:AuctionExtended", async ({ event, context }) => {
  const { Auction } = context.db;
  const { nounId, endTime } = event.args;

  await Auction.update({
    id: nounId.toString(),
    data: { endTime },
  });
});

ponder.on("NounsAuctionHouseV2:AuctionSettled", async ({ event, context }) => {
  const { Auction } = context.db;
  const { nounId, winner, amount } = event.args;

  await Auction.update({
    id: nounId.toString(),
    data: {
      settled: true,
      bidder: winner,
      amount,
    },
  });
});

ponder.on("NounsAuctionHouseV2:AuctionSettledWithClientId", async ({ event, context }) => {
  const { Auction } = context.db;
  const { nounId, clientId } = event.args;

  await Auction.update({
    id: nounId.toString(),
    data: {
      settled: true,
      clientId: BigInt(clientId), // Convert number to bigint
    },
  });
});