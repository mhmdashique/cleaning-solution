import bcrypt from "bcryptjs";
import { emitKeypressEvents } from "node:readline";
import { stdin, stdout } from "node:process";

function promptForPassword(): Promise<string> {
  if (!stdin.isTTY) {
    return Promise.reject(
      new Error("Run this command in an interactive terminal.")
    );
  }

  emitKeypressEvents(stdin);
  stdin.setRawMode(true);
  stdin.resume();
  stdout.write("Admin password: ");

  return new Promise((resolve, reject) => {
    let password = "";
    const cleanup = () => {
      stdin.off("keypress", onKeypress);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
    };
    const onKeypress = (
      input: string,
      key: { name?: string; ctrl?: boolean }
    ) => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Password entry cancelled."));
      } else if (key.name === "return" || key.name === "enter") {
        cleanup();
        resolve(password);
      } else if (key.name === "backspace") {
        password = password.slice(0, -1);
      } else if (input) {
        password += input;
      }
    };
    stdin.on("keypress", onKeypress);
  });
}

async function main() {
  const password = await promptForPassword();
  const bytes = Buffer.byteLength(password, "utf8");
  if (bytes === 0) {
    throw new Error("Password cannot be empty.");
  }
  if (bytes > 72) {
    throw new Error("bcrypt passwords must be 72 UTF-8 bytes or fewer.");
  }
  const hash = await bcrypt.hash(password, 12);
  stdout.write(`ADMIN_PASSWORD_HASH=${hash}\n`);
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Unable to hash password."
  );
  process.exitCode = 1;
});
