import multer from "multer";
import multerS3 from "multer-s3";
// import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// import { S3Client } from "@aws-sdk/client-s3";

// const bucket = process.env.BUCKET_NAME;
// const upload = multer({
//   storage: multerS3({
//     bucket: bucket,
//     acl: "public-read",
//     key: (req, file, cb) => {
//       cb(null, file.originalname);
//     },
//     s3: new S3Client({
//       credentials: {
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//         accessKeyId: process.env.ACCESS_KEY,
//       },
//       region: process.env.BUCKET_REGION,
//     }),
//     contentDisposition:'inline'
//   }),
// });
export default upload;
