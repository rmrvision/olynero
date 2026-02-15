"use client";

import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalViewProps {
    onTerminalReady?: (terminal: Terminal) => void;
}

export function TerminalView({ onTerminalReady }: TerminalViewProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;

        if (onTerminalReady) {
            onTerminalReady(term);
        }

        const handleResize = () => {
            fitAddon.fit();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        };
    }, [onTerminalReady]);

    return <div ref={terminalRef} className="h-full w-full" />;
}
