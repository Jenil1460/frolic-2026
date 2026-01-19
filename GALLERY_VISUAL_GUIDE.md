# Gallery Feature - Visual Guide & Component Overview

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FROLIC PLATFORM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              HOME PAGE                               │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Hero Section                                  │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  Events Section                                │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  ✨ GALLERY COMPONENT (NEW)                   │  │  │
│  │  │  ├─ Category Filters                           │  │  │
│  │  │  ├─ Gallery Grid                               │  │  │
│  │  │  │  ├─ Gallery Card 1                          │  │  │
│  │  │  │  ├─ Gallery Card 2                          │  │  │
│  │  │  │  └─ Gallery Card 3                          │  │  │
│  │  │  └─ Lightbox Modal                             │  │  │
│  │  │     ├─ Image Display                           │  │  │
│  │  │     ├─ Navigation Arrows                       │  │  │
│  │  │     ├─ Thumbnail Strip                         │  │  │
│  │  │     └─ Image Info                              │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  Features Section                              │  │  │
│  │  ├────────────────────────────────────────────────┤  │  │
│  │  │  CTA Section                                   │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         ADMIN DASHBOARD                             │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Gallery Management Page (NEW)                 │  │  │
│  │  │  ├─ Create Gallery Button                      │  │  │
│  │  │  ├─ Gallery Grid                               │  │  │
│  │  │  │  ├─ Gallery Card with Image                 │  │  │
│  │  │  │  ├─ Edit Button → Edit Modal                │  │  │
│  │  │  │  └─ Delete Button → Confirmation            │  │  │
│  │  │  │                                             │  │  │
│  │  │  └─ Modals:                                   │  │  │
│  │  │     ├─ Create Gallery Modal                    │  │  │
│  │  │     │  ├─ Title Input                          │  │  │
│  │  │     │  ├─ Description Textarea                 │  │  │
│  │  │     │  ├─ Category Select                      │  │  │
│  │  │     │  ├─ Event Select (optional)              │  │  │
│  │  │     │  └─ Featured Checkbox                    │  │  │
│  │  │     └─ Edit Gallery Modal                      │  │  │
│  │  │        ├─ Gallery Details Form                 │  │  │
│  │  │        └─ Image Management                     │  │  │
│  │  │           ├─ Existing Images List              │  │  │
│  │  │           ├─ Remove Image Buttons              │  │  │
│  │  │           ├─ Add Images Section                │  │  │
│  │  │           │  ├─ URL Input                      │  │  │
│  │  │           │  ├─ Caption Input                  │  │  │
│  │  │           │  ├─ Add Image Button               │  │  │
│  │  │           │  └─ Upload X Images Button         │  │  │
│  │  │           └─ Image Preview Strip               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

```
Gallery Collection
├── _id: ObjectId
├── title: String (required)
├── description: String
├── category: String (enum: event, achievement, campus, other)
├── images: Array
│   ├── url: String (required)
│   ├── caption: String
│   └── uploadedAt: Date
├── event: ObjectId (ref: Event) [optional]
├── featured: Boolean
├── viewCount: Number
├── isPublished: Boolean
├── createdBy: ObjectId (ref: User)
├── createdAt: Date
└── updatedAt: Date
```

## API Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Gallery Component / GalleryManagement Page        │ │
│  │  ├─ useState, useEffect                            │ │
│  │  └─ API Calls via adminAPI                         │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                    API Calls
                         │
┌────────────────────────▼────────────────────────────────┐
│                  CLIENT API (api.js)                    │
│  ├─ adminAPI.getGalleries()                            │
│  ├─ adminAPI.getFeaturedGalleries()                    │
│  ├─ adminAPI.getGalleryById()                          │
│  ├─ adminAPI.createGallery()                           │
│  ├─ adminAPI.updateGallery()                           │
│  ├─ adminAPI.addImagesToGallery()                      │
│  ├─ adminAPI.removeImageFromGallery()                  │
│  └─ adminAPI.deleteGallery()                           │
└────────────────────────┬────────────────────────────────┘
                         │
                   HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────┐
