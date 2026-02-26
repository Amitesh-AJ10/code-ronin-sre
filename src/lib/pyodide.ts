import type { PyodideInterface } from 'pyodide';

class PyodideManager {
    private static instance: PyodideManager;
    private pyodide: PyodideInterface | null = null;
    private initPromise: Promise<void> | null = null;

    private constructor() { }

    public static getInstance(): PyodideManager {
        if (!PyodideManager.instance) {
            PyodideManager.instance = new PyodideManager();
        }
        return PyodideManager.instance;
    }

    public async init(): Promise<void> {
        if (this.pyodide) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                if (typeof (window as any).loadPyodide !== 'function') {
                    console.log("Loading Pyodide script dynamically...");
                    await new Promise<void>((resolve, reject) => {
                        const script = document.createElement('script');
                        // Correct URL format: https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js
                        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
                        script.onload = () => resolve();
                        script.onerror = () => reject(new Error("Failed to load Pyodide script from CDN"));
                        document.body.appendChild(script);
                    });
                }

                // @ts-ignore
                const pyodideInstance = await (window as any).loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
                });

                await pyodideInstance.loadPackage(['pandas']);

                this.pyodide = pyodideInstance;
                console.log("Pyodide Ready");
            } catch (error) {
                console.error("Failed to load Pyodide:", error);
                this.initPromise = null; // Allow retry
                throw error;
            }
        })();

        return this.initPromise;
    }

    public async runCode(code: string, stdin: string = ""): Promise<{ output: string; error: string | null }> {
        if (!this.pyodide) {
            await this.init();
        }

        try {
            // Set up stdin as a global variable first, then use it in Python
            this.pyodide!.globals.set("__stdin_input__", stdin);

            // Capture stdout/stderr and set stdin from the JS variable
            this.pyodide!.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
sys.stdin = io.StringIO(__stdin_input__)
`);

            // Wrap the user code so __name__ == "__main__" works
            const wrappedCode = `
__name__ = "__main__"
${code}
`;
            await this.pyodide!.runPythonAsync(wrappedCode);

            const stdout = this.pyodide!.runPython("sys.stdout.getvalue()");
            const stderr = this.pyodide!.runPython("sys.stderr.getvalue()");

            return { output: stdout + (stderr ? "\nError:\n" + stderr : ""), error: null };
        } catch (err: any) {
            return { output: "", error: err.message };
        }
    }

    public isReady(): boolean {
        return this.pyodide !== null;
    }
}

export const pyodideManager = PyodideManager.getInstance();
