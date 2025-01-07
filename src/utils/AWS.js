import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { asyncHandler } from './asyncHandler.js';

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    requestHandler: {
        // Set the connection timeout to 5 minutes (300000 milliseconds)
        connectionTimeout: 300000,
        // Set the socket timeout to 5 minutes (300000 milliseconds)
        socketTimeout: 300000
    }
});

export const uploadMp4ToS3 = asyncHandler(
    async (file) => {
        try {
            const uploadParams = {
                Bucket: 'sanket.dev',
                Key: `tempVideos`,
                Body: file,
                ContentType: 'video/mp4'
            };
    
            const command = new PutObjectCommand(uploadParams);
            const response = await s3Client.send(command);
            return response;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }
)