│                   EXPRESS SERVER                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  /api/gallery Routes                               │ │
│  │  ├─ GET    / (getAllGalleries)                     │ │
│  │  ├─ GET    /featured (getFeaturedGalleries)       │ │
│  │  ├─ GET    /category/:category                    │ │
│  │  ├─ GET    /:id (getGalleryById)                  │ │
│  │  ├─ POST   / (createGallery)                      │ │
│  │  ├─ PUT    /:id (updateGallery)                   │ │
│  │  ├─ POST   /:id/images (addImages)                │ │
│  │  ├─ DELETE /:id/images/:index (removeImage)       │ │
│  │  └─ DELETE /:id (deleteGallery)                   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Gallery Controller                                 │ │
│  │  ├─ Business Logic                                 │ │
│  │  └─ Database Operations                            │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
                  Database Queries
                         │
┌────────────────────────▼────────────────────────────────┐
│                   MONGODB                               │
│  ├─ Gallery Collection                                 │
│  │  ├─ Documents with images array                     │
│  │  ├─ Indexed for fast queries                        │
│  │  └─ Relationships to User and Event                │
│  └─ All CRUD operations supported                      │
└──────────────────────────────────────────────────────────┘
```

## User Journey - Landing Page

```
User Opens Homepage
        │
        ▼
┌─────────────────────────┐
│ Scroll to Gallery       │
│ Section                 │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ See Gallery Title &     │
│ Category Filters        │
└────────┬────────────────┘
         │
         ▼
    ┌────────────────────────────────────────┐
    │   Select Filter (Optional)              │
    │   ├─ All                                │
    │   ├─ Event                              │
    │   ├─ Achievement                        │
    │   └─ Campus                             │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │ Gallery Cards Display                   │
    │ ├─ Card 1: Tech Summit                 │
    │ ├─ Card 2: Sports Championship         │
    │ └─ Card 3: Campus Life                 │
    └────────┬───────────────────────────────┘
             │
             ▼
    User Hover Over Card
             │
             ▼
    ┌────────────────────────────────────────┐
    │ Show Overlay with Zoom Button           │
    │ ├─ Image Count Badge                   │
    │ └─ Zoom Button (Hover Effect)          │
    └────────┬───────────────────────────────┘
             │
             ▼
    User Clicks Zoom Button
             │
             ▼
    ┌────────────────────────────────────────┐
    │ Lightbox Modal Opens                    │
    │ ├─ Large Image Display                 │
    │ ├─ Navigation Arrows                   │
    │ ├─ Thumbnail Strip                     │
    │ ├─ Image Counter (1/4)                 │
    │ ├─ Caption Display                     │
    │ └─ Close Button (X)                    │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │ User Can:                               │
    │ ├─ Click Prev/Next Arrows              │
    │ ├─ Click Thumbnail to Jump             │
    │ ├─ Read Caption                        │
    │ └─ Close (X or Click Overlay)          │
    └────────────────────────────────────────┘
```

## Admin Journey - Gallery Management

```
Admin Logs In
        │
        ▼
Go to Admin Dashboard
        │
        ▼
┌──────────────────────────┐
│ Click Gallery Management │
│ in Sidebar               │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│ Gallery Management Page Loads                     │
│ ├─ Shows existing galleries as cards             │
│ ├─ "Create New Gallery" button at top            │
│ └─ Each card has Edit and Delete buttons         │
└────────┬─────────────────────────────────────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
    ▼                              ▼
CREATE GALLERY              EDIT EXISTING GALLERY
    │                              │
    ▼                              ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Click Create Button  │   │ Click Edit Button    │
└──────┬───────────────┘   └──────┬───────────────┘
       │                          │
       ▼                          ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Modal: Create Gallery│   │ Modal: Edit Gallery  │
│ ├─ Title Input       │   │ ├─ Update Fields     │
│ ├─ Description       │   │ ├─ Toggle Featured   │
│ ├─ Category Select   │   │ ├─ Toggle Published  │
│ ├─ Event Select (opt)│   │ └─ Save Changes      │
│ ├─ Featured Checkbox │   └──────┬───────────────┘
│ └─ Create Button     │          │
└──────┬───────────────┘          ▼
       │              ┌──────────────────────┐
       │              │ Scroll to Images     │
       ▼              │ Section              │
