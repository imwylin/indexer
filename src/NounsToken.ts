import { ponder } from "@/generated";

ponder.on("NounsToken:Transfer", async ({ event, context }) => {
  const { Noun } = context.db;
  const { from, to, tokenId } = event.args;

  if (from === "0x0000000000000000000000000000000000000000") {
    // Minting
    await Noun.create({
      id: tokenId.toString(),
      data: {
        tokenId,
        owner: to,
        background: "",  // These will be updated when NounCreated event is handled
        body: "",
        accessory: "",
        head: "",
        glasses: "",
        created: BigInt(event.block.timestamp),
      },
    });
  } else if (to === "0x0000000000000000000000000000000000000000") {
    // Burning
    await Noun.update({
      id: tokenId.toString(),
      data: {
        owner: to,
        burned: BigInt(event.block.timestamp),
      },
    });
  } else {
    // Transfer
    await Noun.update({
      id: tokenId.toString(),
      data: {
        owner: to,
      },
    });
  }
});

ponder.on("NounsToken:DelegateChanged", async ({ event, context }) => {
  const { Noun, Delegate } = context.db;
  const { delegator, fromDelegate, toDelegate } = event.args;

  // Update Nouns owned by the delegator
  const nouns = await Noun.findMany({
    where: { owner: delegator },
  });

  for (const noun of nouns.items) {
    await Noun.update({
      id: noun.id,
      data: { delegate: toDelegate },
    });
  }

  // Update Delegate records
  if (fromDelegate !== toDelegate) {
    if (fromDelegate !== "0x0000000000000000000000000000000000000000") {
      const fromDelegateRecord = await Delegate.findUnique({ id: fromDelegate });
      if (fromDelegateRecord) {
        await Delegate.update({
          id: fromDelegate,
          data: {
            votes: fromDelegateRecord.votes - BigInt(nouns.items.length),
          },
        });
      }
    }

    if (toDelegate !== "0x0000000000000000000000000000000000000000") {
      const toDelegateRecord = await Delegate.findUnique({ id: toDelegate });
      if (toDelegateRecord) {
        await Delegate.update({
          id: toDelegate,
          data: {
            votes: toDelegateRecord.votes + BigInt(nouns.items.length),
          },
        });
      } else {
        await Delegate.create({
          id: toDelegate,
          data: {
            delegator,
            delegate: toDelegate,
            votes: BigInt(nouns.items.length),
            tokenBalance: BigInt(nouns.items.length),
          },
        });
      }
    }
  }
});

ponder.on("NounsToken:DelegateVotesChanged", async ({ event, context }) => {
  const { Delegate } = context.db;
  const { delegate, previousBalance, newBalance } = event.args;

  await Delegate.update({
    id: delegate,
    data: {
      votes: newBalance,
    },
  });
});

ponder.on("NounsToken:NounCreated", async ({ event, context }) => {
  const { Noun } = context.db;
  const { tokenId, seed } = event.args;

  await Noun.update({
    id: tokenId.toString(),
    data: {
      background: seed.background.toString(),
      body: seed.body.toString(),
      accessory: seed.accessory.toString(),
      head: seed.head.toString(),
      glasses: seed.glasses.toString(),
    },
  });
});

ponder.on("NounsToken:NounBurned", async ({ event, context }) => {
  const { Noun } = context.db;
  const { tokenId } = event.args;

  await Noun.update({
    id: tokenId.toString(),
    data: {
      burned: BigInt(event.block.timestamp),
    },
  });
});