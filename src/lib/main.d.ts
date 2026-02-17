export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | (string & {})

export type HeaderValue = string | string[]
export type HeaderBag = Record<string, HeaderValue | undefined>

/** Minimal JWK shape used by Vestauth (Ed25519 OKP). */
export interface OkpEd25519PublicJwk {
  kty: 'OKP'
  crv: 'Ed25519'
  x: string
  kid?: string
}

/** Minimal private JWK shape used by Vestauth (Ed25519 OKP). */
export interface OkpEd25519PrivateJwk extends OkpEd25519PublicJwk {
  d: string
}

export type PublicJwk = OkpEd25519PublicJwk & Record<string, unknown>
export type PrivateJwk = OkpEd25519PrivateJwk & Record<string, unknown>

export interface Keypair {
  publicJwk: PublicJwk
  privateJwk: PrivateJwk
}

export interface SignatureHeaders {
  Signature: string
  'Signature-Input': string
  'Signature-Agent': string
}

export interface VerifyResult {
  uid?: string
  kid?: string
  public_jwk?: PublicJwk
  well_known_url?: string
}

export interface AgentApi {
  /**
   * Creates (or reuses) an Ed25519 keypair, registers the agent, and writes to `.env`.
   */
  init(): Promise<{
    AGENT_PUBLIC_JWK: PublicJwk
    AGENT_UID: string
    path: string
    isNew: boolean
  }>

  /**
   * Generates RFC 9421 request signature headers.
   *
   * When `uid` / `privateJwk` are omitted, Vestauth reads them from `.env`.
   */
  headers(
    httpMethod: HttpMethod,
    uri: string,
    uid?: string | null,
    privateJwk?: string | null,
    tag?: string,
    nonce?: string | null
  ): Promise<SignatureHeaders>

  /**
   * Rotates the agent keypair and writes the new keys to `.env`.
   */
  rotate(
    uid: string,
    privateJwk: string,
    tag?: string,
    nonce?: string | null
  ): Promise<{
    AGENT_PUBLIC_JWK: PublicJwk
    AGENT_UID: string
    path: string
  }>
}

export interface ProviderApi {
  /**
   * Verifies a signed request (fetching the agent's discovery keys when needed).
   */
  verify(httpMethod: HttpMethod, uri: string, headers?: HeaderBag): Promise<VerifyResult>
}

export interface PrimitivesApi {
  /**
   * Creates an Ed25519 keypair. If `existingPrivateJwk` is provided, it is reused.
   */
  keypair(existingPrivateJwk?: string, prefix?: string): Keypair

  /**
   * Generates RFC 9421 request signature headers.
   */
  headers(
    httpMethod: HttpMethod,
    uri: string,
    uid: string,
    privateJwk: string,
    tag?: string,
    nonce?: string | null
  ): Promise<SignatureHeaders>

  /**
   * Verifies a signed request.
   *
   * When `publicJwk` is not provided, Vestauth will attempt to resolve it via
   * `Signature-Agent` discovery.
   */
  verify(
    httpMethod: HttpMethod,
    uri: string,
    headers?: HeaderBag,
    publicJwk?: PublicJwk
  ): Promise<VerifyResult>
}

export const agent: AgentApi
export const provider: ProviderApi
export const primitives: PrimitivesApi

declare const _default: {
  agent: AgentApi
  provider: ProviderApi
  primitives: PrimitivesApi
}

export default _default
