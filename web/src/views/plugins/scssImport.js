const fs = require('fs')
const path = require('path')

module.exports = () => {
  // احصل على كل البرنامج المساعدscssالملف والتسجيل
  const pluginsScssPath = []
  let components = []
  // اجتياز @great-dream/ الملف في الدليل
  const greatDreamDir = path.resolve('./node_modules/@great-dream')
  if (fs.existsSync(greatDreamDir)) {
    const greatDreamFiles = fs.readdirSync(greatDreamDir)
    greatDreamFiles.forEach(file => {
      const scssPath = path.join(greatDreamDir, file, 'src', 'index.scss')
      if (fs.existsSync(scssPath)) {
        components.push(file)
      }
    })
  }

  // اجتياز ./src/views/plugins الملف في الدليل
  const pluginsDir = path.resolve('./src/views/plugins')
  if (fs.existsSync(pluginsDir)) {
    const pluginFiles = fs.readdirSync(pluginsDir)
    pluginFiles.forEach(file => {
      const scssPath = path.join(pluginsDir, file, 'src', 'index.scss')
      if (fs.existsSync(scssPath)) {
        components.push(file)
      }
    })
  }
  components = Array.from(new Set(components))
  components.filter(async (key, index) => {
    const pluginDirectories = ['./src/views/plugins/', './node_modules/@great-dream/']
    // const pluginDirectories = ['./node_modules/@great-dream/']
    pluginDirectories.forEach(directory => {
      const scssPath = directory + key + '/src/index.scss'
      if (fs.existsSync(scssPath)) {
        pluginsScssPath.push('"' + scssPath.replace('./src/views/plugins/', '~@/views/plugins/').replace('./node_modules/@great-dream/', '~@great-dream/') + '"')
        console.log(`[${key}] scssسجل بنجاح`)
        return true
      }
      return false
    })
  })
  return pluginsScssPath
}
