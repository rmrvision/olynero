
import { Octokit } from "octokit";

export async function createGitHubRepo(accessToken: string, name: string, description?: string) {
    const octokit = new Octokit({ auth: accessToken });

    // 1. Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // 2. Create repo
    try {
        const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
            name: name.replace(/\s+/g, '-').toLowerCase(), // Simple slugify
            description: description || "Created with Olynero",
            private: true, // Default to private for safety
            auto_init: true, // Initialize with README to allow immediate pushing
        });

        return { success: true, repoUrl: repo.html_url, repoName: repo.full_name };
    } catch (error: any) {
        console.error("GitHub Create Repo Error:", error);
        throw new Error(error.response?.data?.message || "Failed to create GitHub repository");
    }
}

interface FileChange {
    path: string;
    content: string;
}

export async function pushToGitHub(accessToken: string, repoName: string, files: FileChange[], message: string) {
    const octokit = new Octokit({ auth: accessToken });
    const [owner, repo] = repoName.split('/');

    // 1. Get current commit (HEAD)
    // We need to find the default branch first
    const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;

    const { data: refData } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
    });
    const latestCommitSha = refData.object.sha;

    // 2. Get the tree of the latest commit
    const { data: commitData } = await octokit.rest.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    // 3. Create a new tree with changes
    const treeItems = files.map(file => ({
        path: file.path.startsWith('/') ? file.path.slice(1) : file.path,
        mode: "100644" as const, // standard file
        type: "blob" as const,
        content: file.content,
    }));

    const { data: newTree } = await octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: baseTreeSha,
        // @ts-ignore - Octokit types are sometimes strict about array vs const defaults
        tree: treeItems,
    });

    // 4. Create a new commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
        owner,
        repo,
        message,
        tree: newTree.sha,
        parents: [latestCommitSha],
    });

    // 5. Update the reference (HEAD)
    await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
        sha: newCommit.sha,
    });

    return { success: true, commitUrl: newCommit.html_url };
}
