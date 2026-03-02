"use strict";

const evidenceTableBody = document.getElementById("evidence-table-body");
const verifyEvidenceIdInput = document.getElementById("verify-evidence-id");
const verifyPresentedHashInput = document.getElementById("verify-presented-hash");
const verifyStatus = document.getElementById("verify-status");
const detailsPanel = document.getElementById("details-panel");
const matchPill = document.getElementById("match-pill");
const refreshListButton = document.getElementById("btn-refresh-list");
const verifyButton = document.getElementById("btn-verify");
const fillFromSelectedButton = document.getElementById("btn-fill-from-selected");
const copyCommandButton = document.getElementById("btn-copy-command");
const uploaderCommandArea = document.getElementById("uploader-command");
const anchorStatus = document.getElementById("anchor-status");

let selectedEvidenceId = null;

function setStatus(element, variant, text) {
    element.classList.remove("ok", "warn", "error");
    if (variant) {
        element.classList.add(variant);
    }
    element.textContent = text;
}

function setMatchPill(state, text) {
    matchPill.className = "";
    if (state === "match") {
        matchPill.classList.add("pill-success");
    } else if (state === "mismatch") {
        matchPill.classList.add("pill-fail");
    } else {
        matchPill.classList.add("pill-idle");
    }
    matchPill.textContent = text;
}

async function fetchEvidenceList() {
    try {
        setStatus(anchorStatus, null, "Loading evidence from ledger...");
        const response = await fetch("/api/evidence");
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        const data = await response.json();
        renderEvidenceTable(data);
        if (data.length === 0) {
            setStatus(anchorStatus, "warn", "No evidence records yet. Run the Python uploader and anchor a case.");
        } else {
            setStatus(anchorStatus, "ok", "Loaded " + data.length + " evidence record(s) from Corda.");
        }
    } catch (e) {
        setStatus(anchorStatus, "error", "Failed to load evidence from ledger.");
    }
}

function renderEvidenceTable(list) {
    evidenceTableBody.innerHTML = "";
    list.forEach(item => {
        const tr = document.createElement("tr");
        tr.dataset.evidenceId = item.evidenceID;
        tr.addEventListener("click", () => {
            selectedEvidenceId = item.evidenceID;
            verifyEvidenceIdInput.value = item.evidenceID;
            verifyPresentedHashInput.value = item.hash;
            Array.from(evidenceTableBody.children).forEach(row => {
                row.style.backgroundColor = "";
            });
            tr.style.backgroundColor = "rgba(30,64,175,0.35)";
            loadDetails(item.evidenceID);
        });

        const idTd = document.createElement("td");
        idTd.textContent = item.evidenceID;
        const ownerTd = document.createElement("td");
        ownerTd.textContent = item.owner;
        const hashTd = document.createElement("td");
        hashTd.className = "hash-cell";
        hashTd.textContent = item.hash;
        const actionTd = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "Select";
        btn.className = "secondary";
        btn.type = "button";
        btn.addEventListener("click", e => {
            e.stopPropagation();
            selectedEvidenceId = item.evidenceID;
            verifyEvidenceIdInput.value = item.evidenceID;
            verifyPresentedHashInput.value = item.hash;
            Array.from(evidenceTableBody.children).forEach(row => {
                row.style.backgroundColor = "";
            });
            tr.style.backgroundColor = "rgba(30,64,175,0.35)";
            loadDetails(item.evidenceID);
        });
        actionTd.appendChild(btn);

        tr.appendChild(idTd);
        tr.appendChild(ownerTd);
        tr.appendChild(hashTd);
        tr.appendChild(actionTd);
        evidenceTableBody.appendChild(tr);
    });
}

async function loadDetails(evidenceId) {
    try {
        detailsPanel.textContent = "Loading details...";
        const response = await fetch("/api/evidence/" + encodeURIComponent(evidenceId));
        if (!response.ok) {
            detailsPanel.textContent = "Evidence not found.";
            setMatchPill("idle", "Idle");
            return;
        }
        const d = await response.json();
        const lines = [];
        lines.push("Evidence ID: " + d.evidenceID);
        lines.push("Owner: " + d.owner);
        lines.push("Original issuer: " + d.originalIssuer);
        lines.push("Anchored at (epoch): " + d.timestamp);
        lines.push("");
        lines.push("Chain of custody:");
        if (d.custodyHistory && d.custodyHistory.length > 0) {
            d.custodyHistory.forEach((c, idx) => {
                lines.push("  " + (idx + 1) + ". " + c);
            });
        } else {
            lines.push("  (none recorded)");
        }
        detailsPanel.textContent = lines.join("\n");
    } catch (e) {
        detailsPanel.textContent = "Failed to load details.";
        setMatchPill("idle", "Idle");
    }
}

async function verifyEvidence() {
    const evidenceId = verifyEvidenceIdInput.value.trim();
    const presentedHash = verifyPresentedHashInput.value.trim();
    if (!evidenceId || !presentedHash) {
        setStatus(verifyStatus, "warn", "Provide both Evidence ID and presented hash.");
        return;
    }
    try {
        setStatus(verifyStatus, null, "Verifying against ledger record...");
        setMatchPill("idle", "Checking...");
        const response = await fetch("/api/evidence/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ evidenceID: evidenceId, presentedHash })
        });
        if (!response.ok) {
            if (response.status === 404) {
                setStatus(verifyStatus, "error", "Evidence not found on ledger.");
            } else {
                setStatus(verifyStatus, "error", "Verification failed: HTTP " + response.status);
            }
            setMatchPill("idle", "Idle");
            return;
        }
        const result = await response.json();
        if (result.match) {
            setStatus(verifyStatus, "ok", "Match: presented hash equals the on-ledger hash.");
            setMatchPill("match", "Match");
        } else {
            setStatus(verifyStatus, "error", "Mismatch: presented hash differs from on-ledger hash.");
            setMatchPill("mismatch", "Mismatch");
        }
    } catch (e) {
        setStatus(verifyStatus, "error", "Verification failed.");
        setMatchPill("idle", "Idle");
    }
}

function fillFromSelected() {
    if (!selectedEvidenceId) {
        setStatus(verifyStatus, "warn", "Select an evidence row first.");
        return;
    }
    const row = Array.from(evidenceTableBody.children).find(r => r.dataset.evidenceId === selectedEvidenceId);
    if (!row) {
        return;
    }
    const hashCell = row.children[2];
    verifyEvidenceIdInput.value = selectedEvidenceId;
    verifyPresentedHashInput.value = hashCell.textContent;
}

function setupUploaderCommandCapture() {
    uploaderCommandArea.value = "flow start IssueEvidenceFlow evidenceID: \"EVID-...\", hash: \"...\", initialCustodyNotes: [\"Uploaded by Officer ...\"]";
}

async function copyCommandToClipboard() {
    const text = uploaderCommandArea.value.trim();
    if (!text) {
        setStatus(anchorStatus, "warn", "No command to copy yet. Run the uploader first.");
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
        setStatus(anchorStatus, "ok", "Flow command copied. Paste into PartyA shell.");
    } catch (e) {
        setStatus(anchorStatus, "warn", "Could not access clipboard. Copy manually.");
    }
}

refreshListButton.addEventListener("click", () => {
    fetchEvidenceList();
});

verifyButton.addEventListener("click", () => {
    verifyEvidence();
});

fillFromSelectedButton.addEventListener("click", () => {
    fillFromSelected();
});

copyCommandButton.addEventListener("click", () => {
    copyCommandToClipboard();
});

setupUploaderCommandCapture();
fetchEvidenceList();
