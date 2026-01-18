package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.contracts.EvidenceContract;
import com.template.states.EvidenceState;
import net.corda.core.contracts.Command;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@InitiatingFlow
@StartableByRPC
public class TransferCustodyFlow extends FlowLogic<SignedTransaction> {

    private final String evidenceID;
    private final Party newOwner;
    private final String transferNote;

    public TransferCustodyFlow(String evidenceID, Party newOwner, String transferNote) {
        this.evidenceID = evidenceID;
        this.newOwner = newOwner;
        this.transferNote = transferNote;
    }

    @Suspendable
    @Override
    public SignedTransaction call() throws FlowException {
        Party currentOwner = getOurIdentity();
        Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

        List<StateAndRef<EvidenceState>> results = getServiceHub().getVaultService().queryBy(EvidenceState.class).getStates();

        StateAndRef<EvidenceState> inputRef = results.stream()
                .filter(s -> s.getState().getData().getEvidenceID().equals(evidenceID))
                .findFirst()
                .orElseThrow(() -> new FlowException("Evidence not found"));

        EvidenceState input = inputRef.getState().getData();

        if (!input.getOwner().equals(currentOwner)) {
            throw new FlowException("Only owner can transfer");
        }

        List<String> newHistory = new ArrayList<>(input.getCustodyHistory());
        newHistory.add(transferNote);

        EvidenceState output = new EvidenceState(
                input.getEvidenceID(),
                input.getHash(),
                input.getTimestamp(),
                newOwner,
                newHistory,
                input.getOriginalIssuer()
        );

        Command<EvidenceContract.Commands.Transfer> command = new Command<>(
                new EvidenceContract.Commands.Transfer(),
                Arrays.asList(currentOwner.getOwningKey(), newOwner.getOwningKey())
        );

        TransactionBuilder builder = new TransactionBuilder(notary)
                .addInputState(inputRef)
                .addOutputState(output)
                .addCommand(command);

        builder.verify(getServiceHub());

        SignedTransaction ptx = getServiceHub().signInitialTransaction(builder);

        FlowSession session = initiateFlow(newOwner);
        SignedTransaction stx = subFlow(new CollectSignaturesFlow(ptx, Arrays.asList(session)));

        return subFlow(new FinalityFlow(stx, Arrays.asList(session)));
    }
}
