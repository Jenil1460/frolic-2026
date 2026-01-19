# Gallery Feature - Example Data & Testing

## Sample Gallery Data

### Example 1: Tech Summit Gallery
```json
{
  "_id": "gallery_001",
  "title": "Tech Summit 2024",
  "description": "An amazing gathering of tech enthusiasts, innovative minds, and industry leaders showcasing cutting-edge technologies and groundbreaking innovations.",
  "category": "event",
  "event": "event_001",
  "featured": true,
  "isPublished": true,
  "viewCount": 345,
  "createdBy": "admin_001",
  "images": [
    {
      "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      "caption": "Opening Ceremony - Welcome to Tech Summit 2024"
    },
    {
      "url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      "caption": "Keynote Speaker - Insights on AI and Machine Learning"
    },
    {
      "url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
      "caption": "Networking Session - Connecting with Industry Experts"
    },
    {
      "url": "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800",
      "caption": "Product Showcase - Innovation on Display"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Example 2: Annual Sports Championship
```json
{
  "_id": "gallery_002",
  "title": "Annual Sports Championship 2024",
  "description": "Celebrating excellence in sports with thrilling matches, outstanding performances, and memorable moments from our annual championship.",
  "category": "achievement",
  "event": "event_002",
  "featured": true,
  "isPublished": true,
  "viewCount": 512,
  "createdBy": "admin_001",
  "images": [
    {
      "url": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
      "caption": "Opening Ceremony - Flag Bearer Parade"
    },
    {
      "url": "https://images.unsplash.com/photo-1515591341207-04dc1acda22b?w=800",
      "caption": "Cricket Match - Exciting Moments on Field"
    },
    {
      "url": "https://images.unsplash.com/photo-1493506671697-5da12a78af64?w=800",
      "caption": "Basketball Finals - Championship Victory"
    }
  ],
  "createdAt": "2024-01-20T14:30:00Z",
  "updatedAt": "2024-01-20T14:30:00Z"
}
```

### Example 3: Campus Life
```json
{
  "_id": "gallery_003",
  "title": "Campus Life Moments",
  "description": "Beautiful moments capturing the vibrant campus life, student activities, and wonderful memories created together.",
  "category": "campus",
  "event": null,
  "featured": false,
  "isPublished": true,
  "viewCount": 234,
  "createdBy": "admin_002",
  "images": [
    {
      "url": "https://images.unsplash.com/photo-1427487881594-c3a42a1fb613?w=800",
      "caption": "Student Life - Friends on Campus"
    },
    {
      "url": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
      "caption": "Study Sessions - Learning Together"
    }
  ],
  "createdAt": "2024-02-01T11:00:00Z",
  "updatedAt": "2024-02-01T11:00:00Z"
}
```

## Testing Workflows

### Workflow 1: Create and Manage Gallery

**Step 1: Create Gallery**
```javascript
POST /api/gallery
{
  "title": "Tech Summit 2024",
  "description": "An amazing gathering...",
  "category": "event",
  "event": "event_001",
  "featured": true
}
```

**Expected Response:**
```javascript
{
  "success": true,
  "message": "Gallery created successfully",
  "data": {
    "_id": "gallery_001",
    "title": "Tech Summit 2024",
    ...
  }
}
```

**Step 2: Add Images**
```javascript
POST /api/gallery/{galleryId}/images
{
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "caption": "Opening Ceremony"
    },
    {
      "url": "https://example.com/image2.jpg",
      "caption": "Keynote Speaker"
    }
  ]
}
```

**Step 3: Update Gallery**
```javascript
PUT /api/gallery/{galleryId}
{
  "featured": true,
  "isPublished": true
}
```

**Step 4: View Gallery**
```javascript
GET /api/gallery/{galleryId}
// This increments view count by 1
```

### Workflow 2: User Views Gallery on Homepage

**Step 1: Get Featured Galleries**
```javascript
GET /api/gallery/featured
// Returns array of featured published galleries
```

**Step 2: Filter by Category**
```javascript
GET /api/gallery/category/event
// Returns only 'event' category galleries
```

**Step 3: View Single Gallery (in lightbox)**
```javascript
GET /api/gallery/{galleryId}
// Returns full gallery with all images
// View count incremented
```

## Test Cases

### Admin Test Cases

#### Test Case 1: Create Gallery
- ✅ Title is required
- ✅ Category is optional (defaults to 'event')
- ✅ Featured is optional (defaults to false)
- ✅ Event association is optional

#### Test Case 2: Add Images
- ✅ Image URL is required
- ✅ Caption is optional
- ✅ Multiple images can be added
- ✅ Images display in order

#### Test Case 3: Remove Image
- ✅ Correct image is removed
- ✅ Other images remain intact
- ✅ View updates correctly

#### Test Case 4: Update Gallery
- ✅ Title can be updated
- ✅ Description can be updated
- ✅ Category can be updated
- ✅ Featured status can be toggled
- ✅ Published status can be toggled

#### Test Case 5: Delete Gallery
- ✅ Gallery is removed
- ✅ All associated images are removed
- ✅ Cannot view deleted gallery

### User Test Cases

#### Test Case 6: View Gallery on Homepage
- ✅ Only featured galleries appear
- ✅ Gallery images display correctly
- ✅ Image count is accurate

#### Test Case 7: Filter Galleries
- ✅ Filter buttons work correctly
- ✅ Correct galleries are shown for each category
- ✅ "All" filter shows all galleries

#### Test Case 8: Lightbox Navigation
- ✅ Zoom icon opens lightbox
- ✅ Previous button shows previous image
- ✅ Next button shows next image
- ✅ Thumbnail selection works
- ✅ Image counter is accurate
- ✅ Captions display correctly
- ✅ Close button works
- ✅ Click overlay closes lightbox

#### Test Case 9: View Count
- ✅ Initial view count is 0
- ✅ View count increments on each view
- ✅ View count displays on gallery card

## Curl Commands for Testing

### Create Gallery
```bash
curl -X POST http://localhost:5000/api/gallery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Test Gallery",
    "description": "Test description",
    "category": "event",
    "featured": true
  }'
