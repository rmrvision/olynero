import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const db = new PrismaClient();

const s3Client = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "olynero-projects";

async function migrate() {
    console.log("Starting S3 Migration...");

    // Find files without s3Key but with content
    const files = await db.file.findMany({
        where: {
            s3Key: null,
            NOT: {
                content: { equals: "" } // Optional: skip empty files? No, keep them.
            }
        },
        take: 100 // Batch size
    });

    console.log(`Found ${files.length} files to migrate to S3...`);

    for (const file of files) {
        const s3Key = `projects/${file.projectId}/${file.path}`;
        try {
            console.log(`Uploading ${file.path}...`);
            await s3Client.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: file.content,
                ContentType: "text/plain",
            }));

            // Update DB
            await db.file.update({
                where: { id: file.id },
                data: { s3Key }
            });
            console.log(`Migrated ${file.path}`);
        } catch (e) {
            console.error(`Failed to migrate ${file.path}:`, e);
        }
    }

    console.log("Batch complete. Run again if more files exist.");
}

migrate()
    .catch(console.error)
    .finally(() => db.$disconnect());
