# Block Gas Tracker

## Overview

Block Gas Tracker is a Bun-based TypeScript server that streams real-time block and gas metrics for multiple EVM-compatible blockchains. Clients connect via WebSocket and can subscribe to one or more chains to receive block data and metrics. The project uses Winston for debug-level logging with log rotation.

---

## Features

- Real-time block and gas metrics for multiple EVM chains
- WebSocket API with multi-chain subscriptions per client
- Debug-level logging with Winston and log rotation (3 days)

---

## Setup

1. Install dependencies:
	 ```bash
	 bun install
	 ```
2. Set environment variables for each chain's WebSocket RPC URL (see below).
3. Start the server:
	 ```bash
	 bun run server.ts
	 ```

---

## Environment Variables

Set the following environment variables for RPC URLs (example names, see `config/chains.ts` for all):

- `WSS_MAINNET_URL`
- `WSS_BSC_URL`
- `WSS_ARBITRUM_URL`
- `WSS_BASE_URL`
- `WSS_AVALANCHE_URL`
- `WSS_SONIC_URL`
- `WSS_OPTIMISM_URL`
- `WSS_MANTLE_URL`
- `WSS_POLYGON_URL`
- `WSS_LINEA_URL`
- `SERVER_PORT` (optional, defaults to 8080)

---

## Logging

This project uses [Winston](https://github.com/winstonjs/winston) for logging. Logs are written to `logs/application-%DATE%.log` and rotated daily, retaining logs for 3 days. Console output is also enabled at debug level.

---

## WebSocket API

- **Endpoint:** `ws://localhost:8080`
- **How it works:**  
	Connect via WebSocket and send subscription/unsubscription messages for supported chains. The server streams block data for each subscribed chain.

### Message Format

**Client → Server:**

- Subscribe: `{ "action": "subscribe", "chainId": "1" }`
- Unsubscribe: `{ "action": "unsubscribe", "chainId": "1" }`

**Server → Client:**

- On each new block:
	```json
	{
		"blockNumber": "18456789",
		"baseFeePerGas": "1234567890",
		"gasUsed": "21000",
		"gasLimit": "30000000",
		"gasPrice": "1234567890"
	}
	```


### Example Usage

```js
const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => {
	ws.send(JSON.stringify({ action: "subscribe", chainId: "1" }));
	ws.send(JSON.stringify({ action: "subscribe", chainId: "137" })); // Polygon
};
ws.onmessage = (msg) => console.log(JSON.parse(msg.data));

// To unsubscribe:
ws.send(JSON.stringify({ action: "unsubscribe", chainId: "1" }));
```

---

## Supported Chains

See [`config/chains.ts`](config/chains.ts) for supported chain IDs and RPC URLs. Example:

| Chain Name   | Chain ID | Env Variable         |
|------------- |----------|---------------------|
| Ethereum     | 1        | WSS_MAINNET_URL     |
| BSC          | 56       | WSS_BSC_URL         |
| Arbitrum     | 42161    | WSS_ARBITRUM_URL    |
| Polygon      | 137      | WSS_POLYGON_URL     |
| ...          | ...      | ...                 |

---

## Dependencies

- [Bun](https://bun.sh/) (runtime)
- [TypeScript](https://www.typescriptlang.org/)
- [viem](https://viem.sh/) (EVM chain client)
- [Winston](https://github.com/winstonjs/winston) & [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file) (logging)

---

## License

MIT
