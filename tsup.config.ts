import { defineConfig } from "tsup";

export default defineConfig({
    format: ["cjs", "esm"],
    entry: ["./src/index.ts"],
    dts: true,
    sourcemap: true,
    clean: true,
    shims: true,
    skipNodeModulesBundle: true,
    treeshake: true,
})