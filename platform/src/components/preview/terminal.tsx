import { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

interface TerminalProps {
    className?: string;
    onMount?: (terminal: Terminal) => void;
}

export const TerminalView: React.FC<TerminalProps> = ({ className, onMount }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        const terminal = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
            },
            fontSize: 12,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = terminal;

        if (onMount) onMount(terminal);

        return () => {
            terminal.dispose();
        };
    }, []);

    return <div ref={terminalRef} className={className} style={{ width: '100%', height: '100%' }} />;
};
