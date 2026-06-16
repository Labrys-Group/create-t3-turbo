# Testing External Contracts & Third-Party Services

When our code depends on something we don't control — an external smart contract, a third-party API, or a critical infrastructure service — the boundary is where bugs hide. The other side can change, behave unexpectedly, or differ from our assumptions. These standards make those boundaries the most-tested part of the codebase, not the least.

## Policy

**Unit test every external contract interaction.** Any time our code reads from or writes to a smart contract we did not author (an ERC-20, a DEX router, a lending pool, an oracle, a staking vault, etc.), there must be unit tests proving *our* logic against it works as intended. Coverage of our own logic at the integration boundary is mandatory, not optional.

The goal is not to test the external contract — its authors did that. The goal is to test **our** assumptions about it: the call shapes we send, the return values we decode, the edge cases we branch on, and the failure modes we handle. A passing build with no tests at the boundary is treated as untested.

**Critical third-party services must be integration tested.** Anything our product cannot function without — a payment processor, an auth provider, a custody/RPC provider, a price feed — needs integration tests that exercise the real contract or a faithful stand-in, not just mocks. Mocks verify our code calls the dependency correctly; integration tests verify our assumptions about the dependency are actually correct.

## Reviewer / Agent Checklist

Before approving any change that touches an external contract or critical third-party service, confirm:

- [ ] **Unit tests exist** that exercise *our* logic against the external contract.
- [ ] Tests cover the **success path** and the **failure/revert paths** we branch on.
- [ ] Tests cover **edge cases** in decoding return values (e.g. non-standard ERC-20s that return no boolean, fee-on-transfer tokens, rebasing balances).
- [ ] Critical third-party services have **integration tests**, not mocks alone.
- [ ] Tests run **deterministically** (pinned block / fork, no live network flakiness — see below).

If any box is unchecked for code that crosses an external boundary, the change is not done.

## Use Hardhat Forks for External Contracts

When our logic depends on external contracts, **fork mainnet (or the relevant network)** rather than redeploying or mocking the dependency. Forking lets tests refer to the real deployed contracts and lets us fast-forward time to test time-dependent behaviour (vesting, unlock windows, reward accrual, interest, epochs).

### Why forks over mocks

- **Real behaviour.** The forked contract behaves exactly as the deployed one — no drift between our mock and reality.
- **Fast-forward time.** `evm_increaseTime` / `evm_mine` (or `time.increase` via the Hardhat network helpers) let us advance the chain to test maturity, cooldowns, and accrual without waiting.
- **Pinned and deterministic.** Pinning to a block hash makes runs reproducible and cacheable, removing live-network flakiness.

### Setup

Pin a block number so the fork is deterministic:

```ts
// hardhat.config.ts
import type { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL!,
        blockNumber: 21_000_000, // pin for deterministic, cacheable runs
      },
    },
  },
};

export default config;
```

### Patterns

```ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("our integration with USDC", () => {
  it("decodes balances from the real token", async () => {
    const usdc = await ethers.getContractAt("IERC20", USDC);
    // assert OUR logic against the real contract's return shape
    const balance = await usdc.balanceOf(SOME_WHALE);
    expect(balance).to.be.gt(0);
  });

  it("respects the vesting unlock after fast-forwarding", async () => {
    // ... set up our contract that depends on an external vesting schedule
    await time.increase(30 * 24 * 60 * 60); // fast-forward 30 days
    // assert OUR logic now permits the action the external schedule unlocked
  });
});
```

### Impersonation

To test flows that require an external account (a whale, a contract owner, a multisig), impersonate it on the fork:

```ts
import { impersonateAccount, setBalance } from "@nomicfoundation/hardhat-network-helpers";

await impersonateAccount(WHALE);
await setBalance(WHALE, ethers.parseEther("10")); // gas
const whale = await ethers.getSigner(WHALE);
// now call our contract as the external actor
```

## Mocks vs. Forks vs. Integration — When to Use Which

| Approach            | Use when                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| **Mock**            | Isolating a single unit; the dependency's behaviour is not under test.   |
| **Hardhat fork**    | Our logic depends on real external contract behaviour or time.           |
| **Integration test**| The third-party service is critical and we must verify our assumptions.  |

Mocks alone are never sufficient at a critical external boundary — they only prove we call the dependency the way *we think* it behaves. A fork or integration test proves that belief is correct.
