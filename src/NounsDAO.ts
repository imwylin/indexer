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
      votes,
      reason: reason || undefined,
      refunded: false,
    },
  });
});

ponder.on("NounsDAO:RefundableVote", async ({ event, context }) => {
  const { Vote } = context.db;
  const { voter, refundAmount, refundSent } = event.args;

  const votesResult = await Vote.findMany({
    where: { voter: voter, refunded: false },
    orderBy: { id: "desc" },
    limit: 1,
  });

  if (votesResult.items.length > 0) {
    const mostRecentVote = votesResult.items[0];
    if (mostRecentVote) {
      await Vote.update({
        id: mostRecentVote.id,
        data: {
          refunded: refundSent,
        },
      });
    }
  }
});

ponder.on("NounsDAO:ProposalCreatedOnTimelockV1", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      status: "CREATED_ON_TIMELOCK_V1",
      updatedTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAO:ProposalUpdated", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id, proposer, targets, values, signatures, calldatas, description, updateMessage } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      proposer,
      targets,
      values,
      signatures,
      calldatas,
      description,
      updatedTimestamp: BigInt(event.block.timestamp),
    },
  });
});