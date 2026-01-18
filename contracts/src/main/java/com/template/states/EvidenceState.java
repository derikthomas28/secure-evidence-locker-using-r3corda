package com.template.states;

import com.template.contracts.EvidenceContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.ContractState;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@BelongsToContract(EvidenceContract.class)
public class EvidenceState implements ContractState {

    private final String evidenceID;
    private final String hash;
    private final long timestamp;
    private final Party owner;
    private final List<String> custodyHistory;
    private final Party originalIssuer;

    public EvidenceState(String evidenceID, String hash, long timestamp, Party owner, List<String> custodyHistory, Party originalIssuer) {
        this.evidenceID = evidenceID;
        this.hash = hash;
        this.timestamp = timestamp;
        this.owner = owner;
        this.custodyHistory = new ArrayList<>(custodyHistory);
        this.originalIssuer = originalIssuer;
    }

    public String getEvidenceID() { return evidenceID; }
    public String getHash() { return hash; }
    public long getTimestamp() { return timestamp; }
    public Party getOwner() { return owner; }
    public List<String> getCustodyHistory() { return Collections.unmodifiableList(custodyHistory); }
    public Party getOriginalIssuer() { return originalIssuer; }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return List.of(owner, originalIssuer);
    }
}
