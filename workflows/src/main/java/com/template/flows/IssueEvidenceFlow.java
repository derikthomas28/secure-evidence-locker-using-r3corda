package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.contracts.EvidenceContract;
import com.template.states.EvidenceState;
import net.corda.core.contracts.Command;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.ProgressTracker;

import java.time.Instant;
import java.util.Collections;

@InitiatingFlow
@StartableByRPC
public class IssueEvidenceFlow extends FlowLogic<SignedTransaction> {

    private final String evidenceID;
    private final String hash;
    private final java.util.List<String> initialCustodyNotes;

    public IssueEvidenceFlow(String evidenceID, String hash, java.util.List<String> initialCustodyNotes) {
        this.evidenceID = evidenceID;
        this.hash = hash;
        this.initialCustodyNotes = initialCustodyNotes;
    }

    @Suspendable
    @Override
    public SignedTransaction call() throws FlowException {
        Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);
        Party owner = getOurIdentity();

        EvidenceState state = new EvidenceState(evidenceID, hash, Instant.now().getEpochSecond(), owner, initialCustodyNotes, owner);

        Command<EvidenceContract.Commands.Issue> command = new Command<>(new EvidenceContract.Commands.Issue(), owner.getOwningKey());

        TransactionBuilder builder = new TransactionBuilder(notary)
                .addOutputState(state)
                .addCommand(command);

        builder.verify(getServiceHub());

        SignedTransaction stx = getServiceHub().signInitialTransaction(builder);

        return subFlow(new FinalityFlow(stx, Collections.emptyList()));
    }
}
