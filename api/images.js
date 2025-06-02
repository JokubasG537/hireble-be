const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const imageController = require('../controllers/imageController')
const authorizeRole = require('../middleware/authorizeRole')
const {uploadImage} = require('../utils/cloudinary')

router.post("/",
    authMiddleware,
    uploadImage.single('image'),
    imageController.uploadImage
) 

router.get("/",
    authMiddleware,
    authorizeRole("recruiter", "admin"),
    imageController.getUserImages
)

router.get("/:id",
    authMiddleware,
    imageController.getImageById
)

router.delete("/:id",
    authMiddleware,
    imageController.deleteImage
)

router.put("/:id/profile",
    authMiddleware,
    imageController.setProfileImage
)

router.put("/:id/cover",
    authMiddleware,
    imageController.setCoverImage
)

module.exports = router