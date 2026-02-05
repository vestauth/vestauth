[![vestauth](https://vestauth.com/better-banner.png)](https://vestauth.com)

*auth for agents*–from the creator of [`dotenvx`](https://github.com/dotenvx/dotenvx).

* identity (cryptographic)
* authentication
* verification

&nbsp;

### Quickstart [![npm version](https://img.shields.io/npm/v/vestauth.svg)](https://www.npmjs.com/package/vestauth) [![downloads](https://img.shields.io/npm/dw/vestauth)](https://www.npmjs.com/package/vestauth)

```sh
npm i -g vestauth
```

```sh
vestauth agent init
```

&nbsp;

or install globally - *unlocks vestauth for any agent, agent tool, or agent framework!*

<details><summary>with curl 🌐 </summary><br>
> ```sh
> curl -sfS https://vestauth.sh | sh
> vestauth help
> ```
>
> [![curl installs](https://img.shields.io/endpoint?url=https://vestauth.sh/stats/curl&label=curl%20installs)](https://github.com/vestauth/vestauth.sh/blob/main/install.sh)

&nbsp;

</details>

<details><summary>with github releases 🐙</summary><br>
> ```sh
> curl -L -o vestauth.tar.gz "https://github.com/vestauth/vestauth/releases/latest/download/vestauth-$(uname -s)-$(uname -m).tar.gz"
> tar -xzf vestauth.tar.gz
> ./vestauth help
> ```
>
> [![github releases](https://img.shields.io/github/downloads/vestauth/vestauth/total)](https://github.com/vestauth/vestauth/releases)

&nbsp;

</details>

<details><summary>or windows 🪟</summary><br>

</details>

&nbsp;

## Identity

> Give your agent its cryptographic identity. 

```sh
$ mkdir your-agent
$ cd your-agent

$ vestauth agent init
✔ agent created (.env/AGENT_ID=agent-4b94ccd425e939fac5016b6b)
```

<details><summary>learn more</summary><br>

</details>

&nbsp;

## Authentication

> Turn any curl request into a signed, authenticated request.

```sh
> without vestauth
$ curl https://api.vestauth.com/whoami
{"error":{"status":400,"code":null,"message":"bad_request","help":null,"meta":null}}

> with vestauth
$ vestauth agent curl https://api.vestauth.com/whoami
{"uid":"agent-4b94ccd425e939fac5016b6b",...}
```

<details><summary>learn more</summary><br>

</details>

&nbsp;

## Verification 

> As a provider of agentic tools, authenticate agents through cryptographic verification.

```js
// index.js
const express = require('express')
const vestauth = require('vestauth')
const app = express()

// vestauth agent curl http://localhost:3000/whoami
app.get('/whoami', async (req, res) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const agent = await vestauth.provider.verify(req.method, fullUrl, req.headers)
    res.json(agent)
  } catch (err) {
    res.status(401).json({ error: { message: err.message }})
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
{"success":true}
```

## Advanced

> Become a `vestauth` power user.
>

### CLI 📟

Advanced CLI commands.

<details><summary>`primitives keypair`</summary><br>

</details>
<details><summary>`primitives headers`</summary><br>

</details>
<details><summary>`primitives verify`</summary><br>

</details>

## FAQ

<details><summary>What problem does Vestauth solve?</summary><br>
> Vestauth gives agents a cryptographic identity and a simple way to authenticate HTTP requests.
>
> Most agent systems rely on API keys, bearer tokens, or username/passwords. These approaches are difficult to rotate, easy to leak, and hard to attribute to a specific agent.
>
> Vestauth replaces shared secrets with public/private key cryptography. Agents sign requests using a private key, and providers verify those requests using the agent’s public key.

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

<details><summary>Do I need to run a Vestauth server?</summary><br>
> No.
>
> Vestauth is primarily a client-side and verification library. Agents generate keys locally and sign requests directly. Providers verify requests using public keys exposed via .well-known discovery endpoints.
>
> There is no central authentication server required.

&nbsp;

</details>

<details><summary>Is Vestauth replacing OAuth or API keys?</summary><br>
> Vestauth is complementary.
>
> OAuth and API keys authenticate applications or users. Vestauth authenticates agents and tools at the cryptographic level.
>
> Many systems use Vestauth alongside existing auth mechanisms. For example, Vestauth can verify an agent's identity before issuing short-lived API tokens.

&nbsp;

</details>

<details><summary>Where are agent keys stored?</summary><br>
> Agent keys are generated locally and stored in the agent's environment configuration.
>
> * `AGENT_PRIVATE_JWK` is used to sign requests and must never be shared.
> * `AGENT_PUBLIC_JWK` is safe to publish and is used by providers for verification.
>
> Vestauth automatically exposes public keys through a discovery endpoint.

&nbsp;

</details>

<details><summary>Can someone impersonate my agent?</summary><br>
> No, unless they obtain your private key.
>
> Vestauth relies on asymmetric cryptography. Only the holder of the private key can generate valid signatures. Providers verify those signatures using the corresponding public key.
>
> As long as your private key remains secure, your agent identity cannot be forged.

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

<details><summary>Is Vestauth production ready?</summary><br>
> Vestauth is built on established cryptographic and HTTP standards:
>
> * RFC 9421 HTTP Message Signatures
> * JOSE / JWK key formats
> * Web-Bot-Auth draft architecture
>
> These standards are designed for secure, verifiable HTTP communication.

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

<details><summary>Can Vestauth work without curl?</summary><br>
> Yes.
>
> Vestauth provides libraries and primitives that can be integrated into any HTTP client or framework. The CLI simply makes it easy to adopt and demonstrate.

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

<details><summary>Why not just use API keys?</summary><br>
> API keys are shared secrets. Anyone who obtains the key can impersonate the client, and keys are difficult to rotate safely.
>
> Vestauth uses cryptographic signing instead of shared secrets. This allows providers to verify identity without storing or distributing sensitive credentials.

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

&nbsp;

</details>

## Contributing

You can fork this repo and create [pull requests](https://github.com/vestauth/vestauth/pulls) or if you have questions or feedback:

* [github.com/vestauth/vestauth](https://github.com/vestauth/vestauth/issues) - bugs and discussions
* [@vestauth 𝕏](https://x.com/vestauthx) (DMs are open)
