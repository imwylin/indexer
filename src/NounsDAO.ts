import { ponder } from "@/generated";

ponder.on("NounsDAO:ProposalCreated", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id, proposer, targets, values, signatures, calldatas, startBlock, endBlock, description } = event.args;

  await Proposal.create({
    id: id.toString(),
    data: {
      proposalId: id,
      proposer,
      targets,
      values,
      signatures,
      calldatas,
      startBlock,
      endBlock,
      description,
      status: "PENDING",
      quorumVotes: 0n,
      proposalThreshold: 0n,
      createdTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAO:ProposalCanceled", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      status: "CANCELED",
      canceledTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAO:ProposalQueued", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id, eta } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      status: "QUEUED",
      queuedTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAO:ProposalExecuted", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      status: "EXECUTED",
      executedTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAO:ProposalVetoed", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      status: "VETOED",
      vetoedTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAO:VoteCast", async ({ event, context }) => {
  const { Vote } = context.db;
  const { voter, proposalId, support, votes, reason } = event.args;

  await Vote.create({
    id: `${proposalId.toString()}-${voter}`,
    data: {
      proposal: proposalId.toString(),
      voter,
      support: support === 1,
      votes: BigInt(votes), // Ensure votes is converted to BigInt
      reason: reason || undefined,
      refunded: false,
    },
  });
});

ponder.on("NounsDAO:RefundableVote", async ({ event, context }) => {
  const { Vote } = context.db;
  const { voter, refundAmount, refundSent } = event.args;

  // Find votes for this voter that haven't been refunded
  const votesResult = await Vote.findMany({
    where: { voter: voter, refunded: false },
    orderBy: { id: "desc" },
    limit: 1,
  });

  // Check if we found any votes
  if (votesResult.items.length > 0) {
    const mostRecentVote = votesResult.items[0];
    if (mostRecentVote) {
      await Vote.update({
        id: mostRecentVote.id,
        data: {
          refunded: refundSent,
        },
      });
      console.log(`Updated vote ${mostRecentVote.id} for ${voter} as refunded.`);
    } else {
      console.log(`Found a vote result but it was undefined for voter ${voter}.`);
    }
  } else {
    console.log(`No unrefunded votes found for voter ${voter}.`);
  }

  // You might want to log this information or handle it in some other way
  console.log(`Refund for ${voter}: Amount ${refundAmount}, Sent: ${refundSent}`);
});

ponder.on("NounsDAO:EscrowedToFork", async ({ event, context }) => {
  const { Fork, ForkJoin } = context.db;
  const { forkId, owner, tokenIds, proposalIds, reason } = event.args;

  await Fork.create({
    id: forkId.toString(),
    data: {
      forkId: BigInt(forkId), // Ensure forkId is converted to BigInt
      tokensInEscrow: BigInt(tokenIds.length),
      executed: false,
    },
  });

  await ForkJoin.create({
    id: `${forkId.toString()}-${owner}`,
    data: {
      fork: forkId.toString(),
      participant: owner,
      tokenIds: tokenIds.map(id => BigInt(id)), // Ensure all tokenIds are BigInt
      proposalIds: proposalIds.map(id => BigInt(id)), // Ensure all proposalIds are BigInt
      reason: reason || undefined,
    },
  });
});

ponder.on("NounsDAO:ExecuteFork", async ({ event, context }) => {
  const { Fork } = context.db;
  const { forkId, forkTreasury, forkToken, forkEndTimestamp, tokensInEscrow } = event.args;

  await Fork.update({
    id: forkId.toString(),
    data: {
      forkTreasury,
      forkToken,
      forkEndTimestamp,
      tokensInEscrow,
      executed: true,
    },
  });
});

ponder.on("NounsDAO:JoinFork", async ({ event, context }) => {
  const { ForkJoin } = context.db;
  const { forkId, owner, tokenIds, proposalIds, reason } = event.args;

  await ForkJoin.create({
    id: `${forkId.toString()}-${owner}`,
    data: {
      fork: forkId.toString(),
      participant: owner,
      tokenIds,
      proposalIds,
      reason: reason || undefined,
    },
  });
});

ponder.on("NounsDAO:WithdrawFromForkEscrow", async ({ event, context }) => {
  // This event might require more complex logic depending on how you want to handle withdrawals
  // For now, we'll just log it
  console.log("WithdrawFromForkEscrow event:", event.args);
});