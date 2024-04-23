cloudinary.v2.api
  .delete_resources(['cld-sample'], 
    { type: 'upload', resource_type: 'image' })
  .then(console.log);


  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }