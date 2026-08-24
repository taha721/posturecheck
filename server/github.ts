import { ReplitConnectors } from "@replit/connectors-sdk";

const connectors = new ReplitConnectors();

async function githubRequest(path: string, options: RequestInit = {}) {
  const response = await connectors.proxy("github", path, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${text}`);
  }
  return response.json();
}

export async function getAuthenticatedUser() {
  return githubRequest("/user");
}

export async function createRepo(name: string, description: string, isPrivate: boolean) {
  return githubRequest("/user/repos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: false,
    }),
  });
}

export async function getOrCreateRepo(owner: string, name: string, description: string, isPrivate: boolean) {
  try {
    return await githubRequest(`/repos/${owner}/${name}`);
  } catch {
    return createRepo(name, description, isPrivate);
  }
}

export async function upsertFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string
) {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString("base64"),
  };
  if (sha) body.sha = sha;

  return githubRequest(`/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function getFileSha(owner: string, repo: string, path: string): Promise<string | undefined> {
  try {
    const data = await githubRequest(`/repos/${owner}/${repo}/contents/${path}`);
    return data.sha;
  } catch {
    return undefined;
  }
}
