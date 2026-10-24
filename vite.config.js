import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const [repositoryOwner, repositoryName] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserOrOrganizationPage = repositoryName === `${repositoryOwner}.github.io`;
const base = process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserOrOrganizationPage
  ? `/${repositoryName}/`
  : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
