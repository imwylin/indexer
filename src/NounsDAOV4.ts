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
      createdTimestamp: BigInt(event.block.timestamp),
      proposalThreshold: 0n, // You'll need to calculate or fetch this value
      quorumVotes: 0n, // You'll need to calculate or fetch this value
      objectionPeriodEndBlock: 0n, // Set this if applicable, otherwise you might remove it
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
  const { id } = event.args;

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

  const votesResult = await Vote.findMany({
    where: { voter, refunded: false },
    orderBy: { id: "desc" },
    limit: 1,
  });

  if (votesResult.items.length > 0) {
    const vote = votesResult.items[0];
    if (vote) {
      await Vote.update({
        id: vote.id,
        data: {
          refunded: refundSent,
        },
      });
    }
  }
});

ponder.on("NounsDAOV4:ProposalDescriptionUpdated", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id, description, updateMessage } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      description,
      updatedTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAOV4:ProposalTransactionsUpdated", async ({ event, context }) => {
  const { Proposal } = context.db;
  const { id, targets, values, signatures, calldatas } = event.args;

  await Proposal.update({
    id: id.toString(),
    data: {
      targets,
      values: values.map(String),
      signatures,
      calldatas,
      updatedTimestamp: BigInt(event.block.timestamp),
    },
  });
});