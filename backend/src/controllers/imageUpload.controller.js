const { toFile } = require("@imagekit/nodejs")
const imagekit = require("../config/imagekit")

const uploadImage = async (req, res) => {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
        return res.status(400).json({
            message: "Image not found"
        });
    }

    const uploadedImages = await Promise.all(files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const response = await imagekit.files.upload({
            file: await toFile(file.buffer, fileName, { type: file.mimetype }),
            fileName,
            folder: "/ShopSphere"
        });

        return {
            url: response.url,
            fieldId: response.fileId
        };
    }));

    return res.status(200).json({
        message: "Image upload Successfully",
        image: uploadedImages[0],
        images: uploadedImages
    });
};

module.exports = uploadImage