module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ['@nutui/babel-plugin-separate-import', {
      style: 'css'
    }],
    ['import', {
      'libraryName': 'vant',
      'libraryDirectory': 'es',
      'style': true
    }]
  ]
}
