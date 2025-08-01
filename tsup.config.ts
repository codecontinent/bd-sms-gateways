import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts", "lib/mod.ts", "lib/adapters/smsnetbd.ts"],
  format: ["esm", "cjs"],
  clean: true,
  dts: false,
  outDir: "dist",
  target: "es2022",
  splitting: false,
  shims: true,
  outExtension: ({ format }) => {
    if (format === "esm") {
      return { js: ".mjs" };
    }
    return { js: ".cjs" };
  },
});
