import { ponder } from "@/generated";

ponder.on("NounsDAOData:ProposalCandidateCreated", async ({ event, context }) => {
  const { ProposalCandidate } = context.db;
  const { msgSender, targets, values, signatures, calldatas, description, slug } = event.args;

  await ProposalCandidate.create({
    id: slug,
    data: {
      proposer: msgSender,
      values,
      targets,
      signatures,
      calldatas,
      description,
      status: "CREATED",
      createdTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAOData:ProposalCandidateUpdated", async ({ event, context }) => {
  const { ProposalCandidate } = context.db;
  const { msgSender, targets, values, signatures, calldatas, description, slug } = event.args;

  await ProposalCandidate.update({
    id: slug,
    data: {
      proposer: msgSender,
      values,
      targets,
      signatures,
      calldatas,
      description,
      status: "UPDATED",
      updatedTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAOData:ProposalCandidateCanceled", async ({ event, context }) => {
  const { ProposalCandidate } = context.db;
  const { slug } = event.args;

  await ProposalCandidate.update({
    id: slug,
    data: {
      status: "CANCELED",
      canceledTimestamp: BigInt(event.block.timestamp),
    },
  });
});

ponder.on("NounsDAOData:SignatureAdded", async ({ event, context }) => {
  const { Signature } = context.db;
  const { signer, sig, expirationTimestamp } = event.args;

  await Signature.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      signer,
      signature: sig,
      expirationTimestamp,
      canceled: false,
    },
  });
});

ponder.on("NounsDAOData:CandidateFeedbackSent", async ({ event, context }) => {
  const { Feedback } = context.db;
  const { msgSender, slug, support, reason } = event.args;

  await Feedback.create({
    id: `${slug}-${msgSender}`,
    data: {
      proposalCandidate: slug,
      sender: msgSender,
      support: support === 1,
      reason: reason || undefined,
    },
  });
});

ponder.on("NounsDAOData:FeedbackSent", async ({ event, context }) => {
  const { Feedback } = context.db;
  const { msgSender, proposalId, support, reason } = event.args;

  await Feedback.create({
    id: `${proposalId.toString()}-${msgSender}`,
    data: {
      proposal: proposalId.toString(),
      sender: msgSender,
      support: support === 1,
      reason: reason || undefined,
    },
  });
});

ponder.on("NounsDAOData:ETHWithdrawn", async ({ event, context }) => {
  const { Withdrawal } = context.db;
  const { to, amount } = event.args;

  await Withdrawal.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      withdrawer: to,
      amount,
      timestamp: BigInt(event.block.timestamp),
    },
  });
});