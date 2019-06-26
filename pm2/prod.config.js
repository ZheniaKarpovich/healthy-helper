module.exports = {
  apps: [
    {
      name: 'medical-helper',
      script: './app/index.js',
      env: {
        'NODE_ENV': 'production',
      },
      instances: 0,
      'exec_mode': 'cluster',
      'log_date_format': 'YYYY-MM-DD HH:mm:ss Z',
      'log_file': './.log/prod/combined.log',
      'out_file': './.log/prod/out.log',
      'error_file': './.log/prod/err.log',
    },
  ],
};
