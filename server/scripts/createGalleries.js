import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from '../models/Gallery.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const createTestGalleries = async () => {
  try {
    // Clear existing galleries
    await Gallery.deleteMany({});
    console.log('✅ Cleared existing galleries');

    // Create admin user reference (use an existing admin ID from your database)
    const adminId = '69555669c2f0fad72406cf95'; // Replace with actual admin ID from your DB

    // Test gallery 1
    const gallery1 = new Gallery({
      title: 'Tech Summit 2024',
      description: 'Amazing moments from our annual tech summit showcasing innovation and excellence',
      category: 'event',
      featured: true,
      isPublished: true,
      createdBy: adminId,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
          caption: 'Opening Ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          caption: 'Keynote Speaker'
        },
        {
          url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
          caption: 'Networking Session'
        }
      ]
    });
    await gallery1.save();
    console.log('✅ Created gallery 1: Tech Summit 2024');

    // Test gallery 2
    const gallery2 = new Gallery({
      title: 'Annual Sports Championship',
      description: 'Celebrating excellence in sports with thrilling matches and outstanding performances',
      category: 'achievement',
      featured: true,
      isPublished: true,
      createdBy: adminId,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
          caption: 'Opening Ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1515591341207-04dc1acda22b?w=800',
          caption: 'Cricket Match'
        },
        {
          url: 'https://images.unsplash.com/photo-1493506671697-5da12a78af64?w=800',
          caption: 'Basketball Finals'
        }
      ]
    });
    await gallery2.save();
    console.log('✅ Created gallery 2: Annual Sports Championship');

    // Test gallery 3
    const gallery3 = new Gallery({
      title: 'Campus Life Moments',
      description: 'Beautiful moments capturing the vibrant campus life and student activities',
      category: 'campus',
      featured: false,
      isPublished: true,
      createdBy: adminId,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1427487881594-c3a42a1fb613?w=800',
          caption: 'Friends on Campus'
        },
        {
          url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800',
          caption: 'Study Sessions'
        }
      ]
    });
    await gallery3.save();
    console.log('✅ Created gallery 3: Campus Life Moments');

    console.log('\n✅ Test galleries created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating galleries:', error);
    process.exit(1);
  }
};

createTestGalleries();
