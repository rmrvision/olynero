
import { auth } from "@/auth";
import { getProject, updateProjectVisibility } from "@/lib/projects"; // We might need a new updateProjectGithubRepo function
import { getProjectFiles } from "@/lib/files";
import { createGitHubRepo, pushToGitHub } from "@/lib/github";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Identify user's GitHub access token
    // This is tricky with NextAuth v5. usually it's in the account.
    // We need to fetch the Account record for this user and provider="github"
    const account = await db.account.findFirst({
        where: {
            userId: session.user.id,
            provider: "github",
        },
    });

    if (!account || !account.access_token) {
        return new NextResponse("GitHub account not linked or missing access token", { status: 400 });
    }

    const { access_token } = account;

    const project = await getProject(projectId, session.user.id);

    if (!project) {
        return new NextResponse("Project not found", { status: 404 });
    }

    const files = await getProjectFiles(projectId);
    const fileChanges = files.map(f => ({ path: f.path, content: f.content }));

    try {
        let repoName = project.githubRepo;
        let message = "Sync from Olynero";

        if (!repoName) {
            // Create Repo
            const { repoName: newRepoName } = await createGitHubRepo(access_token, project.name, project.description || undefined);
            repoName = newRepoName;

            // Save to DB
            await db.project.update({
                where: { id: projectId },
                data: { githubRepo: repoName },
            });
            message = "Initial commit from Olynero";
        }

        // Push Changes
        if (files.length > 0) {
            const result = await pushToGitHub(access_token, repoName, fileChanges, message);
            return NextResponse.json({ success: true, repoName, commitUrl: result.commitUrl });
        } else {
            return NextResponse.json({ success: true, repoName, message: "No files to push" });
        }

    } catch (error: any) {
        console.error("GitHub Sync Error:", error);
        return new NextResponse(error.message || "Failed to sync with GitHub", { status: 500 });
    }
}
