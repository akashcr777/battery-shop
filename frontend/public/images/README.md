# Product Images Guide

## 📸 Two Ways to Add Images

Your battery shop supports **two types of images**:

### Option 1: Category Images (Quick Setup - 8 images)
Generic images for each product category
- ✅ **Fast to implement** - Only 8 images needed
- ✅ **Good for getting started**
- All products in same category share one image

### Option 2: Product-Specific Images (Professional - 55 images)
Unique image for each individual product
- ✅ **Most professional** - Each product has its own photo
- ✅ **Better customer experience**
- Customers see exactly what they're buying

### Option 3: Mix & Match (Recommended)
Use category images + add specific images for featured products
- ✅ **Best of both worlds**
- ✅ **Gradual implementation**

---

## 📁 Folder Structure

**SIMPLE! Just paste all images in this folder:**

```
frontend/public/images/
├── battery-two-wheeler.jpg             ← Category images (required)
├── battery-three-wheeler.jpg
├── battery-four-wheeler.jpg
├── battery-truck.jpg
├── battery-home.jpg
├── ups-type1.jpg
├── ups-type2.jpg
├── ups-type3.jpg
├── exide-xplore-xltz4a-4ah.jpg        ← Product-specific images (optional)
├── apc-ups-600va.jpg
└── ... (any other images)
```

**Optional: Organize in subfolder if you prefer**
```
frontend/public/images/
├── battery-two-wheeler.jpg             ← Category images
├── ... (other category images)
└── products/                           ← Optional subfolder
    ├── exide-xplore-xltz4a-4ah.jpg
    └── ... (product images)
```

**Both work! The system automatically finds images in either location.**

---

## 🚀 Quick Start: Category Images (Minimum 8 Required)

Add these images to `frontend/public/images/`:

### Battery Categories (5 images)
1. **battery-two-wheeler.jpg** - Motorcycle/Scooter battery
2. **battery-three-wheeler.jpg** - Auto rickshaw battery
3. **battery-four-wheeler.jpg** - Car battery
4. **battery-truck.jpg** - Truck/Commercial vehicle battery
5. **battery-home.jpg** - Inverter/Home battery

### UPS Categories (3 images)
6. **ups-type1.jpg** - Standard UPS (600VA-1000VA)
7. **ups-type2.jpg** - Advanced UPS (1500VA-2000VA)
8. **ups-type3.jpg** - Premium UPS (3000VA+)

**This is the minimum you need to get started!**

---

## ⭐ Professional Setup: Product-Specific Images (Optional)

For the best customer experience, add individual images for each product.

### Simply paste product images in the same folder:
See **`PRODUCT_IMAGES_LIST.md`** in the root folder for the complete list of all 55 products and their exact filenames.

**Examples:**
- `exide-xplore-xltz4a-4ah.jpg`
- `apc-ups-600va.jpg`
- `exide-epic-epic35l-35ah.jpg`

**That's it!** Just paste images directly into `frontend/public/images/` folder.

**Optional:** Create a `products/` subfolder if you want to keep them organized, but it's not required!

---

## 🎯 How Image Loading Works

The app uses a **smart automatic search system**:

```
For "Exide Xplore XLTZ4A (4Ah)":

1. Try → /images/products/exide-xplore-xltz4a-4ah.jpg (if you used subfolder)
2. Try → /images/exide-xplore-xltz4a-4ah.jpg (main folder)
3. Try → /images/battery-two-wheeler.jpg (category fallback)
4. Show → Beautiful auto-generated SVG placeholder
```

**The system automatically finds your images wherever you put them!**

**Bonus:** Tries .jpg, .jpeg, .png, and .webp automatically - use any format!

---

## 📋 Image Specifications

### Image Format
- **Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Recommended size:** 800x600px or similar aspect ratio (4:3)
- **File size:** Keep under 500KB for best performance
- **Quality:** High quality product photos with white or clean background

---

## 🎨 Product Image Naming Convention

The app **automatically converts** product names to filenames:

**Conversion Rules:**
- Convert to lowercase
- Replace spaces with hyphens (-)
- Remove parentheses and special characters
- Keep only letters, numbers, and hyphens

**Examples:**

| Product Name | Filename |
|--------------|----------|
| Exide Xplore XLTZ4A (4Ah) | `exide-xplore-xltz4a-4ah.jpg` |
| APC UPS 600VA | `apc-ups-600va.jpg` |
| Exide EPIC EPIC35L (35Ah) | `exide-epic-epic35l-35ah.jpg` |

**See `PRODUCT_IMAGES_LIST.md` for all 55 products and their exact filenames.**

---

## 📝 How to Add Images

### Method 1: Download from Manufacturer Websites
1. Visit manufacturer websites (Exide, Amaron, APC, Luminous, etc.)
2. Download high-quality product images
3. Rename according to the naming convention above
4. Place in this folder

### Method 2: Take Your Own Photos
1. Use a smartphone or camera
2. Ensure good lighting and clean background
3. Take photos from front angle
4. Edit to remove background if needed (use tools like remove.bg)
5. Resize to 800x600px
6. Save with correct filename

### Method 3: Use Stock Images (Temporary)
1. Search for battery/UPS images on free stock photo sites:
   - Unsplash (https://unsplash.com)
   - Pexels (https://pexels.com)
   - Pixabay (https://pixabay.com)
2. Download and rename appropriately

---

## 🔄 What Happens If Images Are Missing?

The app will show beautiful gradient placeholders with:
- Product name
- Product type icon (🔋 for batteries, ⚡ for UPS)
- Instructions for adding the image
- Color-coded backgrounds (Purple for batteries, Pink for UPS)

---

## 💡 Tips for Best Results

1. **Consistency:** Use similar backgrounds for all images (preferably white)
2. **Orientation:** All images should be in landscape mode
3. **Focus:** Product should be centered and clearly visible
4. **Branding:** Include brand logos if present on the product
5. **Optimization:** Compress images using tools like TinyPNG before uploading

---

## 🚀 Implementation Strategies

### Strategy 1: Minimum Viable (15 minutes)
Add **8 category images** only
- Perfect for testing and getting started
- All products in same category share one image

### Strategy 2: Featured Products (1-2 hours)
Add 8 category images + 10-15 best-selling product images
- Category images as fallback
- Featured items get unique photos
- **Recommended approach**

### Strategy 3: Complete Catalog (Professional)
Add all 55 product-specific images
- Most professional appearance
- Each product has unique image
- Best customer experience

**Start with Strategy 1, then gradually add more images as needed!**

---

## 📧 Need Help?

If you need help finding or creating images, consider:
- Contacting your battery suppliers for product images
- Hiring a photographer for professional shots
- Using graphic design tools like Canva to create branded images

---

**Last Updated:** January 2026
