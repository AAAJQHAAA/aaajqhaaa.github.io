import { execSync } from 'child_process'
import { readdirSync, cpSync, rmSync, existsSync } from 'fs'
import { resolve, join } from 'path'

const REPO_ROOT = resolve(import.meta.dirname, '..', '..')
const DIST_DIR = resolve(import.meta.dirname, '..', 'docs', '.vuepress', 'dist')
const WORKTREE_DIR = resolve(REPO_ROOT, '.deploy-main')
const BRANCH = 'main'
const REMOTE = 'origin'

function log(msg) {
  console.log(`\x1b[36m[deploy]\x1b[0m ${msg}`)
}

function error(msg) {
  console.error(`\x1b[31m[deploy]\x1b[0m ${msg}`)
  process.exit(1)
}

function exec(cmd, cwd = REPO_ROOT) {
  log(`> ${cmd}`)
  return execSync(cmd, { cwd, stdio: 'inherit' })
}

log('开始部署 dist 到 main 分支...')

if (!existsSync(DIST_DIR)) {
  error(`dist 目录不存在: ${DIST_DIR}，请先运行构建`)
}

log('清理旧的 worktree...')
try {
  execSync(`git worktree prune`, { cwd: REPO_ROOT, stdio: 'pipe' })
} catch {}
if (existsSync(WORKTREE_DIR)) {
  try {
    execSync(`git worktree remove "${WORKTREE_DIR}" --force`, { cwd: REPO_ROOT, stdio: 'pipe' })
  } catch {}
  rmSync(WORKTREE_DIR, { recursive: true, force: true })
}
try {
  execSync(`git worktree prune`, { cwd: REPO_ROOT, stdio: 'pipe' })
} catch {}

log('创建 worktree 到 main 分支...')
try {
  exec(`git worktree add "${WORKTREE_DIR}" ${BRANCH}`)
} catch (e) {
  error(`创建 worktree 失败: ${e.message}`)
}

log('清空 worktree 并复制 dist 文件...')
execSync('git clean -fdx', { cwd: WORKTREE_DIR, stdio: 'pipe' })
cpSync(DIST_DIR, WORKTREE_DIR, { recursive: true, force: true })

log('提交并推送到远程...')
exec(`git add -A`, WORKTREE_DIR)
try {
  exec(`git commit -m "deploy: update site (auto)"`, WORKTREE_DIR)
} catch {
  log('没有变更需要提交,跳过 commit')
}
exec(`git push ${REMOTE} ${BRANCH}`, WORKTREE_DIR)

log('清理 worktree...')
exec(`git worktree remove "${WORKTREE_DIR}" --force`)

log('\x1b[32m部署完成！\x1b[0m')
