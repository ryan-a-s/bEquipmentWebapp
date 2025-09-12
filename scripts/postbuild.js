// scripts/postbuild.js
import { copyFileSync, writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "out");

//Create 404.html fallback (SPA)
try {
  copyFileSync(join(outDir, "index.html"), join(outDir, "404.html"));
  console.log("✅ 404.html created as SPA fallback");
} catch (err) {
  console.error("❌ Could not create 404.html:", err);
}

//Disable Jekyll
try {
  writeFileSync(join(outDir, ".nojekyll"), "");
  console.log("✅ .nojekyll created");
} catch (err) {
  console.error("❌ Could not create .nojekyll:", err);
}