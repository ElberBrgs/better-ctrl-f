// Valida o manifest.json: JSON parseável e campos obrigatórios do MV3.
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));

const erros = [];
if (manifest.manifest_version !== 3) erros.push("manifest_version deve ser 3");
if (!manifest.name) erros.push("name ausente");
if (!manifest.version || !/^\d+\.\d+\.\d+$/.test(manifest.version))
  erros.push("version deve seguir semver (x.y.z)");
if (!manifest.description) erros.push("description ausente");

const scripts = manifest.content_scripts?.flatMap((cs) => cs.js ?? []) ?? [];
for (const js of scripts) {
  try {
    readFileSync(js);
  } catch {
    erros.push(`content script não encontrado: ${js}`);
  }
}

for (const [label, icon] of [
  ...(Object.entries(manifest.icons ?? {})),
  ...(Object.entries(manifest.action?.default_icon ?? {})),
]) {
  try {
    readFileSync(icon);
  } catch {
    erros.push(`ícone não encontrado: ${icon} (${label})`);
  }
}

if (erros.length) {
  console.error(erros.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ manifest.json válido — ${manifest.name} v${manifest.version}`);
