# Gallery Feature - Quick Setup & Testing Guide

## What's Been Added

### Backend
1. **Gallery Model** - Database schema for gallery collections
2. **Gallery Controller** - Business logic for gallery operations
3. **Gallery Routes** - API endpoints for CRUD operations
4. **Server Integration** - Routes registered in main server file

### Frontend
1. **Gallery Component** - Landing page gallery display with lightbox
2. **Gallery Management Page** - Admin interface for managing galleries
3. **API Integration** - Gallery API calls added to utils/api.js
4. **Home Page Integration** - Gallery component added to Home page

## How to Test

### Step 1: Start Backend Server
```bash
cd server
npm install  # If not already installed
npm start    # or npm run dev
```

### Step 2: Start Frontend Development Server
```bash
cd client
npm install  # If not already installed
npm run dev
```

### Step 3: Access Admin Panel
1. Login as admin (or create admin account)
2. Go to Admin Dashboard
3. Navigate to "Gallery Management" (should be in sidebar)

### Step 4: Create a Test Gallery
1. Click "Create New Gallery" button
2. Fill in:
   - **Title**: "Tech Summit 2024"
   - **Description**: "Amazing moments from our annual tech summit"
   - **Category**: Select "event"
   - **Featured**: Check the checkbox
3. Click "Create Gallery"

### Step 5: Add Images to Gallery
1. Click "Edit" on the created gallery
2. Scroll to "Add Images" section
3. Enter image URL (use any publicly available image URL, e.g., from Unsplash)
4. Optionally add caption
5. Click "Add Image"
6. Repeat for 2-3 images
7. Click "Upload X Image(s)" to save all images

### Step 6: View Gallery on Homepage
1. Go to home page (`/`)
2. Scroll down to "Event Gallery" section
3. You should see your gallery card with the first image
4. Click the zoom icon to open lightbox
5. Test navigation with arrow buttons
6. Test thumbnails
7. Close with X or click overlay

### Step 7: Test Filtering
1. Create another gallery with category "achievement"
2. Refresh home page
3. Click filter buttons to filter galleries by category

## Expected Features

### Admin Panel
- ✅ Create gallery with form validation
- ✅ View all galleries in grid
- ✅ Edit gallery details
- ✅ Add multiple images
- ✅ Remove individual images
- ✅ Delete entire gallery
- ✅ Toggle featured status
- ✅ Toggle publication status
- ✅ View count display

### Landing Page
- ✅ Display featured galleries only
- ✅ Filter by category with buttons
- ✅ Beautiful card layout with hover effects
- ✅ Lightbox modal for viewing images
- ✅ Image navigation (prev/next arrows)
- ✅ Thumbnail strip
- ✅ Image counter and captions
- ✅ Smooth animations
- ✅ Responsive design

## API Endpoints Available

```
PUBLIC ENDPOINTS:
GET /api/gallery                        - Get all published galleries
GET /api/gallery/featured               - Get featured galleries
GET /api/gallery/:id                    - Get single gallery
GET /api/gallery/category/:category     - Filter by category

ADMIN ENDPOINTS (require auth):
POST /api/gallery                       - Create gallery
PUT /api/gallery/:id                    - Update gallery
POST /api/gallery/:id/images            - Add images
DELETE /api/gallery/:id/images/:index   - Remove image
DELETE /api/gallery/:id                 - Delete gallery
```

## Sample Image URLs for Testing

You can use these public image URLs for testing:
- https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500
- https://images.unsplash.com/photo-1552664730-d307ca884978?w=500
- https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500
- https://images.unsplash.com/photo-1552664730-d307ca884978?w=500
- https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=500

## Troubleshooting

### Gallery not showing on home page
- Make sure gallery has `featured: true`
- Make sure gallery has `isPublished: true`
- Check browser console for API errors

### Images not loading in lightbox
- Verify image URL is correct and publicly accessible
- Check CORS settings if using external images

### Admin page not accessible
- Ensure you're logged in as admin
- Check user role in database or profile

### API errors
- Check server logs for detailed error messages
- Ensure MongoDB is running
- Verify authentication token is valid

## File Locations

```
Backend:
server/models/Gallery.js
server/controllers/galleryController.js
server/routes/galleryRoutes.js
server/server.js (updated)

Frontend:
client/src/components/Gallery.jsx
client/src/components/Gallery.css
client/src/pages/admin/GalleryManagement.jsx
client/src/pages/admin/GalleryManagement.css
client/src/utils/api.js (updated)
client/src/pages/Home.jsx (updated)
```

## Performance Notes

- Frontend galleries load only featured galleries (optimized)
- Image lazy loading can be added for better performance
- View count increments on each view (good for analytics)
- Filtering is done client-side (fast for small galleries)

## Security

- Create/Update/Delete operations require authentication
- Images stored as URLs (no file upload yet, can be enhanced with Cloudinary)
- User can only view published galleries
- Admin controls access via authMiddleware

## Next Steps for Enhancement

1. Add Cloudinary integration for direct image uploads
2. Add bulk image upload feature
3. Add image cropping/editing tools
4. Add social sharing buttons
5. Add gallery comments/ratings
6. Add date filtering
7. Add search functionality
8. Add gallery templates

---

**For more details, see GALLERY_FEATURE.md**
