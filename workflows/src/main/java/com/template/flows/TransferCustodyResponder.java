package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import net.corda.core.flows.*;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.flows.FlowException;

@InitiatedBy(TransferCustodyFlow.class)
public class TransferCustodyResponder extends FlowLogic<SignedTransaction> {

    private final FlowSession session;

    public TransferCustodyResponder(FlowSession session) {
        this.session = session;
    }

    @Suspendable
    @Override
    public SignedTransaction call() throws FlowException {
        SignedTransaction stx = subFlow(new SignTransactionFlow(session) {
            @Override
            protected void checkTransaction(SignedTransaction stx) throws FlowException {
                // Optional extra validation here
            }
        });

        return subFlow(new ReceiveFinalityFlow(session, stx.getId()));
    }
}
