// Configure environment variables similar to Next.js
// This needs to be loaded first when running outside of Next.js (e.g., CI)
// https://nextjs.org/docs/app/guides/environment-variables#loading-environment-variables-with-nextenv
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);
