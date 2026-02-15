import { FileNode } from "@/components/file-tree";

export function buildFileTree(files: { path: string }[]): FileNode[] {
    const root: FileNode[] = [];

    files.forEach(file => {
        const parts = file.path.split('/');
        let currentLevel = root;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const existingNode = currentLevel.find(node => node.name === part);

            if (existingNode) {
                if (existingNode.type === 'folder') {
                    currentLevel = existingNode.children!;
                }
            } else {
                const newNode: FileNode = {
                    id: file.path, // simplistic id
                    name: part,
                    type: isFile ? 'file' : 'folder',
                    path: isFile ? file.path : parts.slice(0, index + 1).join('/'),
                    children: isFile ? undefined : [],
                };
                currentLevel.push(newNode);
                if (!isFile) {
                    currentLevel = newNode.children!;
                }
            }
        });
    });

    // Sort folders first, then files
    const sortNodes = (nodes: FileNode[]) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            return a.type === 'folder' ? -1 : 1;
        });
        nodes.forEach(node => {
            if (node.children) {
                sortNodes(node.children);
            }
        });
    };

    sortNodes(root);
    return root;
}
