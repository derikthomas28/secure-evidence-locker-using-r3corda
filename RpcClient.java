import net.corda.client.rpc.CordaRPCClient;
import net.corda.core.messaging.CordaRPCOps;
import net.corda.core.utilities.NetworkHostAndPort;
import net.corda.core.utilities.loggerFor;
import org.slf4j.Logger;
import java.util.Collections;

public class RpcClient {

    private static final Logger logger = loggerFor(RpcClient.class);

    public static void main(String[] args) {
        if (args.length != 6) {
            logger.error("Usage: java RpcClient <host:port> <user> <pass> <evidenceID> <hash> <custodyNote>");
            System.exit(1);
        }

        NetworkHostAndPort rpcAddress = NetworkHostAndPort.parse(args[0]);
        String rpcUser = args[1];
        String rpcPass = args[2];
        String evidenceID = args[3];
        String hash = args[4];
        String custodyNote = args[5];

        try (CordaRPCClient rpcClient = new CordaRPCClient(rpcAddress)) {
            CordaRPCOps rpcOps = rpcClient.start(rpcUser, rpcPass).getProxy();

            logger.info("Starting IssueEvidenceFlow with params: ID={}, Hash={}, Note={}", evidenceID, hash, custodyNote);

            rpcOps.startFlowDynamic(
                    com.template.flows.IssueEvidenceFlow.class,
                    evidenceID,
                    hash,
                    Collections.singletonList(custodyNote)
            );

            logger.info("Flow started successfully");
            System.exit(0);
        } catch (Exception e) {
            logger.error("RPC error: {}", e.getMessage(), e);
            System.exit(1);
        }
    }
}
