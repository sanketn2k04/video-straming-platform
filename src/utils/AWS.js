import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { asyncHandler } from './asyncHandler.js';
import fs from "fs"
import path from 'path';

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    requestHandler: {
        // Set the connection timeout to 5 minutes (300000 milliseconds)
        connectionTimeout: 300000,
        // Set the socket timeout to 5 minutes (300000 milliseconds)
        socketTimeout: 300000
    }
});

export const uploadMp4ToS3 =async (file) => {
    try {
        if (!file) throw new Error("File parameter is missing!");

        // Assuming 'file' is the path to the file to upload
        const filePath = path.resolve(file); // Resolve the absolute path of the file

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        // Create a readable stream for the file
        const fileStream = fs.createReadStream(filePath);

        const uploadParams = {
            Bucket: process.env.RAW_VIDEO_BUCKET_NAME,
            Key: `videoFile/${path.basename(filePath)}`,
            Body: fileStream,
            ContentType: 'video/mp4',
        };

        // console.log("Upload parameters:", uploadParams);

        const command = new PutObjectCommand(uploadParams);
        const response = await s3Client.send(command);

        console.log(`Video uploded successfully on ${process.env.RAW_VIDEO_BUCKET_NAME}`);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${filePath}`, err.message);
            }
        });

        return response;

    } catch (error) {
        console.error("Error uploading file:", error.message);
        throw error;
    }
};

