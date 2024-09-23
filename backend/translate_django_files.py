import os
import re
from googletrans import Translator

# Initialize the translator
translator = Translator()

# Define the directories to exclude from translation
excluded_dirs = ['venv', 'static', 'media', '__pycache__', 'node_modules']

def translate_text(text, target_lang='ar'):
    try:
        translated = translator.translate(text, src='zh-cn', dest=target_lang)
        return translated.text
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def translate_file_content(content):
    # Regular expression to match Chinese characters
    chinese_texts = re.findall(r'[\u4e00-\u9fff]+', content)
    translated_texts = {}

    for text in chinese_texts:
        if text not in translated_texts:
            translated_texts[text] = translate_text(text)
    
    # Replace Chinese text with translated text
    for chinese, translated in translated_texts.items():
        content = content.replace(chinese, translated)
    
    return content

def translate_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        translated_content = translate_file_content(content)

        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(translated_content)

        print(f"Translated file saved: {file_path}")

    except Exception as e:
        print(f"Error translating file {file_path}: {e}")

def translate_directory(directory_path):
    for root, dirs, files in os.walk(directory_path):
        # Exclude specific directories
        dirs[:] = [d for d in dirs if d not in excluded_dirs]

        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith(('.html', '.js', '.py', '.txt', '.json')):  # Add other file types as needed
                translate_file(file_path)

# Define the project root directory (adjust as needed)
project_root = os.path.abspath(os.path.dirname(__file__))
translate_directory(project_root)
