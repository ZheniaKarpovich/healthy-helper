module.exports = {
  apps: [
    {
      name: 'medical-helper',
      script: './app/index.js',
      watch: [ 'app', 'node_modules', 'pm2' ],
      env: {
        'NODE_ENV': 'development',
      },
      interpreter: 'node@10.15.0',
      'node_args': [ '--inspect' ],
      'log_date_format': 'YYYY-MM-DD HH:mm:ss Z',
      'log_file': './.log/dev/combined.log',
      'out_file': './.log/dev/out.log',
      'error_file': './.log/dev/err.log',
    },
  ],
};
