import { useRef } from "react";
import { ArrowUp, ImagePlus, Mic, Paperclip, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFiles: (files: File[]) => void;
  loading: boolean;
}

export function ChatComposer({ value, onChange, onSend, onFiles, loading }: ChatComposerProps) {
  const docInput = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  return (
    <div className="border-t bg-background/70 px-3 py-3 backdrop-blur-xl sm:px-5">
      <div className="mx-auto max-w-3xl">
        <div className="glass-elevated rounded-3xl p-2 transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            rows={2}
            placeholder="Ask anything about your uploaded question papers..."
            className="max-h-40 min-h-[56px] resize-none border-0 bg-transparent px-3 py-2.5 text-[0.95rem] shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center gap-1 px-1 pb-0.5">
            <input
              ref={docInput}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(event) => {
                onFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
            <input
              ref={imageInput}
              type="file"
              multiple
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={(event) => {
                onFiles(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => docInput.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Documents</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => imageInput.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Voice input"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => toast("Voice input is a UI preview for now")}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              aria-label="Send message"
              disabled={loading || !value.trim()}
              onClick={onSend}
              className="ml-auto h-9 w-9 shrink-0 gradient-brand text-brand-foreground"
            >
              {loading ? <Square className="h-3.5 w-3.5" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Answers are generated only from your uploaded documents. Verify before exams.
        </p>
      </div>
    </div>
  );
}
