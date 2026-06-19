import { readFileSync } from 'node:fs';
import { GitHubClient } from '../../github-mcp-server/dist/github-client.js';

function loadToken() {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  const mcpConfigPath = 'C:/Users/luist/.cursor/mcp.json';
  const config = JSON.parse(readFileSync(mcpConfigPath, 'utf8'));
  const token = config?.mcpServers?.github?.env?.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN not found in environment or MCP config');
  }
  return token;
}

const github = new GitHubClient({
  token: loadToken(),
  apiUrl: 'https://api.github.com',
});

let repo;
try {
  repo = await github.getRepository('LTapia03', 'KinConnect');
  console.log(
    JSON.stringify(
      {
        message: 'Repository already exists',
        name: repo.full_name,
        url: repo.html_url,
        clone_url: repo.clone_url,
      },
      null,
      2,
    ),
  );
} catch {
  repo = await github.createRepository('KinConnect', {
    description:
      'Von Rosenberg family reunion registration platform — Next.js, Supabase, shared packages.',
    private: false,
    autoInit: false,
  });
  console.log(
    JSON.stringify(
      {
        message: 'Repository created',
        name: repo.full_name,
        url: repo.html_url,
        clone_url: repo.clone_url,
      },
      null,
      2,
    ),
  );
}
