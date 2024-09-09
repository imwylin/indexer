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
        created: BigInt(event.block.timestamp),
        background: "",
        body: "",
        accessory: "",
        head: "",
        glasses: ""
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
  const { Delegate, Noun } = context.db;
  const { delegator, fromDelegate, toDelegate } = event.args;

  // Update the Noun's delegate
  const { items: nouns } = await Noun.findMany({
    where: { owner: delegator },
  });
  
  await Promise.all(nouns.map(async (noun: { id: string }) => {
    await Noun.update({
      id: noun.id,
      data: { delegate: toDelegate },
    });
  }));

  // Update or create Delegate records
  if (fromDelegate !== toDelegate) {
    if (fromDelegate !== "0x0000000000000000000000000000000000000000") {
      const fromDelegateRecord = await Delegate.findUnique({ id: fromDelegate });
      if (fromDelegateRecord) {
        await Delegate.update({
          id: fromDelegate,
          data: {
            tokenBalance: fromDelegateRecord.tokenBalance - BigInt(nouns.length),
          },
        });
      }
    }

    let toDelegateRecord = await Delegate.findUnique({ id: toDelegate });
    if (toDelegateRecord) {
      await Delegate.update({
        id: toDelegate,
        data: {
          tokenBalance: toDelegateRecord.tokenBalance + BigInt(nouns.length),
        },
      });
    } else {
      await Delegate.create({
        id: toDelegate,
        data: {
          delegator,
          delegate: toDelegate,
          tokenBalance: BigInt(nouns.length),
          votes: 0n,
        },
      });
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

  const { background, body, accessory, head, glasses } = seed;

  const nounRecord = await Noun.findUnique({ id: tokenId.toString() });

  if (nounRecord) {
    await Noun.update({
      id: tokenId.toString(),
      data: {
        ...nounRecord,
        background: background.toString(),
        body: body.toString(),
        accessory: accessory.toString(),
        head: head.toString(),
        glasses: glasses.toString(),
      },
    });
  }
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