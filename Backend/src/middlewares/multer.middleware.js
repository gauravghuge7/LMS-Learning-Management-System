import path from 'path';
import multer from 'multer';    


// const upload = multer({
//     destination: "../../uploads",
//     limits: {fileSize: 1024 * 1024 * 30},
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, path.join(path, '../../uploads'));
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//         }
//     })
// });

// export default upload;









// hitesh sir upload code into the main content


// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }

// })
//    const upload = multer({
//     dest: "../../uploads",
//     limits: { fileSize: 1024 * 1024 * 30 },

//     storage, 
// })

// export default upload;



const upload = multer({
  dest: "./uploads/ ",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb in size max limit

  storage: multer.diskStorage({
    destination: "./uploads/",
    
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),

  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".mp4"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }

    cb(null, true);
  },

});

export default upload;