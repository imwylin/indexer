import { ponder } from "@/generated";

ponder.on("NounsAuctionHouse:AuctionCreated", async ({ event, context }) => {
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

ponder.on("NounsAuctionHouse:AuctionBid", async ({ event, context }) => {
  const { Auction, Bid } = context.db;
  const { nounId, sender, value, extended } = event.args;

  await Bid.create({
    id: `${nounId}-${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      auction: nounId.toString(),
      bidder: sender,
      amount: value,
      timestamp: BigInt(event.block.timestamp),
      extended,
    },
  });

  await Auction.update({
    id: nounId.toString(),
    data: {
      amount: value,
      bidder: sender,
    },
  });
});

ponder.on("NounsAuctionHouse:AuctionExtended", async ({ event, context }) => {
  const { Auction } = context.db;
  const { nounId, endTime } = event.args;

  await Auction.update({
    id: nounId.toString(),
    data: { endTime },
  });
});

ponder.on("NounsAuctionHouse:AuctionSettled", async ({ event, context }) => {
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