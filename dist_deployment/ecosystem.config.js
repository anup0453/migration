module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/index.js',
      cwd: __dirname,
      env: {
        PORT: process.env.PORT || '8080',
        ENV: 'production',
      },
      mode: 'cluster',
    },
  ],
}
