/**
 * Configuration for {@link startLocalInstance}.
 */
export interface Config {
    forbidTcp: boolean;
    forbidWs: boolean;
    forbidNonLocalWs: boolean;
    forbidWss: boolean;
    forbidWebRtc: boolean;
    /**
     * Maximum level of the logs that are generated.
     */
    maxLogLevel: number;
    /**
     * Number between 0.0 and 1.0 indicating how much of the CPU time the instance is allowed to
     * consume.
     */
    cpuRateLimit: number;
    /**
     * Environment variables that the instance can pull.
     */
    envVars: string[];
    /**
     * Returns the number of milliseconds since an arbitrary epoch.
     */
    performanceNow: () => number;
    /**
     * Fills the given buffer with randomly-generated bytes.
     */
    getRandomValues: (buffer: Uint8Array) => void;
}
export type Event = {
    ty: "add-chain-result";
    success: true;
    chainId: number;
} | {
    ty: "add-chain-result";
    success: false;
    error: string;
} | {
    ty: "log";
    level: number;
    target: string;
    message: string;
} | {
    ty: "json-rpc-responses-non-empty";
    chainId: number;
} | {
    ty: "current-task";
    taskName: string | null;
} | {
    ty: "wasm-panic";
    message: string;
} | {
    ty: "executor-shutdown";
} | {
    ty: "new-connection";
    connectionId: number;
    address: ParsedMultiaddr;
} | {
    ty: "connection-reset";
    connectionId: number;
} | {
    ty: "connection-stream-open";
    connectionId: number;
} | {
    ty: "connection-stream-reset";
    connectionId: number;
    streamId: number;
} | {
    ty: "stream-send";
    connectionId: number;
    streamId?: number;
    data: Uint8Array;
} | {
    ty: "stream-send-close";
    connectionId: number;
    streamId?: number;
};
export type ParsedMultiaddr = {
    ty: "tcp";
    hostname: string;
    port: number;
} | {
    ty: "websocket";
    url: string;
} | {
    ty: "webrtc";
    targetPort: string;
    ipVersion: string;
    targetIp: string;
    remoteCertMultibase: string;
};
export interface Instance {
    request: (request: string, chainId: number) => number;
    peekJsonRpcResponse: (chainId: number) => string | null;
    addChain: (chainSpec: string, databaseContent: string, potentialRelayChains: number[], disableJsonRpc: boolean) => void;
    removeChain: (chainId: number) => void;
    /**
     * Notifies the background executor that it should stop. Once it has effectively stopped,
     * a `shutdown-finished` event will be generated.
     * Note that the instance can technically still be used, and all the functions still work, but
     * in practice nothing is being run in the background and as such it won't do much.
     * Existing connections are *not* closed. It is the responsibility of the API user to close
     * all connections.
     */
    shutdownExecutor: () => void;
    connectionOpened: (connectionId: number, info: {
        type: 'single-stream';
        handshake: 'multistream-select-noise-yamux';
        initialWritableBytes: number;
        writeClosable: boolean;
    } | {
        type: 'multi-stream';
        handshake: 'webrtc';
        localTlsCertificateMultihash: Uint8Array;
        remoteTlsCertificateMultihash: Uint8Array;
    }) => void;
    connectionReset: (connectionId: number, message: string) => void;
    streamWritableBytes: (connectionId: number, numExtra: number, streamId?: number) => void;
    streamMessage: (connectionId: number, message: Uint8Array, streamId?: number) => void;
    streamOpened: (connectionId: number, streamId: number, direction: 'inbound' | 'outbound', initialWritableBytes: number) => void;
    streamReset: (connectionId: number, streamId: number) => void;
}
/**
 * Starts a new instance using the given configuration.
 *
 * Even though this function doesn't do anything asynchronous, it needs to be asynchronous due to
 * the fact that `WebAssembly.instantiate` is for some reason asynchronous.
 *
 * After this function returns, the execution of CPU-heavy tasks of smoldot will happen
 * asynchronously in the background.
 *
 * This instance is low-level in the sense that invalid input can lead to crashes and that input
 * isn't sanitized. In other words, you know what you're doing.
 */
export declare function startLocalInstance(config: Config, wasmModule: WebAssembly.Module, eventCallback: (event: Event) => void): Promise<Instance>;
export declare function parseMultiaddr(address: string, forbidTcp: boolean, forbidWs: boolean, forbidNonLocalWs: boolean, forbidWss: boolean, forbidWebRtc: boolean): {
    success: true;
    address: ParsedMultiaddr;
} | {
    success: false;
    error: string;
};
