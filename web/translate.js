const fs = require('fs-extra');
const translate = require('@vitalets/google-translate-api');
const path = require('path');

// تحديد مسار المجلد الذي يحتوي على ملفات الترجمة
const localesPath = path.join(__dirname, 'locales');

// دالة لترجمة النصوص
async function translateText(text) {
  try {
    const res = await translate(text, { from: 'zh-cn', to: 'ar' });
    return res.text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}

// دالة لمعالجة ملفات الترجمة
async function processFiles() {
  try {
    const files = await fs.readdir(localesPath);

    for (const file of files) {
      const filePath = path.join(localesPath, file);
      const fileContent = await fs.readFile(filePath, 'utf8');

      // تحويل النصوص من JSON إلى كائن
      const jsonContent = JSON.parse(fileContent);

      // ترجمة النصوص
      const translatedContent = await Promise.all(
        Object.keys(jsonContent).map(async (key) => {
          const text = jsonContent[key];
          const translatedText = await translateText(text);
          return { [key]: translatedText };
        })
      );

      // دمج النصوص المترجمة في كائن واحد
      const finalContent = Object.assign({}, ...translatedContent);

      // كتابة النصوص المترجمة إلى ملف جديد
      const translatedFilePath = path.join(localesPath, `translated_${file}`);
      await fs.writeFile(translatedFilePath, JSON.stringify(finalContent, null, 2), 'utf8');

      console.log(`Translated file written to: ${translatedFilePath}`);
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

processFiles();
