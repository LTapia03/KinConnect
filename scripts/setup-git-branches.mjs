import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const git = 'C:\\Program Files\\Git\\bin\\git.exe';
const repoDir = 'C:/Dev/von-rosenberg-reunion';

const mainReadme = `# KinConnect

Von Rosenberg family reunion registration platform.

See feature branches for Phase 1 implementation:

- \`feat/SCRUM-6-monorepo-scaffold\`
- \`feat/SCRUM-8-supabase-schema\`

Epic: [SCRUM-5](https://luistapia03.atlassian.net/browse/SCRUM-5)
`;

function loadToken() {
  const config = JSON.parse(readFileSync('C:/Users/luist/.cursor/mcp.json', 'utf8'));
  return config?.mcpServers?.github?.env?.GITHUB_TOKEN;
}

function gitEnv() {
  return {
    ...process.env,
    GIT_AUTHOR_NAME: 'LTapia03',
    GIT_AUTHOR_EMAIL: 'luistapia03@gmail.com',
    GIT_COMMITTER_NAME: 'LTapia03',
    GIT_COMMITTER_EMAIL: 'luistapia03@gmail.com',
  };
}

function run(args) {
  const result = spawnSync(git, args, {
    cwd: repoDir,
    encoding: 'utf8',
    stdio: 'pipe',
    env: gitEnv(),
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')}\n${result.stderr || result.stdout}`);
  }
  return (result.stdout || '').trim();
}

function push(ref, token) {
  const result = spawnSync(
    git,
    ['-c', `http.extraHeader=Authorization: Bearer ${token}`, 'push', '-u', 'origin', ref],
    { cwd: repoDir, encoding: 'utf8', stdio: 'inherit', env: gitEnv() },
  );
  if (result.status !== 0) {
    throw new Error(`Failed to push ${ref}`);
  }
}

const token = loadToken();
if (!token) {
  throw new Error('GITHUB_TOKEN not found');
}

if (!existsSync(`${repoDir}/README.full.md`)) {
  copyFileSync(`${repoDir}/README.md`, `${repoDir}/README.full.md`);
}

run(['init', '-b', 'main']);
try {
  run(['remote', 'remove', 'origin']);
} catch {
  // first run
}
run(['remote', 'add', 'origin', 'https://github.com/LTapia03/KinConnect.git']);

writeFileSync(`${repoDir}/README.md`, mainReadme, 'utf8');
run(['checkout', '-B', 'main']);
run(['add', '.gitignore', 'README.md']);
run(['commit', '-m', 'chore(repo): add initial readme and gitignore\n\nRefs: SCRUM-5']);

copyFileSync(`${repoDir}/README.full.md`, `${repoDir}/README.md`);
run(['checkout', '-B', 'feat/SCRUM-6-monorepo-scaffold']);
run(['add', '.']);
run(['reset', 'HEAD', 'supabase']);
run(['commit', '-m', 'feat(monorepo): scaffold next.js web app and shared package\n\nRefs: SCRUM-6']);

run(['checkout', '-B', 'feat/SCRUM-8-supabase-schema']);
run(['add', 'supabase']);
run(['commit', '-m', 'feat(supabase): add schema, rls policies, and seed data\n\nRefs: SCRUM-8']);

push('main', token);
push('feat/SCRUM-6-monorepo-scaffold', token);
push('feat/SCRUM-8-supabase-schema', token);

console.log('Branches pushed: main, feat/SCRUM-6-monorepo-scaffold, feat/SCRUM-8-supabase-schema');
