module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/dashboard/' : '/',
  outputDir: '../../docs'
};
