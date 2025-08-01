import { createRuntime } from "./runtime.js";

createRuntime()
    .then((runtime) => {
        console.log("Worker initialized!");
        onmessage = async (event) => {
            const { action, index, args } = event.data;
            try {
                const result = runtime[action](...args);
                postMessage({ action: "success", index, result });
            } catch (error) {
                console.error("Worker operation failed:", error);
                postMessage({ action: "failure", index, error: error.message });
            }
        };
        postMessage({ action: "initialized" });
    })
    .catch((error) => {
        console.error("Worker initialization failed:", error);
        postMessage({ action: "failure", index: -1, error: error.message });
    });
