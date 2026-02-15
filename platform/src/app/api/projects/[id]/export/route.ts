
import { auth } from "@/auth";
import { getProject } from "@/lib/projects";
import { getProjectFiles } from "@/lib/files";
import AdmZip from "adm-zip";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    // Use our updated logic that allows Public access
    const project = await getProject(projectId, userId);

    if (!project) {
        return new NextResponse("Project not found or access denied", { status: 404 });
    }

    const files = await getProjectFiles(projectId);

    try {
        const zip = new AdmZip();

        // Add files to zip
        files.forEach((file) => {
            // Remove leading slash if present to avoid zip issues
            const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
            zip.addFile(cleanPath, Buffer.from(file.content, "utf-8"));
        });

        const zipBuffer = zip.toBuffer();

        return new Response(zipBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip"`,
            },
        });
    } catch (error) {
        console.error("Export Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
