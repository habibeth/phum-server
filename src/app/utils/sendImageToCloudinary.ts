import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
    cloud_name: 'dg3pfilyl',
    api_key: '697594423442384',
    api_secret: 'PnCsPQm0K0nFx3LhdQ_u-LYUQwo' // Click 'View Credentials' below to copy your API secret
});

export const sendImageToCloudinary = async (imageName: string, path: string,): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName.trim() },
            function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result as UploadApiResponse);
                // delete a file asynchronously
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File is deleted.');
                    }
                });
            },
        );
    });
};

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// }); 

// console.log(autoCropUrl);
// }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })