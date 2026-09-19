"""Regenerate responsive derivatives using an existing Python/Pillow installation."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
output = root / 'public/media/optimized'
output.mkdir(parents=True, exist_ok=True)

with Image.open(root / 'public/media/sequence/frame-001.jpg') as image:
    image.resize((640, 360), Image.Resampling.LANCZOS).save(
        output / 'hero-640.webp', 'WEBP', quality=78, method=6)

for name in ['candlelit-table', 'basil-tomato', 'wood-fired-oven']:
    with Image.open(root / f'public/media/photos/{name}.jpg') as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        for width in [640, 960]:
            actual_width = min(width, image.width)
            height = round(image.height * actual_width / image.width)
            image.resize((actual_width, height), Image.Resampling.LANCZOS).save(
                output / f'{name}-{width}.webp', 'WEBP', quality=84, method=6)

print(f'Responsive assets written to {output}')
