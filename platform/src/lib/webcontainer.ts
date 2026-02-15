import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer;

export const getWebContainer = async () => {
    if (!webcontainerInstance) {
        webcontainerInstance = await WebContainer.boot();
    }
    return webcontainerInstance;
};
