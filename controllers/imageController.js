const Image = require('../models/image');
const { cloudinary } = require('../utils/cloudinary');
const User = require('../models/userModel');

exports.uploadImage = async (req, res) => {
    try {
        const image = new Image({
            user: req.user._id,
            fileUrl: req.file.path,
            publicId: req.file.filename,
        })

        await image.save();

        await User.findByIdAndUpdate(
            req.user._id,
            {$push: { images: image._id}}
        ) // ✅ Added closing parenthesis

        res.status(201).json({ message: 'Image uploaded', image });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed', details: err.message });
    }
};

exports.getUserImages = async (req, res) => {
    try {
        const images = await Image.find({ user: req.user._id });
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve images', details: err.message });
    }
};

exports.getImageById = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json(image);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve image', details: err.message });
    }
};

exports.setProfileImage = async (req, res) => {
    try {

        const imageId = req.params.id;

        await User.findByIdAndUpdate(req.user._id, { profileImage: imageId });
        res.status(200).json({ message: 'Profile image set' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to set profile image', details: err.message });
    }
};

exports.setCoverImage = async (req, res) => {
    try {

        const imageId = req.params.id;

        await User.findByIdAndUpdate(req.user._id, { coverImage: imageId });
        res.status(200).json({ message: 'Cover image set' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to set cover image', details: err.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        await cloudinary.uploader.destroy(image.publicId);

        await Image.findByIdAndDelete(image._id);

        await User.findByIdAndUpdate(req.user._id, { $pull: { images: image._id } });
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete image', details: err.message });
    }
};
