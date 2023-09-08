import multer from "multer";

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const file_path = './public/assets/upload'
        cb(null, file_path);
    },
    filename: function (req, file, cb) {
        const file_name = Date.now() + '_' + file.originalname;
        cb(null, file_name);
    }
});

// Multer Filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
};



const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;

