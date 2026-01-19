# Gallery Feature Documentation

## Overview

A complete gallery system has been implemented for the Frolic platform, allowing admins to manage event galleries with images and enabling users to view galleries on the landing page.

## Features Implemented

### 1. **Backend - Database Model**
- **File**: `server/models/Gallery.js`
- **Features**:
  - Gallery with title, description, and category
  - Multiple images support (URL + caption)
  - Categories: event, achievement, campus, other
  - Featured galleries for homepage
  - View count tracking
  - Publication status (draft/published)
  - Created by (admin reference)

### 2. **Backend - API Endpoints**
- **File**: `server/routes/galleryRoutes.js` & `server/controllers/galleryController.js`
- **Endpoints**:
  ```
  GET    /api/gallery              - Get all galleries
  GET    /api/gallery/featured     - Get featured galleries (for homepage)
  GET    /api/gallery/category/:category - Get galleries by category
  GET    /api/gallery/:id          - Get single gallery (increments view count)
  
  POST   /api/gallery              - Create new gallery (admin only)
  PUT    /api/gallery/:id          - Update gallery details (admin only)
  POST   /api/gallery/:id/images   - Add images to gallery (admin only)
  DELETE /api/gallery/:id/images/:imageIndex - Remove image (admin only)
  DELETE /api/gallery/:id          - Delete gallery (admin only)
  ```

### 3. **Frontend - Admin Management**
- **File**: `client/src/pages/admin/GalleryManagement.jsx`
- **Features**:
  - View all galleries in card grid
  - Create new gallery with form
  - Edit gallery details (title, description, category, featured status, published)
  - Add/remove images from galleries
  - View count display
  - Featured badge indicator
  - Delete gallery function
  - Full CRUD operations

### 4. **Frontend - Landing Page Gallery**
- **File**: `client/src/components/Gallery.jsx`
- **Features**:
  - Display featured galleries
  - Filter by category
  - Image lightbox modal with:
    - Image navigation (prev/next)
    - Thumbnail strip
    - Image counter
    - Image captions
    - Smooth animations
  - Responsive design
  - View count tracking
  - Beautiful gradient UI

### 5. **Integration**
- Gallery component added to Home page
- API methods added to `client/src/utils/api.js`
- Routes registered in `server/server.js`

## Database Schema

```javascript
{
  title: String (required),
  description: String,
  category: String (enum: ['event', 'achievement', 'campus', 'other']),
  images: [
    {
      url: String (required),
      caption: String,
      uploadedAt: Date
    }
  ],
  event: ObjectId (ref: Event),
  featured: Boolean (default: false),
  viewCount: Number (default: 0),
  isPublished: Boolean (default: true),
  createdBy: ObjectId (ref: User, required),
  timestamps: true
}
```

## How to Use

### For Admins

1. **Create a Gallery**:
   - Go to Admin Dashboard → Gallery Management
   - Click "Create New Gallery"
   - Fill in title, description, category
   - Optionally link to an event
   - Mark as featured if needed
   - Click "Create Gallery"

2. **Add Images**:
   - Click "Edit" on any gallery card
   - Scroll to "Add Images" section
   - Enter image URL and optional caption
   - Click "Add Image" to add to preview
   - Click "Upload X Image(s)" to save all at once

3. **Edit Gallery**:
   - Click "Edit" on gallery card
   - Modify title, description, category
   - Toggle featured/published status
   - Save changes

4. **Remove Images**:
   - Click "Edit" on gallery card
   - Hover over image in gallery
   - Click trash icon to remove

5. **Delete Gallery**:
   - Click trash icon on gallery card
   - Confirm deletion

### For Users

1. **View Gallery on Homepage**:
   - Scroll to "Event Gallery" section
   - Browse featured galleries
   - Click filter buttons to filter by category

2. **View Gallery Details**:
   - Click zoom icon on any gallery
   - Opens lightbox with full-screen image view
   - Use arrow buttons to navigate
   - Click thumbnails to jump to specific image
   - Close with X button or click overlay

## API Usage Examples

### Fetch Featured Galleries (Frontend)
```javascript
const response = await adminAPI.getFeaturedGalleries();
// Returns array of gallery objects with images
```

### Create Gallery (Admin)
```javascript
await adminAPI.createGallery({
  title: 'Tech Summit 2024',
  description: 'Amazing moments from our tech summit',
  category: 'event',
  event: eventId,
  featured: true
});
```

### Add Images
```javascript
await adminAPI.addImagesToGallery(galleryId, [
  {
    url: 'https://example.com/image1.jpg',
    caption: 'Opening ceremony'
  },
  {
    url: 'https://example.com/image2.jpg',
    caption: 'Main stage'
  }
]);
```

## Styling

### Admin Interface
- Uses `admin-theme.css` for consistent styling
- Responsive grid layout
- Modal-based image management
- Form validation feedback

### Landing Page
- Dark gradient background with glassmorphism
- Smooth animations with Framer Motion
- Responsive grid (1 col mobile, 3 cols desktop)
- Professional lightbox with thumbnails
- Accessible color contrast

## File Structure

```
Backend:
server/
├── models/Gallery.js
├── controllers/galleryController.js
├── routes/galleryRoutes.js

Frontend:
client/src/
├── components/
│   ├── Gallery.jsx
│   └── Gallery.css
├── pages/admin/
│   ├── GalleryManagement.jsx
│   └── GalleryManagement.css
└── utils/api.js (updated)

Configuration:
server/server.js (updated with gallery routes)
client/src/pages/Home.jsx (updated with Gallery component)
```

## Features & Highlights

✅ Full CRUD operations for galleries
✅ Multiple image support with captions
✅ Category-based filtering
✅ Featured gallery highlighting
✅ View count tracking
✅ Beautiful lightbox interface
✅ Responsive design (mobile, tablet, desktop)
✅ Smooth animations
✅ Admin controls with form validation
✅ Image management interface
✅ Publication status control
✅ Event association
✅ Professional UI with gradient backgrounds

## Best Practices Implemented

1. **Security**: Routes protected with authentication middleware
2. **Performance**: Lean queries with only needed fields
3. **UX**: Smooth animations and intuitive interface
4. **Responsive**: Mobile-first design approach
5. **Accessibility**: Proper ARIA labels and semantic HTML
6. **Error Handling**: User-friendly error messages via toast notifications
7. **Data Validation**: Required fields and type checking
8. **Code Organization**: Separation of concerns (models, controllers, routes)

## Future Enhancements

- Cloudinary integration for image upload
- Bulk image upload
- Image cropping/editing
- Social sharing buttons
- Comment section on galleries
- Gallery ratings/likes
- AI-powered image organization
- Advanced filtering (date range, institute)
- Download gallery as ZIP
