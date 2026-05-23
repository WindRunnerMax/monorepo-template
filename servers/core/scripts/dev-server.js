import { spawn } from "child_process";
import path from "path";

let currentProcess = null;

function killProcess() {
  if (!currentProcess) return Promise.resolve();

  return new Promise(resolve => {
    const child = currentProcess;
    child.once("exit", () => {
      currentProcess === child && (currentProcess = null);
      resolve();
    });
    child.kill("SIGTERM");
  });
}

export default function nodeDevServer(options = {}) {
  const { entryFileName } = options;

  return {
    name: "node-dev-server",

    async writeBundle(outputOptions) {
      if (!this.meta?.watchMode) {
        return void 0;
      }

      if (!entryFileName) {
        this.warn("[node-dev-server] miss entryFileName");
        return void 0;
      }

      const outputFile = path.resolve(outputOptions.dir, entryFileName);

      if (currentProcess) {
        console.log("[node-dev-server] stop old process...");
        await killProcess();
      }

      console.log(`[node-dev-server] start process: ${outputFile}`);
      const child = spawn("node", [outputFile], {
        stdio: "inherit",
        env: process.env,
      });

      child.on("exit", (code, signal) => {
        console.log(`[node-dev-server] process exit, exit code: ${code}, signal: ${signal}`);
        currentProcess === child && (currentProcess = null);
      });

      currentProcess = child;
    },

    closeWatcher() {
      killProcess();
    },
  };
}
