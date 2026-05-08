from PIL import Image
import os

def resize_icon(input_path, output_path, size):
    with Image.open(input_path) as img:
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img.save(output_path)

icon_raw = 'ai-writing-assistant-extension/icons/icon_raw.png'
sizes = [16, 48, 128]

for size in sizes:
    output = f'ai-writing-assistant-extension/icons/icon{size}.png'
    resize_icon(icon_raw, output, size)
    print(f'Created {output}')
