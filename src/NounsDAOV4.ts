import { ponder } from "@/generated";

ponder.on("NounsDAOV4:ProposalCreated", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id, proposer, targets, values, signatures, calldatas, startBlock, endBlock, description } = event.args;

  await Proposal.create({
    id: id.toString(),
    data: {
      proposalId: id,
      proposer,
      targets,
      values: values.map(String),
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

ponder.on("NounsDAOV4:ProposalCanceled", async ({ event, context }) => {
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

ponder.on("NounsDAOV4:ProposalVetoed", async ({ event, context }) => {
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

ponder.on("NounsDAOV4:ProposalExecuted", async ({ event, context }) => {
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

ponder.on("NounsDAOV4:ProposalQueued", async ({ event, context }) => {
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

ponder.on("NounsDAOV4:VoteCast", async ({ event, context }) => {
  const { Vote } = context.db;
  const { voter, proposalId, support, votes, reason } = event.args;

  await Vote.create({
    id: `${proposalId.toString()}-${voter}`,
    data: {
      proposal: proposalId.toString(),
      voter,
      support: support === 1,
      votes,
      reason: reason || undefined,
      refunded: false,
    },
  });
});

ponder.on("NounsDAOV4:VoteCastWithClientId", async ({ event, context }) => {
  const { Vote } = context.db;
  const { voter, proposalId, clientId } = event.args;

  await Vote.update({
    id: `${proposalId.toString()}-${voter}`,
    data: {
      clientId: BigInt(clientId),
    },
  });
});

ponder.on("NounsDAOV4:RefundableVote", async ({ event, context }) => {
  const { Vote } = context.db;
  const { voter, refundAmount, refundSent } = event.args;

  // Note: This event doesn't include the proposalId, so we can't directly update the Vote.
  // We might need to implement a different strategy to handle this, such as:
  // 1. Keeping track of the latest vote for each voter
  // 2. Updating all unrefunded votes for this voter
  // 3. Creating a separate Refund entity

  console.log(`Refund for ${voter}: Amount ${refundAmount}, Sent: ${refundSent}`);
});

ponder.on("NounsDAOV4:EscrowedToFork", async ({ event, context }) => {
  const { Fork, ForkJoin } = context.db;
  const { forkId, owner, tokenIds, proposalIds, reason } = event.args;

  await Fork.create({
    id: forkId.toString(),
    data: {
      forkId: BigInt(forkId), // Convert number to BigInt
      tokensInEscrow: BigInt(tokenIds.length),
      executed: false,
    },
  });

  await ForkJoin.create({
    id: `${forkId.toString()}-${owner}`,
    data: {
      fork: forkId.toString(),
      participant: owner,
      tokenIds: tokenIds.map(String),
      proposalIds: proposalIds.map(String),
      reason: reason || undefined,
    },
  });
});

ponder.on("NounsDAOV4:ExecuteFork", async ({ event, context }) => {
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

ponder.on("NounsDAOV4:JoinFork", async ({ event, context }) => {
  const { ForkJoin } = context.db;
  const { forkId, owner, tokenIds, proposalIds, reason } = event.args;

  await ForkJoin.create({
    id: `${forkId.toString()}-${owner}`,
    data: {
      fork: forkId.toString(),
      participant: owner,
      tokenIds: tokenIds.map(String),
      proposalIds: proposalIds.map(String),
      reason: reason || undefined,
    },
  });
});

ponder.on("NounsDAOV4:WithdrawFromForkEscrow", async ({ event, context }) => {
  // This event might require more complex logic depending on how you want to handle withdrawals
  // For now, we'll just log it
  console.log("WithdrawFromForkEscrow event:", event.args);
});