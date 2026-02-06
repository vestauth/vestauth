[![vestauth](https://vestauth.com/better-banner.png)](https://vestauth.com)

*auth for agents*–from the creator of [`dotenv`](https://github.com/motdotla/dotenv) and [`dotenvx`](https://github.com/dotenvx/dotenvx).

> [1 minute demo 📺](https://www.youtube.com/watch?v=cHARyULr_qk)
>
> Vestauth gives agents a cryptographic identity and a simple way to authenticate HTTP requests. Most agent systems rely on API keys, bearer tokens, or username/passwords. These approaches are difficult to rotate, easy to leak, and hard to attribute to a specific agent. Vestauth replaces shared secrets with public/private key cryptography. Agents sign requests using a private key, and providers verify those requests using the agent's public key. [[1](#compare)]
> 
> *Scott Motte–creator of `dotenv` and `dotenvx`*

&nbsp;

### Quickstart [![npm version](https://img.shields.io/npm/v/vestauth.svg)](https://www.npmjs.com/package/vestauth) [![downloads](https://img.shields.io/npm/dw/vestauth)](https://www.npmjs.com/package/vestauth) [![RFC 9421 Compatible](https://img.shields.io/badge/RFC%209421-Compatible-0A7F5A)](https://datatracker.ietf.org/doc/rfc9421/) [![Web-Bot-Auth Draft Compatible](https://img.shields.io/badge/Web--Bot--Auth-Draft%20Compatible-0A7F5A)](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture) 

```sh
npm i -g vestauth
```

```sh
vestauth agent init

vestauth agent curl https://api.vestauth.com/whoami
vestauth agent curl -X POST https://ping.vestauth.com
```

<details><summary>with curl 🌐 </summary><br>

```sh
curl -sfS https://vestauth.sh | sh
vestauth agent init
```

[![curl installs](https://img.shields.io/endpoint?url=https://vestauth.sh/stats/curl&label=curl%20installs)](https://github.com/vestauth/vestauth.sh/blob/main/install.sh)

&nbsp;

</details>

<details><summary>with github releases 🐙</summary><br>

```sh
curl -L -o vestauth.tar.gz "https://github.com/vestauth/vestauth/releases/latest/download/vestauth-$(uname -s)-$(uname -m).tar.gz"
tar -xzf vestauth.tar.gz
./vestauth agent init
```

[![github releases](https://img.shields.io/github/downloads/vestauth/vestauth/total)](https://github.com/vestauth/vestauth/releases)

&nbsp;

</details>

<details><summary>or windows 🪟</summary><br>

Download [the windows executable](https://github.com/vestauth/vestauth/releases) directly from the [releases page](https://github.com/vestauth/vestauth/releases).

> * [vestauth-windows-amd64.zip
](https://github.com/vestauth/releases/raw/main/latest/vestauth-windows-amd64.zip)
> * [vestauth-windows-x86_64.zip
](https://github.com/vestauth/releases/raw/main/latest/vestauth-windows-x86_64.zip)

(unzip to extract `vestauth.exe`)

</details>

&nbsp;

## Agent: Identity & Authentication

> Give agents cryptographic identities…

```sh
$ mkdir your-agent
$ cd your-agent

$ vestauth agent init
✔ agent created (.env/AGENT_ID=agent-4b94ccd425e939fac5016b6b)
```

> …and sign their `curl` requests with cryptographic authentication.

```sh
> SIGNED - 200
$ vestauth agent curl https://api.vestauth.com/whoami
{"uid":"agent-4b94ccd425e939fac5016b6b",...}

> UNSIGNED - 400
$ curl https://api.vestauth.com/whoami
{"error":{"status":400,"code":null,"message":"bad_request","help":null,"meta":null}}
```

<details><summary>learn more</summary><br>

First `vestauth agent init` populates a `.env` file with an `AGENT_PUBLIC_JWK`, `AGENT_PRIVATE_JWK`, and `AGENT_ID`.

```ini
# .env
AGENT_PUBLIC_JWK="{"crv":"Ed25519","x":"py2xNaAfjKZiau-jtmJls6h_3n8xJ1Ur0ie-n9b8zWg","kty":"OKP","kid":"B0u80Gw28W9U2Jl5t_EBiWeBajO2104kOYZ9Ikucl5I"}"
AGENT_PRIVATE_JWK="{"crv":"Ed25519","d":"Z9vbwN-3eiFMVv_TPWXOxqSMJAT21kZvejWi72yiAaQ","x":"py2xNaAfjKZiau-jtmJls6h_3n8xJ1Ur0ie-n9b8zWg","kty":"OKP","kid":"B0u80Gw28W9U2Jl5t_EBiWeBajO2104kOYZ9Ikucl5I"}"
AGENT_ID="agent-4b94ccd425e939fac5016b6b"
```

| Variable | Role | Usage |
|----------|------------|------------|
| `AGENT_PUBLIC_JWK` | Verification | Published for provider signature validation |
| `AGENT_PRIVATE_JWK` | Signing | Used locally to sign HTTP requests |
| `AGENT_ID` | Identity | Builds discovery FQDN and identifies the agent |

Then `vestauth agent curl` autosigns `curl` requests – injecting valid signed headers according to the [web-bot-auth draft](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture). You can peek these with the built-in `headers` primitive.

```sh
$ vestauth primitives headers GET https://api.vestauth.com/whoami --pp
{
  "Signature": "sig1=:d4Id5SXhUExsf1XyruD8eBmlDtWzt/vezoCS+SKf0M8CxSkhKBtdHH7KkYyMN6E0hmxmNHsYus11u32nhvpWBQ==:",
  "Signature-Input": "sig1=(\"@authority\");created=1770247189;keyid=\"B0u80Gw28W9U2Jl5t_EBiWeBajO2104kOYZ9Ikucl5I\";alg=\"ed25519\";expires=1770247489;nonce=\"NURxn28X7zyKJ9k5bHxuOyO5qdvF9L5s2qHmhTrGUzbwGSIoUCHmwSlwiiCRgTDGuum83yyWMHJU4jmrVI_XPg\";tag=\"web-bot-auth\"",
  "Signature-Agent": "sig1=agent-4b94ccd425e939fac5016b6b.agents.vestauth.com"
}
```

Vestauth turns `curl` into a powerful primitive for provider-side agent identity, verification, and authentication. See the next section.

</details>

&nbsp;

## Provider: Verification 

> Verify requests and safely trust agent identity using cryptographic proof.

```js
// index.js
const express = require('express')
const vestauth = require('vestauth')
const app = express()

// vestauth agent curl http://localhost:3000/whoami
app.get('/whoami', async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    // --------------------------------------------------------------------------------
    // 🪪 Reveal the agent's cryptographic identity.                                 //
    // The `provider.verify` method turns your endpoint into a cryptographically     //
    // authenticated provider — verifying signatures, keys, and returning the agent. //
    // --------------------------------------------------------------------------------
    const agent = await vestauth.provider.verify(req.method, url, req.headers)

    res.json(agent)
  } catch (err) {
    res.status(401).json({ code: 401, error: { message: err.message }})
  }
})

app.listen(3000, () => { console.log('listening on http://localhost:3000') })
```

```sh
$ npm install express vestauth --save
$ node index.js
listening on http://localhost:3000
```

```sh
$ vestauth agent curl http://localhost:3000/whoami
{"uid":"agent-4b94ccd425e939fac5016b6b",...}
```

<details><summary>learn more</summary><br>

```sh
Agent → Signs Request → Provider → Discovers Keys → Verifies Signature → Trusted Agent
```

Vestauth verifies requests using public key discovery and HTTP Message Signature validation.

When a signed request is received, Vestauth:

1. Extracts the agent identity from the `Signature-Agent` header.
2. Resolves the agent's discovery endpoint.
3. Fetches the agent's public keys from its `.well-known/http-message-signatures-directory`.
4. Verifies the request signature using RFC 9421.
5. Validates timestamps and nonce protections to prevent replay attacks.

If verification succeeds, the provider can safely trust the agent's cryptographic identity.

Vestauth intentionally separates identity discovery from verification to support key rotation and distributed agent infrastructure.

</details>

&nbsp;

## Advanced

> Become a `vestauth` power user.
>

### CLI 📟

Advanced CLI commands.

<details><summary>`agent init`</summary><br>

Create agent.

```sh
$ vestauth agent init
✔ agent created (.env/AGENT_ID=agent-609a4fd2ebf4e6347108c517)
⮕ next run: [vestauth agent curl https://api.vestauth.com/whoami]
```

</details>
<details><summary>`agent curl`</summary><br>

Run curl as agent.

```sh
$ vestauth agent curl https://api.vestauth.com/whoami
{"uid":"agent-609a4fd2ebf4e6347108c517", ...}
```

</details>
<details><summary>`agent curl --pretty-print`</summary><br>

Pretty print curl json output.

```sh
$ vestauth agent curl https://api.vestauth.com/whoami --pp
{
  "uid": "agent-609a4fd2ebf4e6347108c517",
  "kid": "FGzgs758DBGnI1S0BejChDsK0IKZm3qPpOOXdRnnBkM",
  "public_jwk": {
    ...
  },
  "well_known_url": "https://agent-609a4fd2ebf4e6347108c517.agents.vestauth.com/.well-known/http-message-signatures-directory"
}
```

</details>

<details><summary>`agent headers`</summary><br>

Generate signed headers as agent.

```sh
$ vestauth agent headers GET https://api.vestauth.com/whoami --pp
{
  "Signature": "sig1=:UW6A7j8jo+gQxd+EeVgDddY51ZOc9plrSaupW/N53hQnQFvP9BuwQHgL7SVPLQIu4cnRzLgvwm7Yu9YMO+HUDQ==:",
  "Signature-Input": "sig1=(\"@authority\");created=1770396357;keyid=\"FGzgs758DBGnI1S0BejChDsK0IKZm3qPpOOXdRnnBkM\";alg=\"ed25519\";expires=1770396657;nonce=\"PrE7A6I_5fWnxBsBigNvxjp3-YangXl71V1uM3hPZavh918JqzjMSRcjHv_n5XIb3N8WivZEeigCBH6QGDSqgA\";tag=\"web-bot-auth\"",
  "Signature-Agent": "sig1=agent-609a4fd2ebf4e6347108c517.agents.vestauth.com"
}
```

</details>

<details><summary>`agent headers --id`</summary><br>

Change the `AGENT_ID`.

```sh
$ vestauth agent headers GET https://api.vestauth.com/whoami --id agent-1234 --pp
{
  "Signature": "sig1=:UW6A7j8jo+gQxd+EeVgDddY51ZOc9plrSaupW/N53hQnQFvP9BuwQHgL7SVPLQIu4cnRzLgvwm7Yu9YMO+HUDQ==:",
  "Signature-Input": "sig1=(\"@authority\");created=1770396357;keyid=\"FGzgs758DBGnI1S0BejChDsK0IKZm3qPpOOXdRnnBkM\";alg=\"ed25519\";expires=1770396657;nonce=\"PrE7A6I_5fWnxBsBigNvxjp3-YangXl71V1uM3hPZavh918JqzjMSRcjHv_n5XIb3N8WivZEeigCBH6QGDSqgA\";tag=\"web-bot-auth\"",
  "Signature-Agent": "sig1=agent-1234.agents.vestauth.com"
}
```

</details>

<details><summary>`agent headers --private-jwk`</summary><br>

Change the `AGENT_PRIVATE_JWK` used to sign the headers.

```sh
$ vestauth agent headers GET https://api.vestauth.com/whoami --private-jwk '{"crv":"Ed25519","d":"RyFk7QTOk_bMjFQKjyAR-vJDp7BITn9U0YBFNdpR9wE","x":"hyAxNMbuTcFQq420Dr46ucF0dRZ_FIyxgsujruEoklM","kty":"OKP","kid":"UfHTArlyLsqM8cB8sNfH2z6XOwc0RmJIq2CAPGfvMjk"}' --pp
{
  "Signature": "sig1=:PZUVVjqiECYuk8Hg1GZKKeJmwhLrcRdRA7nm1R595UFK9cx0q9atNFBzKP5wBEmszMIgvpYdMrIQbPEeKz4tCQ==:",
  "Signature-Input": "sig1=(\"@authority\");created=1770396546;keyid=\"UfHTArlyLsqM8cB8sNfH2z6XOwc0RmJIq2CAPGfvMjk\";alg=\"ed25519\";expires=1770396846;nonce=\"BSIugautfZvN3u5QUgl1mMuyxgmeRsRy9XxX7GXxjJxq1mI0kJl4F-C1nITtOfSeEt6xR1YBfyxsffNKy_wKSA\";tag=\"web-bot-auth\"",
  "Signature-Agent": "sig1=agent-609a4fd2ebf4e6347108c517.agents.vestauth.com"
}
```

</details>

<details><summary>`provider verify`</summary><br>

Verify agent.

```sh
$ vestauth provider verify GET https://api.vestauth.com/whoami --signature "sig1=:H1kxwSRWFbIzKbHaUy4hQFp/JrmVTX//72JPHcW4W7cPt9q6LytRJgx5pUgWrrr7DCcMWgx/jpTPc8Ht8SZ3CQ==:" --signature-input "sig1=(\"@authority\");created=1770396709;keyid=\"FGzgs758DBGnI1S0BejChDsK0IKZm3qPpOOXdRnnBkM\";alg=\"ed25519\";expires=1770397009;nonce=\"BZSDVktdkjO6XH5jafAdPDttsB6eytXO7u8KXJN1tMtd5bprE3rp08HiaTRo7H6gZGtYb4_qtL7RiGi8P2Gq7w\";tag=\"web-bot-auth\"" --signature-agent "sig1=agent-609a4fd2ebf4e6347108c517.agents.vestauth.com"
{"uid":"agent-609a4fd2ebf4e6347108c517",...}
```

</details>

<details><summary>`primitives keypair`</summary><br>

Generate public/private keypair.

```sh
$ vestauth primitives keypair --pp
{
  "public_jwk": {
    "crv": "Ed25519",
    "x": "QjutZ3_tt2jRD_XSOq4EFCDivnwEzKIrQB2yReddsNo",
    "kty": "OKP",
    "kid": "ZCa5pijSUCw7QKgBs6nkvBBzbEjTMKYSt6iwCDQdIYc"
  },
  "private_jwk": {
    "crv": "Ed25519",
    "d": "RTyREuKAEfIMMs2ejwaKtFefZxt14HmsRR0rFj4U5iM",
    "x": "QjutZ3_tt2jRD_XSOq4EFCDivnwEzKIrQB2yReddsNo",
    "kty": "OKP",
    "kid": "ZCa5pijSUCw7QKgBs6nkvBBzbEjTMKYSt6iwCDQdIYc"
  }
}
```

</details>
<details><summary>`primitives headers`</summary><br>

Generate signed headers.

```sh
$ vestauth primitives headers GET http://example.com --pp
{
  "Signature": "sig1=:K7z3Nozcq1z5zfJhrd540DWYbjyQ1kR/S7ZDcMXE5gVhxezvG6Rn9BxEvfteiAnBuQhOkvbpGtF83WpQQerGBw==:",
  "Signature-Input": "sig1=(\"@authority\");created=1770263541;keyid=\"_4GFBGmXKinLBoh3-GJZCiLBt-84GP9Fb0iBzmYncUg\";alg=\"ed25519\";expires=1770263841;nonce=\"0eu7hVMVFm61lQvIryKNmZXIbzkkgpVocoKvN0de5QO8Eu5slTxklJAcVLQs0L_UTVtx4f8qJcqYZ21JTeOQww\";tag=\"web-bot-auth\"",
  "Signature-Agent": "sig1=agent-35e4a794a904d227ee2373b6.agents.vestauth.com"
}
```

</details>
<details><summary>`primitives verify`</summary><br>

Verify signed headers.

```sh
$ vestauth primitives verify GET https://api.vestauth.com/whoami --signature "sig1=:UHqXQbWZmyYW40JRcdCl+NLccLgPmcoirUKwLtdcpEcIgxG2+i+Q2U3yIYeMquseON3fKm29WSL2ntHeRefHBQ==:" --signature-input "sig1=(\"@authority\");created=1770395703;keyid=\"FGzgs758DBGnI1S0BejChDsK0IKZm3qPpOOXdRnnBkM\";alg=\"ed25519\";expires=1770396003;nonce=\"O8JOC1reBofwbpPcdD-MRRCdrtAf4khvJTuhpRI_RiaH_hpU93okLkmPZVFFcUEdYtYfcduaB8Sca54GTd2GXA\";tag=\"web-bot-auth\"" --signature-agent "sig1=agent-609a4fd2ebf4e6347108c517.agents.vestauth.com"
{"uid":"agent-609a4fd2ebf4e6347108c517", ...}
```

</details>

&nbsp;

## Compare

**Agent + Provider Matrix** – Compare Vestauth vs existing auth.

| Capability | Vestauth | API Keys | OAuth | Cookies |
|---|---|---|---|---|
| **Agent: no browser required** | ✅ | ✅ | ⚠️ (depends on flow) | ❌ |
| **Agent: easy to automate** | ✅ | ✅ | ⚠️ | ❌ |
| **Agent: no shared secret** | ✅ | ❌ | ⚠️ (bearer tokens) | ❌ |
| **Agent: per‑request identity proof** | ✅ | ❌ | ⚠️ (token‑based) | ❌ |
| **Agent: easy key/token rotation** | ✅ | ⚠️ | ⚠️ | ⚠️ |
| **Provider: no secret storage** | ✅ (public keys only) | ❌ | ❌ | ❌ |
| **Provider: strong attribution to agent** | ✅ | ⚠️ | ⚠️ | ❌ |
| **Provider: stateless verification** | ✅ | ✅ | ✅ | ❌ |
| **Provider: simple to implement** | ⚠️ (sig verification) | ✅ | ❌ | ✅ |
| **Provider: revocation control** | ✅ | ⚠️ | ✅ | ⚠️ |

Legend: ✅ strong fit, ⚠️ partial/conditional, ❌ poor fit

#### How It Works

1. An agent generates a public/private keypair.
2. The agent signs each HTTP request with its private key.
3. The provider verifies the signature using the agent’s public key.
4. Requests are attributable, auditable, and do not require shared secrets or browser sessions.

&nbsp;

## Standards

Vestauth builds on open internet standards for agent authentication.

| Specification | Purpose |
|------------|------------|
| **[RFC 9421 – HTTP Message Signatures](https://datatracker.ietf.org/doc/rfc9421/)** | Defines how requests are cryptographically signed and verified |
| **[Web-Bot-Auth Draft](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture)** | Defines headers and authentication architecture for autonomous agents |

Vestauth follows these specifications to ensure interoperability between agents and providers while avoiding vendor lock-in. Vestauth focuses on developer ergonomics while staying compliant with these emerging standards.

&nbsp;



## FAQ

<details><summary>What problem does Vestauth solve?</summary><br>

> Vestauth gives agents a cryptographic identity and a simple way to authenticate HTTP requests.
>
> Most agent systems rely on API keys, bearer tokens, or username/passwords. These approaches are difficult to rotate, easy to leak, and hard to attribute to a specific agent.
>
> Vestauth replaces shared secrets with public/private key cryptography. Agents sign requests using a private key, and providers verify those requests using the agent's public key.

&nbsp;

</details>

<details><summary>Why not just use API keys?</summary><br>

> API keys are shared secrets. Anyone who obtains the key can impersonate the client, and keys are difficult to rotate safely.
>
> Vestauth uses cryptographic signing instead of shared secrets. This allows providers to verify identity without storing or distributing sensitive credentials.

&nbsp;

</details>

<details><summary>Where are agent keys stored?</summary><br>

> Agent keys are generated locally and stored in the agent's environment configuration (`.env`).
>
> * `AGENT_PRIVATE_JWK` is used to sign requests and must never be shared.
> * `AGENT_PUBLIC_JWK` is safe to publish and is used by providers for verification.

&nbsp;

</details>

<details><summary>Is Vestauth only for AI agents?</summary><br>

> No.
>
> Vestauth can authenticate any automated system including:
>
> * developer tools
> * CLIs
> * automation services
> * bots
> * infrastructure tools

&nbsp;

</details>

<details><summary>Can Vestauth work without curl?</summary><br>

> Yes.
>
> Vestauth provides libraries and primitives that can be integrated into any HTTP client or framework. The CLI simply makes it easy to adopt and demonstrate.

&nbsp;

</details>

<details><summary>Do I need to run a Vestauth server?</summary><br>

> No.
>
> Vestauth is primarily a client-side and verification library. Agents generate keys locally and sign requests directly. Providers verify requests using public keys exposed via .well-known discovery endpoints.
>
> There is no central authentication server required.

&nbsp;

</details>

<details><summary>Why does Vestauth use Ed25519 keys?</summary><br>

> Ed25519 provides:
>
> * Strong modern cryptographic security
> * Fast signing and verification
> * Small key sizes
> * Wide ecosystem support

&nbsp;

</details>

<details><summary>How does Vestauth authentication work?</summary><br>

> Vestauth uses HTTP Message Signatures ([RFC 9421](https://datatracker.ietf.org/doc/rfc9421/)). Each request is signed using the agent's private key. The request includes signed headers such as:
>
> * Signature
> * Signature-Input
> * Signature-Agent
>
> Providers verify the request by retrieving the agent's public key from a discovery endpoint and verifying the signature cryptographically.
>
> If the signature is valid, the provider knows the request was created by the agent that owns that private key.

&nbsp;

</details>

<details><summary>How does Vestauth prevent replay attacks?</summary><br>

> Vestauth prevents replay attacks using multiple mechanisms built into HTTP Message Signatures.
>
> Each signed request includes:
>
> * created timestamp - limits how old a signature can be
> * expires timestamp - defines a short validity window
> * nonce value - ensures each request is unique
>
> Providers verify that:
>
> 1. The signature is still within the allowed time window
> 2. The nonce has not been used before
> 3. The signature cryptographically matches the request
>
> Because signatures are short-lived and tied to unique nonce values, an intercepted request cannot be reused successfully.
>
> Providers may optionally store nonce values for additional replay protection.

&nbsp;

</details>

<details><summary>Why does Vestauth use public key discovery?</summary><br>

> Public key discovery allows providers to verify agent signatures without manual key exchange. Each agent hosts its public keys in a standardized .well-known directory.
>
> This enables dynamic agent onboarding while preserving cryptographic verification.

&nbsp;

</details>

<details><summary>Does Vestauth send secrets over the network?</summary><br>

> No.
>
> Vestauth signs requests using private keys locally. Only public keys are shared for verification.

&nbsp;

</details>

<details><summary>How does Vestauth avoid SSRF during public key discovery?</summary><br>

> Vestauth prevents Server-Side Request Forgery (SSRF) by restricting public key discovery to trusted domains.
>
> By default, Vestauth only resolves agent discovery endpoints inside the controlled namespace:
>
> ```ini
> *.agents.vestauth.com
> ```
>
> When a provider verifies a request, Vestauth converts the agent identity into a fixed .well-known endpoint within this trusted domain. Because this domain is controlled by Vestauth, providers never fetch attacker-supplied URLs or internal network addresses.
>
> This removes the most common SSRF attack vector during signature verification.
>
> **Custom trusted discovery domains**
>
> Providers can optionally configure additional trusted discovery domains using:
>
> ```ini
> PROVIDER_FQDN_REGEX
> ```
>
> This allows organizations to:
>
> * Host their own agent discovery infrastructure
> * Support private internal agents
> * Implement federated trust models
>
> For example:
>
> ```ini
> PROVIDER_FQDN_REGEX=".*\.agents\.vestauth\.com|.*\.agents\.example\.internal"
> ```
>
> Only discovery endpoints matching this allowlist will be fetched.
>
> **Defense in depth**
>
> Even with domain scoping, providers may optionally add safeguards such as:
>
> * HTTPS-only enforcement
> * Request timeouts
> * Response size limits
> * Public key caching
>
> Vestauth removes SSRF by design, while still allowing controlled federation when needed.

&nbsp;

</details>

<details><summary>Why does Vestauth use .well-known discovery instead of embedding public keys directly?</summary><br>

> Vestauth uses .well-known discovery to keep requests small, enable key rotation, and support long-term identity management.
>
> Embedding public keys directly in every request would increase header size, reduce caching opportunities, and make key rotation difficult. By publishing keys through a discovery endpoint, Vestauth allows providers to fetch and cache keys independently from individual requests.
>
> This approach provides several benefits:
>
> **Efficient requests**
>
> Public keys are retrieved once and can be cached by providers. Agents do not need to send large key material with every request.
>
> **Key rotation support**
>
> Agents can rotate signing keys without changing their identity. Providers simply refresh keys from the discovery endpoint.
>
> **Multi-key support**
>
> Agents can safely publish multiple active keys (for rotation or staged rollouts) using the standard HTTP Message Signatures directory format.
>
> **Standards alignment**
>
> Vestauth follows the discovery model used in:
>
> * HTTP Message Signatures directories
> * OAuth / OpenID Connect key discovery
> * Web identity federation systems

</details>

&nbsp;

## Contributing

You can fork this repo and create [pull requests](https://github.com/vestauth/vestauth/pulls) or if you have questions or feedback:

* [github.com/vestauth/vestauth](https://github.com/vestauth/vestauth/issues) - bugs and discussions
* [@vestauth 𝕏](https://x.com/vestauthx) (DMs are open)
