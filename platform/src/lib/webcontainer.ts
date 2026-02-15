import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: Promise<WebContainer> | undefined;

export const getWebContainerInstance = async () => {
    if (!webcontainerInstance) {
        webcontainerInstance = WebContainer.boot();
    }
    return webcontainerInstance;
};
