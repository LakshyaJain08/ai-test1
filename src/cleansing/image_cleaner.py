"""
Image Cleansing Module
Removes logos and sensitive visual information from images
"""
import os
from typing import Tuple, List

try:
    from PIL import Image, ImageDraw, ImageFilter
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


class ImageCleaner:
    """Handles cleansing of images by removing logos and sensitive information"""
    
    def __init__(self):
        self.logo_keywords = ['logo', 'brand', 'company', 'corporate']
    
    def detect_logo_regions(self, image_path: str) -> List[Tuple[int, int, int, int]]:
        """
        Detect potential logo regions in an image
        (Simplified heuristic-based approach)
        
        Args:
            image_path: Path to the image file
            
        Returns:
            List of bounding boxes (x1, y1, x2, y2)
        """
        if not PIL_AVAILABLE:
            print("Error: PIL not available")
            return []
        
        try:
            img = Image.open(image_path)
            width, height = img.size
            
            # Heuristic: Logos are often in corners or top of document
            # Return common logo positions
            regions = [
                (0, 0, width // 4, height // 8),  # Top-left
                (3 * width // 4, 0, width, height // 8),  # Top-right
                (width // 3, 0, 2 * width // 3, height // 10),  # Top-center
            ]
            
            return regions
        except Exception as e:
            print(f"Error detecting logo regions: {e}")
            return []
    
    def blur_region(self, image_path: str, regions: List[Tuple[int, int, int, int]], 
                    output_path: str = None, blur_radius: int = 15) -> str:
        """
        Blur specific regions in an image
        
        Args:
            image_path: Path to input image
            regions: List of regions to blur (x1, y1, x2, y2)
            output_path: Path to save output (if None, generates automatically)
            blur_radius: Radius of blur effect
            
        Returns:
            Path to the cleaned image
        """
        try:
            img = Image.open(image_path)
            
            for region in regions:
                x1, y1, x2, y2 = region
                # Crop the region
                crop = img.crop((x1, y1, x2, y2))
                # Apply blur
                blurred = crop.filter(ImageFilter.GaussianBlur(radius=blur_radius))
                # Paste back
                img.paste(blurred, (x1, y1))
            
            # Generate output path if not provided
            if output_path is None:
                base, ext = os.path.splitext(image_path)
                output_path = f"{base}_cleaned{ext}"
            
            img.save(output_path)
            return output_path
            
        except Exception as e:
            print(f"Error blurring regions: {e}")
            return image_path
    
    def mask_region(self, image_path: str, regions: List[Tuple[int, int, int, int]], 
                    output_path: str = None, color: Tuple[int, int, int] = (255, 255, 255)) -> str:
        """
        Mask specific regions with a solid color
        
        Args:
            image_path: Path to input image
            regions: List of regions to mask (x1, y1, x2, y2)
            output_path: Path to save output
            color: RGB color tuple for mask
            
        Returns:
            Path to the cleaned image
        """
        try:
            img = Image.open(image_path)
            draw = ImageDraw.Draw(img)
            
            for region in regions:
                x1, y1, x2, y2 = region
                draw.rectangle([x1, y1, x2, y2], fill=color)
            
            # Generate output path if not provided
            if output_path is None:
                base, ext = os.path.splitext(image_path)
                output_path = f"{base}_masked{ext}"
            
            img.save(output_path)
            return output_path
            
        except Exception as e:
            print(f"Error masking regions: {e}")
            return image_path
    
    def clean_image(self, image_path: str, output_path: str = None, 
                    method: str = 'blur') -> str:
        """
        Clean an image by removing logos and sensitive information
        
        Args:
            image_path: Path to input image
            output_path: Path to save cleaned image
            method: Cleaning method ('blur' or 'mask')
            
        Returns:
            Path to cleaned image
        """
        # Detect logo regions
        regions = self.detect_logo_regions(image_path)
        
        if method == 'blur':
            return self.blur_region(image_path, regions, output_path)
        elif method == 'mask':
            return self.mask_region(image_path, regions, output_path)
        else:
            print(f"Unknown method: {method}")
            return image_path
