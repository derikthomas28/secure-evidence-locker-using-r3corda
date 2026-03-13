package com.template.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.template.states.EvidenceState;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.FlowException;
import net.corda.core.flows.FlowLogic;
import net.corda.core.flows.StartableByRPC;
import net.corda.core.node.services.Vault;

import java.util.List;

@StartableByRPC
public class GetEvidenceByIdFlow extends FlowLogic<EvidenceState> {

    private final String evidenceID;

    public GetEvidenceByIdFlow(String evidenceID) {
        this.evidenceID = evidenceID;
    }

    @Suspendable
    @Override
    public EvidenceState call() throws FlowException {
        Vault.Page<EvidenceState> results = getServiceHub().getVaultService().queryBy(EvidenceState.class);
        List<StateAndRef<EvidenceState>> states = results.getStates();

        return states.stream()
                .map(StateAndRef::getState)
                .map(net.corda.core.contracts.TransactionState::getData)
                .filter(state -> state.getEvidenceID().equals(evidenceID))
                .findFirst()
                .orElseThrow(() -> new FlowException("Evidence not found"));
    }
}

