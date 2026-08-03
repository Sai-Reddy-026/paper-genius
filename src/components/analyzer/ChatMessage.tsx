import { useState } from "react";
import {
  BadgeCheck,
  BrainCircuit,
  ChevronDown,
  Clock,
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatTime, type ChatMessageData } from "@/lib/analyzer";
import { Markdown } from "./Markdown";
import { CitationCard, SourceCard } from "./CitationCard";

export function ChatMessage({
  message,
  onRegenerate,
}: {
  message: ChatMessageData;
  onRegenerate: () => void;
}) {
  const [contextOpen, setContextOpen] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="animate-message-in flex justify-end gap-3">
        <div className="max-w-[85%] sm:max-w-[70%]">
          <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-[0.95rem] leading-relaxed text-primary-foreground shadow-lg">
            {message.content}
          </div>
          <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTime(message.createdAt)}
          </p>
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-card">
          <User className="h-4 w-4 text-muted-foreground" />
        </span>
      </div>
    );
  }

  return (
    <div className="animate-message-in flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-brand text-brand-foreground shadow-md">
        <BrainCircuit className="h-4 w-4" />
      </span>
      <div className="min-w-0 max-w-[92%] flex-1">
        <div className="glass rounded-2xl rounded-tl-md p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Answer
            </span>
            {message.confidence !== undefined && (
              <Badge variant="secondary" className="gap-1 text-[11px]">
                <BadgeCheck className="h-3 w-3 text-chart-5" />
                Confidence {Math.round(message.confidence * 100)}%
              </Badge>
            )}
            <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(message.createdAt)}
            </span>
          </div>

          <Markdown content={message.content} />

          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div>
                <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Source documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {message.citations.map((citation) => (
                    <SourceCard key={citation.id} citation={citation} />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setContextOpen((value) => !value)}
                className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", contextOpen && "rotate-180")}
                />
                Retrieved context ({message.citations.length})
              </button>
              {contextOpen && (
                <div className="animate-message-in grid gap-2 sm:grid-cols-2">
                  {message.citations.map((citation) => (
                    <CitationCard key={citation.id} citation={citation} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1">
          <ActionButton
            label="Copy"
            icon={Copy}
            onClick={() => {
              void navigator.clipboard?.writeText(message.content);
              toast.success("Answer copied to clipboard");
            }}
          />
          <ActionButton label="Regenerate" icon={RefreshCw} onClick={onRegenerate} />
          <ActionButton
            label="Like"
            icon={ThumbsUp}
            active={vote === "up"}
            onClick={() => {
              setVote("up");
              toast.success("Thanks for the feedback");
            }}
          />
          <ActionButton
            label="Dislike"
            icon={ThumbsDown}
            active={vote === "down"}
            onClick={() => {
              setVote("down");
              toast("Feedback noted — we'll improve retrieval");
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  active,
}: {
  label: string;
  icon: typeof Copy;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "h-8 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground",
        active && "text-primary",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

export function TypingIndicator() {
  return (
    <div className="animate-message-in flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-brand text-brand-foreground shadow-md">
        <BrainCircuit className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="glass inline-flex items-center gap-2 rounded-2xl rounded-tl-md px-4 py-3">
          <span className="text-xs text-muted-foreground">Analyzing your documents</span>
          <span className="flex gap-1">
            <Dot delay="0s" />
            <Dot delay="0.2s" />
            <Dot delay="0.4s" />
          </span>
        </div>
        <div className="glass space-y-2 rounded-2xl p-4">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="animate-dot h-1.5 w-1.5 rounded-full bg-primary"
      style={{ animationDelay: delay }}
    />
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        className,
      )}
    />
  );
}
