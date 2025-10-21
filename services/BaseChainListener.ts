import { createPublicClient, webSocket, type Block, type PublicClient } from "viem";
import chains from "../config/chains";
import logger from "../utils/logger";

export default class BaseChainListener {
  chainId: string;
  ws: any;
  client: PublicClient;

  constructor(chainId: string, ws: any) {
    this.chainId = chainId;
    this.ws = ws;
    const chainConfig = chains[chainId];
    if (!chainConfig) throw new Error("Unsupported chainId");

    const {chain, wsURL} = chainConfig;
    this.client = createPublicClient({
      chain,
      transport: webSocket(wsURL),
    });
  }

  async startListener() {
    this.client.watchBlocks({
      onBlock: async (block: Block) => {
        // Fetch current gas price
        const gasPrice = await this.client.getGasPrice();
        const blockData = {
          blockNumber: (block.number ?? 0).toString(),
          baseFeePerGas: (block.baseFeePerGas ?? 0).toString(),
          gasUsed: (block.gasUsed ?? 0).toString(),
          gasLimit: (block.gasLimit ?? 0).toString(),
          gasPrice: gasPrice.toString(),
        };
        this.ws.send(JSON.stringify(blockData));
      },
      onError: (error: Error | any) => {
        logger.error(`Error in block listener for chainId ${this.chainId}: ${error.message}`);
        this.ws.send(JSON.stringify({ error: error.message }));
      },
    });
  }
}