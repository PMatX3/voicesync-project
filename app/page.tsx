"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link"; // Import Link for navigation

export default function Home() {
  const { session, loading } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast: toastHook } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        // Here we would upload the audio file to the server
        toast({
          title: "Recording saved",
          description: "Your voice note has been uploaded successfully.",
        });
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      // Stop recording after 3 minutes
      setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          stopRecording();
        }
      }, 180000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!text.trim()) return;

    try {
      // Here we would send the text to the server
      toast({
        title: "Text saved",
        description: "Your note has been uploaded successfully.",
      });
      setText("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your note. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-center">Loading...</h2>
        </Card>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 space-y-4 text-center">
          <h2 className="text-2xl font-bold">Please sign in to start recording</h2>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center">Record Your Thoughts</h1>
          <p className="text-center text-muted-foreground">
            Share your ideas through voice or text
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Voice Recording</h2>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
          {isRecording && (
            <p className="text-center text-sm text-muted-foreground">
              Recording... (max 3 minutes)
            </p>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Text Note</h2>
          <Textarea
            placeholder="Type your thoughts here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end">
            <Button onClick={handleTextSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
