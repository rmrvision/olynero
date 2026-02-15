"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import dynamic from 'next/dynamic';

const Preview = dynamic(() => import('@/components/preview/preview-panel').then(mod => mod.Preview), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted-foreground">Initializing Environment...</div>
});

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState("// Generated code will appear here...");
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    setCode("// Olynero AI is thinking...");

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success("Mission Accomplished!");

        // Update files for preview
        if (data.artifacts) {
          setGeneratedFiles(data.artifacts);
        }

        const indexFile = data.artifacts?.find((f: any) => f.path.includes('index') || f.path.includes('App') || f.path.includes('page'));
        if (indexFile) {
          setCode(indexFile.content);
        } else {
          setCode("// Mission completed. Check preview.");
        }
      } else {
        toast.error("Agent failed: " + data.error);
        setCode("// Error: " + data.error);
      }
    } catch (e: any) {
      toast.error("Network error: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar Placeholder */}
      <div className="w-64 border-r bg-sidebar p-4 flex flex-col gap-4">
        <div className="font-bold text-xl text-primary">Olynero AI</div>
        <Button variant="ghost" className="justify-start">New Project</Button>
        <Button variant="ghost" className="justify-start">History</Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Helper Header */}
        <header className="h-14 border-b flex items-center px-4 gap-4 justify-between">
          <div className="font-semibold">Project: My First App</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Share</Button>
            <Button size="sm">Deploy</Button>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 grid grid-cols-2">
          {/* Editor Pane */}
          <div className="border-r flex flex-col">
            <div className="bg-muted/50 p-2 text-xs border-b">main.tsx</div>
            <div className="flex-1">
              <CodeEditor initialValue={code} />
            </div>
          </div>

          {/* Preview Pane */}
          <div className="flex flex-col relative h-full bg-slate-900 text-white">
            <Preview files={generatedFiles} />

            {/* Chat Overlay */}
            <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-10">
              <Card className="shadow-2xl border-white/10 bg-black/50 backdrop-blur-md text-white">
                <CardContent className="p-2 flex gap-2">
                  <Input
                    placeholder="Describe what you want to build..."
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent text-white placeholder:text-slate-400"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    disabled={isGenerating}
                  />
                  <Button size="sm" onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-500 text-white">
                    {isGenerating ? 'Thinking...' : 'Generate'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
