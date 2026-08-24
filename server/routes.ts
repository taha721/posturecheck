import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { getAuthenticatedUser, getOrCreateRepo, upsertFile, getFileSha } from "./github";

const IGNORED = new Set([
  "node_modules", ".git", "dist", ".cache", ".upm",
  "attached_assets", ".local", "package-lock.json",
]);

function collectFiles(dir: string, base: string = dir): { path: string; content: string }[] {
  const results: { path: string; content: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, base));
    } else {
      try {
        const content = fs.readFileSync(full, "utf-8");
        results.push({ path: rel, content });
      } catch {
        // skip binary files
      }
    }
  }
  return results;
}

export async function registerRoutes(app: Express): Promise<Server> {

  app.get("/api/github/user", async (req, res) => {
    try {
      const user = await getAuthenticatedUser();
      res.json({ login: user.login, avatarUrl: user.avatar_url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/github/export", async (req, res) => {
    const { repoName, description, isPrivate } = req.body as {
      repoName: string;
      description: string;
      isPrivate: boolean;
    };

    if (!repoName) {
      return res.status(400).json({ error: "repoName is required" });
    }

    try {
      const user = await getAuthenticatedUser();
      const owner = user.login;

      const repo = await getOrCreateRepo(owner, repoName, description || "PostureCheck - posture analysis app", isPrivate ?? false);

      const files = collectFiles(process.cwd());

      let pushed = 0;
      const errors: string[] = [];

      for (const file of files) {
        try {
          const sha = await getFileSha(owner, repoName, file.path);
          await upsertFile(owner, repoName, file.path, file.content, `Add ${file.path}`, sha);
          pushed++;
        } catch (err: any) {
          errors.push(`${file.path}: ${err.message}`);
        }
      }

      res.json({
        repoUrl: repo.html_url,
        filesPushed: pushed,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
