import type { SmoldotWasmInstance } from './bindings.js';
export interface Config {
    instance?: SmoldotWasmInstance;
    /**
     * Fills the given buffer with randomly-generated bytes.
     */
    getRandomValues: (buffer: Uint8Array) => void;
    /**
     * Returns the number of milliseconds since an arbitrary epoch.
     */
    performanceNow: () => number;
    /**
     * List of environment variables to feed to the Rust program. An array of strings.
     * Example: `["RUST_BACKTRACE=1", "RUST_LOG=foo"];`
     *
     * Must never be modified after the bindings have been initialized.
     */
    envVars: string[];
    /**
     * Closure to call when the Wasm instance calls `proc_exit`.
     *
     * This callback will always be invoked from within a binding called the Wasm instance.
     */
    onProcExit: (retCode: number) => never;
}
declare const _default: (config: Config) => WebAssembly.ModuleImports;
export default _default;
