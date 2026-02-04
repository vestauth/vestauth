[![vestauth](https://vestauth.com/better-banner.png)](https://vestauth.com)

*auth for agents*–from the creator of [`dotenvx`](https://github.com/dotenvx/dotenvx).

* identity
* authentication
* verification

&nbsp;

### Quickstart [![npm version](https://img.shields.io/npm/v/vestauth.svg)](https://www.npmjs.com/package/vestauth) [![downloads](https://img.shields.io/npm/dw/vestauth)](https://www.npmjs.com/package/vestauth)

```sh
curl -sfS https://vestauth.sh | sh
```

```sh
vestauth agent init
vestauth agent curl https://api.vestauth.com/whoami
```

&nbsp;

or install as npm - *unlocks vestauth inside code!*

<details><summary>with npm 📦</summary><br>

```sh
npm install vestauth --save
```

&nbsp;

</details>

## Agent

> Initialize your agent and make authenticated curl calls to vestauth providers.

```sh
$ vestauth agent init
$ vestauth agent curl https://ping.vestauth.com/ping
```

More examples

*coming soon*

## Provider

> As a provider of agentic tools, authenticate agents through cryptographic verification.

```sh
$ vestauth provider verify GET https://ping.vestauth.com/ping
```

More examples

* Express.js
* Next.js
* Rails
* ...

### List of current providers

* `dotenvx as2` – agentic secret storage

## Advanced

> Become a `vestauth` power user.

## Methodology

* `vestauth` implements [RFC 9421 HTTP Message Signatures](https://datatracker.ietf.org/doc/rfc9421/)
* `vestauth` implements [Web-Bot-Auth](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture)

