import {
  arbitrum,
  avalanche,
  base,
  bsc,
  linea,
  mainnet,
  mantle,
  optimism,
  polygon,
  sonic,
  type Chain,
} from "viem/chains";

const chains = {
  "1": {
    chain: mainnet,
    wsURL: process.env.WSS_MAINNET_URL,
  },
  "10": {
    chain: optimism,
    wsURL: process.env.WSS_OPTIMISM_URL,
  },
  "56": {
    chain: bsc,
    wsURL: process.env.WSS_BSC_URL,
  },
  "137": {
    chain: polygon,
    wsURL: process.env.WSS_POLYGON_URL,
  },
  "146": {
    chain: sonic,
    wsURL: process.env.WSS_SONIC_URL,
  },
  "42161": {
    chain: arbitrum,
    wsURL: process.env.WSS_ARBITRUM_URL,
  },
  "43114": {
    chain: avalanche,
    wsURL: process.env.WSS_AVALANCHE_URL,
  },
  "5000": {
    chain: mantle,
    wsURL: process.env.WSS_MANTLE_URL,
  },
  "8453": {
    chain: base,
    wsURL: process.env.WSS_BASE_URL,
  },
  "59144": {
    chain: linea,
    wsURL: process.env.WSS_LINEA_URL,
  },
};

export default chains as {
  [key: string]:
    | {
        chain: Chain;
        wsURL: string;
      }
    | undefined;
};
