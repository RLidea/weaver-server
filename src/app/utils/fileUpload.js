const multer = require('multer');
const directoryHandler = require('@utils/directoryHandler');

const utils = {};
const uploadDir = './var/uploads';

utils.localStorage = (dir) => {
  const orgDir = `${uploadDir}/${dir}`;
  directoryHandler.findOrCreate(uploadDir);
  directoryHandler.findOrCreate(orgDir);
  const targetDir = directoryHandler.createMonthlyDir(orgDir);
  return multer({
    storage: multer.diskStorage({
      destination (req, file, cb) {
        cb(null, targetDir);
      },
      filename (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      },
    }),
  });
};

/*
  aws s3
 */
// const s3 = new AWS.S3();
// utils.s3Storage = (uploadDir) => {
//   return multer({
//     storage: multerS3({
//       s3,
//       bucket: 'ketsup-snackbar',
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       acl: 'public-read',
//       key: (req, file, cb) => {
//         const now = new Date();
//         const extension = file.mimetype.split('/')[1];
//         const filepath = `${uploadDir}/product_${formatter.unixTimestamp(now)}.${extension}`;
//         cb(null, filepath);
//       },
//     }),
//     limit: { fileSize: 5 * 1024 * 1024 },
//   });
// };

module.exports = utils;
