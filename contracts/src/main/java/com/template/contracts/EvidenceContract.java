package com.template.contracts;

import com.template.states.EvidenceState;
import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import java.util.List;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class EvidenceContract implements Contract {

    public static final String ID = "com.template.contracts.EvidenceContract";

    @Override
    public void verify(@NotNull LedgerTransaction tx) {
        final CommandData command = tx.getCommands().get(0).getValue();

        if (command instanceof Commands.Issue) {
            requireThat(req -> {
                req.using("No inputs for issue", tx.getInputs().isEmpty());
                List<EvidenceState> outputs = tx.outputsOfType(EvidenceState.class);
                req.using("One output for issue", outputs.size() == 1);
                EvidenceState out = outputs.get(0);
                req.using("Valid hash", out.getHash().matches("^[a-fA-F0-9]{64}$"));
                req.using("Positive timestamp", out.getTimestamp() > 0);
                req.using("Non-empty history", !out.getCustodyHistory().isEmpty());
                return null;
            });
        } else if (command instanceof Commands.Transfer) {
            requireThat(req -> {
                List<EvidenceState> inputs = tx.inputsOfType(EvidenceState.class);
                List<EvidenceState> outputs = tx.outputsOfType(EvidenceState.class);
                req.using("One input/output for transfer", inputs.size() == 1 && outputs.size() == 1);
                EvidenceState in = inputs.get(0);
                EvidenceState out = outputs.get(0);
                req.using("ID unchanged", in.getEvidenceID().equals(out.getEvidenceID()));
                req.using("Hash unchanged", in.getHash().equals(out.getHash()));
                req.using("Timestamp unchanged", in.getTimestamp() == out.getTimestamp());
                req.using("Owner changed", !in.getOwner().equals(out.getOwner()));
                req.using("History grew", out.getCustodyHistory().size() > in.getCustodyHistory().size());
                return null;
            });
        } else {
            throw new IllegalArgumentException("Unknown command");
        }
    }

    public interface Commands extends CommandData {
        class Issue implements Commands {}
        class Transfer implements Commands {}
    }
}
