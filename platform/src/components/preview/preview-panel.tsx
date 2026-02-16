import React, { useEffect, useRef, useState } from 'react';
import { TerminalView } from './terminal';
import { Terminal } from 'xterm';
import { WebContainer } from '@webcontainer/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PreviewProps {
    webContainer: WebContainer | null;
    serverUrl: string | null;
}

export const Preview: React.FC<PreviewProps> = ({ webContainer, serverUrl }) => {
    const terminalRef = useRef<Terminal | null>(null);




    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
            {/* Toolbar */}
            <div className="h-10 border-b border-slate-700 bg-slate-900 flex items-center px-4 justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${serverUrl ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    {serverUrl || "Запуск окружения..."}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 relative bg-white">
                {!serverUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-500 gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        <span>Ожидание сервера...</span>
                    </div>
                )}
                {serverUrl && (
                    <iframe src={serverUrl} className="w-full h-full border-none" />
                )}
            </div>

            {/* Terminal Panel */}
            <div className="h-48 border-t border-slate-700 bg-black p-2">
                <TerminalView onTerminalReady={(term) => { terminalRef.current = term; }} />
            </div>
        </div>
    );
};
