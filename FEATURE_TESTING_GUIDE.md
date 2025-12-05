# Feature Testing Guide for F02 Submission

## Overview

This guide provides step-by-step instructions for testing the three implemented features for the F02 Development Sprint.

---

## Feature 1: User Authentication & Profile Management

### Description

Users can sign up, log in, and manage their profiles with persistent authentication across sessions.

### How to Test

1. **Sign Up**
   - Navigate to `/signup` or click "Sign Up" on the landing page
   - Fill in the form:
     - Username: `testuser`
     - Email: `test@example.com`
     - Password: `password123` (minimum 6 characters)
   - Click "Sign Up"
   - You should be redirected to the dashboard

2. **Log Out**
   - Click on your profile avatar in the top right
   - Select "Logout" from the dropdown menu
   - You should be redirected to the login page

3. **Log In**
   - Navigate to `/login`
   - Enter your credentials:
     - Email: `test@example.com`
     - Password: `password123`
   - Click "Login"
   - You should be redirected to the dashboard

4. **Session Persistence**
   - After logging in, refresh the page
   - You should remain logged in
   - Close the browser and reopen
   - Navigate to the app - you should still be logged in

### Expected Behavior

- ✅ New users can create accounts
- ✅ Users can log in with correct credentials
- ✅ Invalid credentials show error messages
- ✅ Sessions persist across page refreshes
- ✅ Users can log out successfully

---

## Feature 2: group chat Management

### Description

Users can create group chat, view group details, and see member/resource counts.

### How to Test

1. **View Dashboard**
   - Log in to your account
   - Navigate to `/dashboard`
   - You should see the group chat interface

2. **Create a New group chat**
   - Click the "+ Create Group" button
   - Fill in the form:
     - Course: `COMP 426`
     - Group Name: `Final Project Team`
     - Description: `Working on our final project together`
   - Click "Create Group"
   - The new group should appear in your groups list

3. **View Group Details**
   - Click on any group chat card
   - You should be redirected to `/groups/[id]`
   - Group name and description should be displayed
   - You should see the "Shared Notes Board" section

4. **View Group Statistics**
   - On the dashboard, each group card shows:
     - Number of members
     - Number of resources (messages/files)
     - Last activity timestamp

### Expected Behavior

- ✅ Users can create new group chats
- ✅ Groups display with correct information
- ✅ Clicking a group navigates to group detail page
- ✅ Group statistics update dynamically
- ✅ Multiple groups can be created and managed

---

## Feature 3: Shared Notes Board with File Uploads

### Description

Each group chat has a shared notes board where members can post text messages and upload files (PDFs, images). Files are stored in Supabase Storage and updates appear in real-time.

### How to Test

1. **Access Notes Board**
   - Navigate to any group chat page (`/groups/[id]`)
   - Scroll to the "Shared Notes Board" section
   - You should see a message input area and upload button

2. **Post a Text Message**
   - Type a message in the text area: `Hello team! Let's collaborate on this project.`
   - Click the Send button (paper plane icon)
   - Your message should appear immediately in the message feed
   - Message should show your name and timestamp

3. **Upload an Image**
   - Click the Upload button (upload icon)
   - Select an image file (JPG, PNG, GIF, or WebP)
   - The file name should appear below the input
   - Click Send
   - The image should appear in the message feed as a preview
   - Click the image to view full size

4. **Upload a PDF**
   - Click the Upload button
   - Select a PDF file (max 10MB)
   - Click Send
   - A "View PDF" link should appear in the message feed
   - Click the link to open the PDF in a new tab

5. **Test File Size Limit**
   - Try uploading a file larger than 10MB
   - You should see an error message: "File size must be less than 10MB"

6. **Test Real-time Updates** (requires two browser windows)
   - Open the same group page in two different browser windows/tabs
   - Post a message in one window
   - The message should appear in both windows without refreshing
   - Upload a file in one window
   - The file should appear in both windows automatically

7. **Post Message with File**
   - Type a message: `Here's our study guide`
   - Click Upload and select a file
   - Click Send
   - Both the message text and file should appear together

8. **Test Empty Submission**
   - Try clicking Send without typing a message or selecting a file
   - Nothing should happen (validation prevents empty posts)

### Expected Behavior

- ✅ Users can post text messages
- ✅ Users can upload images (JPG, PNG, GIF, WebP)
- ✅ Users can upload PDF files
- ✅ File size limit (10MB) is enforced
- ✅ Images display as inline previews
- ✅ PDFs show as downloadable links
- ✅ Messages show author name and timestamp
- ✅ Real-time updates work across multiple clients
- ✅ Messages and files persist after page refresh
- ✅ Combined text + file posts work correctly

---

## Additional Testing Notes

### Browser Compatibility

Test in multiple browsers:

- Chrome/Edge (recommended)
- Firefox
- Safari

### Mobile Responsiveness

While not required for F02, the app should be accessible on mobile devices.

### Database Persistence

- All data (users, groups, messages, files) persists in Supabase
- Refresh the page to verify data is saved
- Log out and log back in to verify data persistence

### File Storage

- Files are stored in Supabase Storage bucket: `group-files`
- Files are organized by group ID
- Public URLs are generated for file access

---

## Known Limitations (F02 Sprint)

These are acceptable for F02 and will be addressed in F03:

- PDF thumbnails not generated (shows link instead)
- Upload progress bar not implemented (only shows disabled state)
- Some ESLint warnings present (not affecting functionality)
- Image optimization warnings (using `<img>` instead of Next.js `<Image>`)

---

## Troubleshooting

### "Unauthorized" Errors

- Make sure you're logged in
- Try logging out and logging back in
- Check that Supabase environment variables are set

### Files Not Uploading

- Ensure file is under 10MB
- Check file type is supported (images or PDF)
- Verify Supabase Storage bucket exists and is public

### Messages Not Appearing

- Refresh the page
- Check browser console for errors
- Verify Supabase Realtime is enabled

### Build/Deployment Issues

- Ensure all environment variables are set in Vercel
- Check build logs in Vercel dashboard
- Verify Supabase project is active

---

## Contact Information

For questions or issues during grading, please refer to:

- GitHub Repository: [Link to your repo]
- Project Board: [Link to your project board]
- Deployment URL: [Your Vercel URL]

---

## Summary Checklist for Graders

- [ ] User can sign up with email/password
- [ ] User can log in with credentials
- [ ] User can log out
- [ ] Session persists across refreshes
- [ ] User can create group chats
- [ ] Groups display on dashboard
- [ ] User can navigate to group detail page
- [ ] User can post text messages to notes board
- [ ] User can upload image files
- [ ] User can upload PDF files
- [ ] File size limit (10MB) is enforced
- [ ] Images display as previews
- [ ] PDFs show as download links
- [ ] Real-time updates work
- [ ] All data persists after refresh
