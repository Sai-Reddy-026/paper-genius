import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyzerSidebar } from "@/components/analyzer/AnalyzerSidebar";
import { Navbar } from "@/components/analyzer/Navbar";
import { ChatMessage, TypingIndicator } from "@/components/analyzer/ChatMessage";
import { ChatComposer } from "@/components/analyzer/ChatComposer";
import { AnalyzerPanel } from "@/components/analyzer/AnalyzerPanel";
import { EmptyState } from "@/components/analyzer/EmptyState";
import { UploadCard, ImagePreviewCard } from "@/components/analyzer/UploadCard";
import { UploadDropzone } from "@/components/analyzer/UploadDropzone";
import {
  kindFromName,
  sampleAnswer,
  sampleCitations,
  seedDocs,
  seedMessages,
  typeLabel,
  type ChatMessageData,
  type UploadedDoc,
} from "@/lib/analyzer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Question Paper Analyzer | PaperMind AI" },
      {
        name: "description",
        content:
          "Upload previous question papers, notes and textbooks, then ask questions and get AI answers grounded only in your documents.",
      },
      { property: "og:title", content: "AI Question Paper Analyzer | PaperMind AI" },
      {
        property: "og:description",
        content:
          "A premium AI workspace for analyzing question papers, notes and textbooks with cited, document-grounded answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [docs, setDocs] = useState<UploadedDoc[]>(seedDocs);
  const [messages, setMessages] = useState<ChatMessageData[]>(seedMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState("c1");
  const [uploadOpen, setUploadOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const imageDocs = useMemo(() => docs.filter((doc) => doc.kind === "image"), [docs]);
  const fileDocs = useMemo(() => docs.filter((doc) => doc.kind !== "image"), [docs]);

  function addFiles(files: File[]) {
    if (files.length === 0) return;
    const added = files.map<UploadedDoc>((file) => {
      const kind = kindFromName(file.name);
      return {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        kind,
        typeLabel: typeLabel(kind),
        uploadedAt: new Date(),
        pages: kind === "image" ? 1 : Math.max(1, Math.round(file.size / 42000) || 6),
        previewUrl: kind === "image" ? URL.createObjectURL(file) : undefined,
      };
    });
    setDocs((current) => [...added, ...current]);
    toast.success(
      `${added.length} file${added.length > 1 ? "s" : ""} added to your knowledge base`,
    );
  }

  function respond() {
    setLoading(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: sampleAnswer,
          createdAt: new Date(),
          confidence: 0.89,
          citations: sampleCitations,
        },
      ]);
      setLoading(false);
    }, 1600);
  }

  function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: "user", content: text, createdAt: new Date() },
    ]);
    setInput("");
    respond();
  }

  const hasDocs = docs.length > 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AnalyzerSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((value) => !value)}
        docs={docs}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onNewChat={() => {
          setMessages([]);
          toast.success("Started a new chat");
        }}
        onUpload={() => setUploadOpen(true)}
        search={search}
        onSearch={setSearch}
      />

      <div className="ambient-glow flex min-w-0 flex-1 flex-col">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
          onTogglePanel={() => setPanelOpen((value) => !value)}
          panelOpen={panelOpen}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          docCount={docs.length}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-5">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl">
                <span className="gradient-text">AI Question Paper Analyzer</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Upload previous question papers, notes, and textbooks. Ask questions and receive
                AI-powered answers based only on your uploaded documents.
              </p>
            </div>

            {!hasDocs ? (
              <div className="mt-6">
                <EmptyState onFiles={addFiles} />
              </div>
            ) : (
              <>
                <Tabs defaultValue="documents" className="mt-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="documents" className="flex-1">
                      Documents ({fileDocs.length})
                    </TabsTrigger>
                    <TabsTrigger value="images" className="flex-1">
                      Paper images ({imageDocs.length})
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex-1">
                      Add files
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents" className="mt-3 grid gap-2 sm:grid-cols-2">
                    {fileDocs.map((doc) => (
                      <UploadCard
                        key={doc.id}
                        doc={doc}
                        onDelete={() => {
                          setDocs((current) => current.filter((item) => item.id !== doc.id));
                          toast("Document removed");
                        }}
                      />
                    ))}
                    {fileDocs.length === 0 && (
                      <p className="text-xs text-muted-foreground">No documents yet.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="images" className="mt-3 grid gap-2 sm:grid-cols-3">
                    {imageDocs.map((doc) => (
                      <ImagePreviewCard
                        key={doc.id}
                        doc={doc}
                        onDelete={() => {
                          setDocs((current) => current.filter((item) => item.id !== doc.id));
                          toast("Image removed");
                        }}
                      />
                    ))}
                    {imageDocs.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Upload a photo of a handwritten or printed paper.
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="upload" className="mt-3">
                    <UploadDropzone onFiles={addFiles} compact />
                  </TabsContent>
                </Tabs>

                <div className="mt-8 space-y-6">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} onRegenerate={respond} />
                  ))}
                  {loading && <TypingIndicator />}
                  {messages.length === 0 && !loading && (
                    <p className="text-center text-sm text-muted-foreground">
                      Ask your first question about these documents.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={send}
          onFiles={addFiles}
          loading={loading}
        />
      </div>

      <AnalyzerPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        paperCount={docs.length}
      />

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload documents</DialogTitle>
          </DialogHeader>
          <UploadDropzone
            onFiles={(files) => {
              addFiles(files);
              setUploadOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
