import { spawn } from 'child_process'
import { rmSync } from 'fs'
import path from 'path'
import treeKill from 'tree-kill'
function start_app() {
  const app_spawn = spawn('set NODE_PATH=app&&node app', { shell: true })
  app_spawn.stdout.on('data', data => process.stdout.write(data))
  app_spawn.stderr.on('data', data => process.stdout.write(data))
  return app_spawn
}
try {
  rmSync(
    path.resolve('.', 'app'),
    { recursive: true, force: true }
  )
} catch (e) { }
const babel = spawn('babel src --watch --out-dir app --extensions \".ts\"', { shell: true })
babel.stdout.once('data', data => {
  console.log(
    `\n[${new Date().toLocaleString()}]`,
    data.toString()
  )
  let run_app_spawn = start_app()
  babel.stdout.on('data', data => {
    console.log(
      `\n[${new Date().toLocaleString()}]`,
      data.toString()
    )
    treeKill(run_app_spawn.pid, error => {
      if (!error)
        run_app_spawn = start_app()
    })
  })
})