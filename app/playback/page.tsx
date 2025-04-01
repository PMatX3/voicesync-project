"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Play, Pause, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

// Mock data - replace with actual API calls
const mockRecordings = [
  {
    id: 1,
    title: "Project Update",
    type: "voice",
    duration: "2:30",
    createdAt: new Date(2024, 2, 15),
    summary: "Discussion about Q2 goals and team alignment.",
  },
  {
    id: 2,
    title: "Strategic Planning",
    type: "text",
    createdAt: new Date(2024, 2, 14),
    summary: "Long-term vision for product development and market expansion.",
  },
]

export default function Playback() {
  const { data: session } = useSession()
  const [playing, setPlaying] = useState<number | null>(null)

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-center">Please sign in</h2>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center">Your Recordings</h1>
          <p className="text-center text-muted-foreground">
            Listen to your past recordings and notes
          </p>
        </div>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <div className="space-y-4">
            {mockRecordings.map((recording) => (
              <Card key={recording.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{recording.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(recording.createdAt, "PPP")}
                      {recording.duration && (
                        <span className="ml-2">• {recording.duration}</span>
                      )}
                    </div>
                  </div>
                  {recording.type === "voice" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPlaying(playing === recording.id ? null : recording.id)}
                    >
                      {playing === recording.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {recording.summary}
                </p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}