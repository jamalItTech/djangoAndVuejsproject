const fs = require('fs-extra');
const path = require('path');
const translate = require('@vitalets/google-translate-api');

const projectRoot = path.resolve(__dirname, '../');
const nodeModulesDir = path.join(projectRoot, 'node_modules'); // Path to node_modules directory

async function translateText(text, targetLang) {
  try {
    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

async function translateFile(filePath, targetLang) {
  try {
    const extname = path.extname(filePath).toLowerCase();
    if (['.txt', '.md', '.html', '.xml', '.js', '.css'].includes(extname)) {
      const content = await fs.readFile(filePath, 'utf8');
      const translated = await translateText(content, targetLang);
      await fs.writeFile(filePath, translated, 'utf8');
      console.log(`Translated file saved: ${filePath}`);
    } else {
      console.log(`Skipping file (not supported): ${filePath}`);
    }
  } catch (error) {
    console.error(`Error translating file ${filePath}:`, error);
  }
}

async function translateFiles(dirPath, targetLang) {
  try {
    const files = await fs.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules') {
          await translateFiles(filePath, targetLang); // Recursive call for subdirectories
        }
      } else {
        await translateFile(filePath, targetLang);
      }
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Start translating files
translateFiles(nodeModulesDir, 'ar'); // Translating to Arabic
