#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Create public directory if it doesn't exist
if not os.path.exists('public'):
    os.makedirs('public')

def create_icon(size):
    # Create a green square
    img = Image.new('RGB', (size, size), color='#10B981')
    
    # Save the icon
    img.save(f'public/icon-{size}x{size}.png')
    print(f'Created icon-{size}x{size}.png')

# Create icons of different sizes
sizes = [192, 512, 180, 32]
for size in sizes:
    create_icon(size)

# Also create favicon
if os.path.exists('public/icon-32x32.png'):
    os.system('cp public/icon-32x32.png public/favicon.ico')
    
print("All icons created successfully!")