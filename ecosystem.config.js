module.exports = {
  apps : [{
    name: 'step_chat',
    script: 'npm run serve',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }]
}