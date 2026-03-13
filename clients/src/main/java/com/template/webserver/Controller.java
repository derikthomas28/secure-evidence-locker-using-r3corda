package com.template.webserver;

import com.template.states.EvidenceState;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.node.services.Vault;
import net.corda.core.transactions.SignedTransaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.template.flows.IssueEvidenceFlow;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*") // Enable CORS for the frontend
@RequestMapping("/")
public class Controller {
    private final CordaRPCOps proxy;
    private final static Logger logger = LoggerFactory.getLogger(Controller.class);

    public Controller(NodeRPCConnection rpc) {
        this.proxy = rpc.proxy;
    }

    @GetMapping(value = "/api/evidence", produces = "application/json")
    public List<EvidenceSummary> listEvidence() {
        Vault.Page<EvidenceState> page = proxy.vaultQuery(EvidenceState.class);
        return page.getStates().stream()
                .map(StateAndRef::getState)
                .map(s -> s.getData())
                .map(EvidenceSummary::fromState)
                .collect(Collectors.toList());
    }

    @GetMapping(value = "/api/evidence/{id}", produces = "application/json")
    public ResponseEntity<EvidenceDetails> getEvidenceById(@PathVariable("id") String id) {
        Vault.Page<EvidenceState> page = proxy.vaultQuery(EvidenceState.class);
        return page.getStates().stream()
                .map(StateAndRef::getState)
                .map(s -> s.getData())
                .filter(state -> state.getEvidenceID().equals(id))
                .findFirst()
                .map(state -> new ResponseEntity<>(EvidenceDetails.fromState(state), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping(value = "/api/evidence/verify", consumes = "application/json", produces = "application/json")
    public ResponseEntity<VerificationResult> verifyEvidence(@RequestBody VerificationRequest request) {
        Vault.Page<EvidenceState> page = proxy.vaultQuery(EvidenceState.class);
        EvidenceState state = page.getStates().stream()
                .map(StateAndRef::getState)
                .map(s -> s.getData())
                .filter(e -> e.getEvidenceID().equals(request.getEvidenceID()))
                .findFirst()
                .orElse(null);

        if (state == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        String storedHash = state.getHash();
        String presented = request.getPresentedHash();
        boolean match = storedHash != null && presented != null && storedHash.equalsIgnoreCase(presented.trim());

        VerificationResult result = new VerificationResult(
                state.getEvidenceID(),
                storedHash,
                presented,
                match,
                Instant.ofEpochSecond(state.getTimestamp()).toString(),
                state.getOwner().getName().toString());

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping(value = "/api/evidence/issue", consumes = "application/json", produces = "text/plain")
    public ResponseEntity<String> issueEvidence(@RequestBody IssueEvidenceRequest request) {
        try {
            // Using startTrackedFlow to wait for the flow to complete
            SignedTransaction stx = proxy.startTrackedFlowDynamic(
                    IssueEvidenceFlow.class,
                    request.getEvidenceID(),
                    request.getHash(),
                    Collections.singletonList(request.getCustodyNote())).getReturnValue().get();

            return new ResponseEntity<>("Evidence Issued. Tx: " + stx.getId(), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static class EvidenceSummary {
        private String evidenceID;
        private String hash;
        private String owner;

        public EvidenceSummary(String evidenceID, String hash, String owner) {
            this.evidenceID = evidenceID;
            this.hash = hash;
            this.owner = owner;
        }

        public static EvidenceSummary fromState(EvidenceState state) {
            return new EvidenceSummary(
                    state.getEvidenceID(),
                    state.getHash(),
                    state.getOwner().getName().toString());
        }

        public String getEvidenceID() {
            return evidenceID;
        }

        public String getHash() {
            return hash;
        }

        public String getOwner() {
            return owner;
        }
    }

    public static class EvidenceDetails {
        private String evidenceID;
        private String hash;
        private String owner;
        private String originalIssuer;
        private long timestamp;
        private List<String> custodyHistory;

        public EvidenceDetails(String evidenceID, String hash, String owner, String originalIssuer, long timestamp,
                List<String> custodyHistory) {
            this.evidenceID = evidenceID;
            this.hash = hash;
            this.owner = owner;
            this.originalIssuer = originalIssuer;
            this.timestamp = timestamp;
            this.custodyHistory = custodyHistory;
        }

        public static EvidenceDetails fromState(EvidenceState state) {
            return new EvidenceDetails(
                    state.getEvidenceID(),
                    state.getHash(),
                    state.getOwner().getName().toString(),
                    state.getOriginalIssuer().getName().toString(),
                    state.getTimestamp(),
                    state.getCustodyHistory());
        }

        public String getEvidenceID() {
            return evidenceID;
        }

        public String getHash() {
            return hash;
        }

        public String getOwner() {
            return owner;
        }

        public String getOriginalIssuer() {
            return originalIssuer;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public List<String> getCustodyHistory() {
            return custodyHistory;
        }
    }

    public static class VerificationRequest {
        private String evidenceID;
        private String presentedHash;

        public String getEvidenceID() {
            return evidenceID;
        }

        public void setEvidenceID(String evidenceID) {
            this.evidenceID = evidenceID;
        }

        public String getPresentedHash() {
            return presentedHash;
        }

        public void setPresentedHash(String presentedHash) {
            this.presentedHash = presentedHash;
        }
    }

    public static class VerificationResult {
        private String evidenceID;
        private String storedHash;
        private String presentedHash;
        private boolean match;
        private String anchoredAt;
        private String owner;

        public VerificationResult(String evidenceID, String storedHash, String presentedHash, boolean match,
                String anchoredAt, String owner) {
            this.evidenceID = evidenceID;
            this.storedHash = storedHash;
            this.presentedHash = presentedHash;
            this.match = match;
            this.anchoredAt = anchoredAt;
            this.owner = owner;
        }

        public String getEvidenceID() {
            return evidenceID;
        }

        public String getStoredHash() {
            return storedHash;
        }

        public String getPresentedHash() {
            return presentedHash;
        }

        public boolean isMatch() {
            return match;
        }

        public String getAnchoredAt() {
            return anchoredAt;
        }

        public String getOwner() {
            return owner;
        }
    }

    public static class IssueEvidenceRequest {
        private String evidenceID;
        private String hash;
        private String custodyNote;
        // Optional: add fields for AI report, but for now we just put it in notes or
        // ignore it on-chain to save space

        public String getEvidenceID() {
            return evidenceID;
        }

        public void setEvidenceID(String evidenceID) {
            this.evidenceID = evidenceID;
        }

        public String getHash() {
            return hash;
        }

        public void setHash(String hash) {
            this.hash = hash;
        }

        public String getCustodyNote() {
            return custodyNote;
        }

        public void setCustodyNote(String custodyNote) {
            this.custodyNote = custodyNote;
        }
    }
}
