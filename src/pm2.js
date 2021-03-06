
const fs = require('fs')
const path = require('path')
const pidusage = require('pidusage')

class PM2Monitoring {
  constructor() {
    this.pm2_monitoring = { cpu: 0, mem: 0 }
    this.pm2_agent_monitoring = { cpu: 0, mem: 0 }
  }

  startCollection() {
    setInterval(() => {
      this.monitorPM2Agent()
      this.monitorPM2()
    }, 900)
  }

  report() {
    return {
      pm2: this.pm2_monitoring,
      agent: this.pm2_agent_monitoring
    }
  }

  monitorPM2() {
    let pm2_pid_file = path.join(process.env.HOME, '.pm2', 'pm2.pid')

    fs.readFile(pm2_pid_file, (err, pm2_pid) => {
      if (err) return console.error(`Could not read ${pm2_pid_file}`)
      if (!pm2_pid) return console.error(`PID is null`)

      pm2_pid = parseInt(pm2_pid)

      pidusage(pm2_pid, (err, stats) => {
        if (err) return console.error(err)
        this.pm2_monitoring = {
          cpu: stats.cpu.toFixed(1),
          mem: (stats.memory / 1024 / 1024).toFixed(1)
        }
      })
    })
  }

  monitorPM2Agent() {
    let pm2_agent_pid_file = path.join(process.env.HOME, '.pm2', 'agent.pid')

    fs.readFile(pm2_agent_pid_file, (err, pm2_agent_pid) => {
      if (err) return
      if (!pm2_agent_pid) return

      pidusage(pm2_agent_pid, (err, stats) => {
        if (err) return
        this.pm2_agent_monitoring = {
          cpu: stats.cpu.toFixed(1),
          mem: (stats.memory / 1024 / 1024).toFixed(1)
        }
      })
    })
  }

}

module.exports = PM2Monitoring
