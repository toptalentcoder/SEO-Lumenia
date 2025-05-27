module.exports = {
    apps: [
      {
        name: 'server',
        script: 'npm',
        args: 'run start:server',
        env: {
          NODE_OPTIONS: '--max-old-space-size=4096 --max-semi-space-size=64',
        },
        autorestart: true,
        max_restarts: 5,
        restart_delay: 5000,
        max_memory_restart: '3G',
        node_args: '--optimize-for-size',
        exp_backoff_restart_delay: 100,
        watch: false,
        merge_logs: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        error_file: 'logs/server-error.log',
        out_file: 'logs/server-out.log',
        time: true,
        kill_timeout: 3000,
        wait_ready: false,
        listen_timeout: 10000
      },
      {
        name: 'client',
        script: 'npm',
        args: 'run start:client',
        autorestart: true,
      },
    ],
  };
  