module.exports = {
  apps: [
    {
      name: 'risivo-website',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 8787',
      cwd: '/home/user/risivo-website',
      env: {
        NODE_ENV: 'development',
        PORT: 8787
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
