import { exec } from "child_process";
import path from "path";

function runScript(scriptName: string): Promise<void> {
  const scriptPath = path.join(__dirname, "..", "src", "scripts", scriptName);

  return new Promise((resolve, reject) => {
    exec(`ts-node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to run ${scriptName}: ${stderr}`);
        return reject(error);
      }
      console.log(`✅ ${scriptName} output:\n${stdout}`);
      resolve();
    });
  });
}

export default async () => {
  try {
    await runScript("init-db.ts");
    await runScript("generateKeys.ts");
    console.log("✅ All setup scripts executed successfully");
  } catch (err) {
    console.error("❌ Error during global setup", err);
    process.exit(1);
  }
};
