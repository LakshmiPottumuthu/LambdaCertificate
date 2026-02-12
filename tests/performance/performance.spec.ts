import { test, expect } from "../../fixtures/appFixtures";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Reusable performance test runner that executes a k6 script with env overrides
 * and validates produced JSON output. Multiple scenarios can be handled in one spec.
 *
 * - Uses PerformancePage fixture to obtain base URL and optional credentials.
 * - Prefers local k6 binary; falls back to Docker image loadimpact/k6.
 */

const K6_SCRIPT = path.resolve(__dirname, "..", "..", "performance", "k6", "login_test.js");
const OUT_DIR = path.resolve(__dirname, "..", "..", "performance", "results");
const DEFAULT_TIMEOUT = 10 * 60 * 1000; // 10 minutes

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

/**
 * Run k6 with given environment overrides and write JSON to outName (under OUT_DIR).
 * Throws on non-zero exit.
 */
function runK6WithEnv(env: NodeJS.ProcessEnv, outName = "result.json") {
  ensureOutDir();
  const outJson = path.join(OUT_DIR, outName);

  // Commands
  const localCmd = `k6 run --out json=${outJson} "${K6_SCRIPT}"`;
  // Docker mounts the repo root into /scripts
  const repoRoot = process.cwd();
  const relOut = path.relative(repoRoot, outJson);
  const relScript = path.relative(repoRoot, K6_SCRIPT);
  const dockerCmd = `docker run --rm -v "${repoRoot}":/scripts -w /scripts loadimpact/k6 run --out json=/scripts/${relOut} /scripts/${relScript}`;

  // Choose executor
  let usedCmd = localCmd;
  try {
    execSync("command -v k6 >/dev/null 2>&1", { stdio: "ignore" });
  } catch {
    usedCmd = dockerCmd;
  }

  // Execute (will throw on failure)
  execSync(usedCmd, { stdio: "inherit", env, timeout: DEFAULT_TIMEOUT });

  // Validate file
  if (!fs.existsSync(outJson)) throw new Error(`k6 did not produce expected output: ${outJson}`);
  if (fs.statSync(outJson).size === 0) throw new Error(`k6 output is empty: ${outJson}`);

  return outJson;
}

test.describe("performance (k6) - reusable scenarios", () => {
  // Define reusable scenarios. Add/adjust entries as needed.
  const scenarios = [
    {
      name: "public-flow",
      out: "public_result.json",
      envOverrides: (performancePage: any) => ({
        BASE_URL: performancePage.baseUrl(),
        TEST_USER: "",
        TEST_PASS: "",
      }),
    },
    {
      name: "authenticated-flow",
      out: "auth_result.json",
      envOverrides: (performancePage: any) => ({
        BASE_URL: performancePage.baseUrl(),
        TEST_USER: performancePage.testUser(),
        TEST_PASS: performancePage.testPass(),
      }),
    },
  ];

  for (const s of scenarios) {
    test(s.name, async ({ performancePage }) => {
      const env = {
        ...process.env,
        ...s.envOverrides(performancePage),
      };

      const outJson = runK6WithEnv(env, s.out);

      // Basic assertions to ensure the run produced data
      expect(fs.existsSync(outJson)).toBeTruthy();
      expect(fs.statSync(outJson).size).toBeGreaterThan(0);

      // Optionally: load and assert top-level stats exist (lightweight sanity)
      try {
        const raw = fs.readFileSync(outJson, "utf8");
        const parsed = JSON.parse(raw);
        expect(parsed).toHaveProperty("metrics");
      } catch {
        // keep test failure meaningful if JSON is malformed
        throw new Error(`Failed to parse k6 JSON output: ${outJson}`);
      }
    });
  }
});
