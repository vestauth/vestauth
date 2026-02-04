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

```sh
curl -sfS https://vestauth.sh | sh
vestauth help
```

[![curl installs](https://img.shields.io/endpoint?url=https://vestauth.sh/stats/curl&label=curl%20installs)](https://github.com/vestauth/vestauth.sh/blob/main/install.sh)

&nbsp;

</details>

<details><summary>with github releases 🐙</summary><br>

```sh
curl -L -o vestauth.tar.gz "https://github.com/vestauth/vestauth/releases/latest/download/vestauth-$(uname -s)-$(uname -m).tar.gz"
tar -xzf vestauth.tar.gz
./vestauth help
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

## Identity

> Give your agent its cryptographic identity. 

```sh
$ mkdir your-agent
$ cd your-agent

$ vestauth agent init
✔ agent created (.env/AGENT_ID=agent-4b94ccd425e939fac5016b6b)
```

<details><summary>learn more</summary><br>

This populates a `.env` file with an `AGENT_PUBLIC_JWK`, `AGENT_PRIVATE_JWK`, and `AGENT_ID`.

```ini
# example
AGENT_PUBLIC_JWK="{"crv":"Ed25519","x":"py2xNaAfjKZiau-jtmJls6h_3n8xJ1Ur0ie-n9b8zWg","kty":"OKP","kid":"B0u80Gw28W9U2Jl5t_EBiWeBajO2104kOYZ9Ikucl5I"}"
AGENT_PRIVATE_JWK="{"crv":"Ed25519","d":"Z9vbwN-3eiFMVv_TPWXOxqSMJAT21kZvejWi72yiAaQ","x":"py2xNaAfjKZiau-jtmJls6h_3n8xJ1Ur0ie-n9b8zWg","kty":"OKP","kid":"B0u80Gw28W9U2Jl5t_EBiWeBajO2104kOYZ9Ikucl5I"}"
AGENT_ID="agent-4b94ccd425e939fac5016b6b"
```

* The `AGENT_PUBLIC_KEY` is auto-hosted to its own [`/.well-known/http-message-signatures-directory`](https://datatracker.ietf.org/doc/html/draft-meunier-http-message-signatures-directory-04#appendix-A) for discovery purposes.
* The `AGENT_PRIVATE_KEY` must NOT be shared and is used to sign requests according to [RFC 9421](https://datatracker.ietf.org/doc/rfc9421/).
* The `AGENT_ID` contributes to building the [FQDN for the `Signature-Agent` header](https://datatracker.ietf.org/doc/html/draft-meunier-http-message-signatures-directory-01#name-request-with-http-signature).

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

Vestauth autosigns each curl request – injecting valid signed headers according to the [web-bot-auth draft](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture). View these with the built-in `headers` primitive.

```
$ vestauth primitives headers GET https://api.vestauth.com/whoami --pp
{
  "Signature": "sig1=:d4Id5SXhUExsf1XyruD8eBmlDtWzt/vezoCS+SKf0M8CxSkhKBtdHH7KkYyMN6E0hmxmNHsYus11u32nhvpWBQ==:",
  "Signature-Input": "sig1=(\"@authority\");created=1770247189;keyid=\"B0u80Gw28W9U2Jl5t_EBiWeBajO2104kOYZ9Ikucl5I\";alg=\"ed25519\";expires=1770247489;nonce=\"NURxn28X7zyKJ9k5bHxuOyO5qdvF9L5s2qHmhTrGUzbwGSIoUCHmwSlwiiCRgTDGuum83yyWMHJU4jmrVI_XPg\";tag=\"web-bot-auth\"",
  "Signature-Agent": "sig1=agent-4b94ccd425e939fac5016b6b.agents.vestauth.com"
}
```

</details>

&nbsp;

## Verification 

> As a provider of agentic tools, authenticate agents through cryptographic verification.

```sh

```

## Advanced

> Become a `vestauth` power user.

## Methodology

* `vestauth` implements [RFC 9421 HTTP Message Signatures](https://datatracker.ietf.org/doc/rfc9421/)
* `vestauth` implements [Web-Bot-Auth](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture)