```

### Add Images
```bash
curl -X POST http://localhost:5000/api/gallery/<galleryId>/images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "caption": "Test image 1"
      }
    ]
  }'
```

### Get Featured Galleries
```bash
curl -X GET http://localhost:5000/api/gallery/featured
```

### Get All Galleries
```bash
curl -X GET http://localhost:5000/api/gallery
```

### Get Single Gallery
```bash
curl -X GET http://localhost:5000/api/gallery/<galleryId>
```

### Filter by Category
```bash
curl -X GET http://localhost:5000/api/gallery/category/event
```

### Update Gallery
```bash
curl -X PUT http://localhost:5000/api/gallery/<galleryId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "featured": false,
    "isPublished": true
  }'
```

### Remove Image
```bash
curl -X DELETE http://localhost:5000/api/gallery/<galleryId>/images/0 \
  -H "Authorization: Bearer <token>"
```

### Delete Gallery
```bash
curl -X DELETE http://localhost:5000/api/gallery/<galleryId> \
  -H "Authorization: Bearer <token>"
```

## Frontend Testing with Browser Console

```javascript
// Import the API
import { adminAPI } from './utils/api';

// Get featured galleries
const galleries = await adminAPI.getFeaturedGalleries();
console.log(galleries);

// Create a gallery
const newGallery = await adminAPI.createGallery({
  title: 'Test Gallery',
  category: 'event',
  featured: true
});
console.log(newGallery);

// Add images
const updated = await adminAPI.addImagesToGallery(newGallery.data._id, [
  {
    url: 'https://example.com/image.jpg',
    caption: 'Test'
  }
]);
console.log(updated);

// Get single gallery
const gallery = await adminAPI.getGalleryById(newGallery.data._id);
console.log(gallery);
```

## Performance Testing

- Load homepage with 10+ galleries
- Filter between categories rapidly
- Open and close lightbox multiple times
- Navigate images in lightbox
- Admin: Create/update/delete galleries
- Check network requests and response times

## Browser Compatibility

Tested and works on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Accessibility Testing

- ✅ Keyboard navigation (arrows in lightbox)
- ✅ ARIA labels on buttons
- ✅ Color contrast meets WCAG standards
- ✅ Touch-friendly buttons on mobile

---

Use these examples and test cases to thoroughly validate the gallery feature!