┌──────────────────────┐ └──────┬───────────┘
│ Gallery Created      │        │
│ Now Add Images       │        ▼
└──────┬───────────────┘ ┌──────────────────────┐
       │                 │ View Existing Images │
       │                 │ ├─ Image Thumbnail   │
       │                 │ ├─ Image Caption     │
       │                 │ └─ Remove Button     │
       │                 └──────┬───────────────┘
       │                        │
       ▼                        ▼
┌──────────────────────────────────────────┐
│ Add Images Section                        │
│ ├─ Image URL Input                       │
│ ├─ Caption Input (Optional)              │
│ ├─ "Add Image" Button                    │
│ └─ Preview of Images to Upload           │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ User Enters URL + Optional Caption   │
│ ├─ Image shows in preview            │
│ └─ Can remove before uploading       │
└──────┬─────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Click "Upload X Image(s)"            │
│ Images are saved to gallery          │
└──────┬─────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Success! Gallery Updated             │
│ ├─ Toast notification                │
│ ├─ Images display in list            │
│ └─ Can add more or finish            │
└──────────────────────────────────────┘
```

## UI Components Breakdown

### 1. Gallery Card (Landing Page)
```
┌─────────────────────────────────────────┐
│                                         │
│        Featured Image (240px)           │
│        [Image with overlay]             │
│    ┌──────────────────────────────────┐ │
│    │  Zoom Button (Hover Effect)      │ │
│    └──────────────────────────────────┘ │
│  [4 Photos Badge]                       │
│                                         │
├─────────────────────────────────────────┤
│  Tech Summit 2024                       │
│  event • 345 views                      │
│                                         │
│  Amazing moments from our annual...     │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Gallery Card (Admin)
```
┌─────────────────────────────────────────┐
│                                         │
│        Featured Image (200px)           │
│    [Featured Badge]  [4 Photos]         │
│                                         │
├─────────────────────────────────────────┤
│  Tech Summit 2024                       │
│  event • 345 views                      │
│                                         │
│  [Edit Button]  [Delete Button]         │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Lightbox Modal
```
┌──────────────────────────────────────────────┐
│ [X Close]                                    │
│                                              │
│    ┌────────────────────────────────────┐   │
│    │                                    │   │
│    │     Main Image Display             │   │
│    │     (Full Size)                    │   │
│    │                                    │   │
│    │  [◀] Image Area [▶]                │   │
│    │                                    │   │
│    └────────────────────────────────────┘   │
│                                              │
│  ┌─────────────────────────────────────────┤
│  │ Gallery Title                            │
│  │ Gallery description...                   │
│  │                                          │
│  │ [Thumbnail] [Thumbnail] [Thumbnail]...  │
│  │                                          │
│  │ 1 / 4    |    Opening Ceremony caption   │
│  └─────────────────────────────────────────┤
│                                              │
└──────────────────────────────────────────────┘
```

## Color Scheme

### Landing Page Gallery
- Background: Dark gradient (#0f172a to #16213e)
- Primary Button: Blue (#3b82f6)
- Accent: Purple (#8b5cf6)
- Text: Light gray (#e5e7eb)
- Borders: Subtle blue (#3b82f6 with opacity)

### Admin Interface
- Uses admin-theme.css variables
- Consistent with existing admin design
- Primary: Brand color
- Secondary: Light gray
- Danger: Red (#ef4444)

## Responsive Breakpoints

```
Desktop (1024px+):
├─ 3 columns grid
├─ Full-size lightbox
└─ All features visible

Tablet (768px - 1023px):
├─ 2 columns grid
├─ Slightly smaller lightbox
└─ Touch-optimized buttons

Mobile (< 768px):
├─ 1 column grid
├─ Full-height lightbox
├─ Larger touch targets
└─ Optimized navigation
```

---

This visual guide provides a comprehensive overview of the gallery feature architecture and user flows!
