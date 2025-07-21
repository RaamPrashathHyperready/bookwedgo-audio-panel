"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function AudioPlayer({ audioKey, duration }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef(null)

  const loadAudio = async () => {
    if (audioLoaded || loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/audio/${encodeURIComponent(audioKey)}`)
      const blob = await response.blob()
      const audioUrl = URL.createObjectURL(blob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        setAudioLoaded(true)
      }
    } catch (error) {
      console.error("Error loading audio:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePlayPause = async () => {
    if (!audioLoaded) {
      await loadAudio()
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", () => setIsPlaying(false))

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", () => setIsPlaying(false))
      }
    }
  }, [audioLoaded])

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlayPause}
        disabled={loading}
        className="h-8 w-8 p-0 bg-transparent"
      >
        {loading ? (
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        ) : isPlaying ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 min-w-0">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
            disabled={!audioLoaded}
          />
          <span className="text-xs text-gray-500 min-w-0">{formatTime(duration)}</span>
        </div>
      </div>

      <Volume2 className="h-3 w-3 text-gray-400" />

      <audio ref={audioRef} preload="none" />
    </div>
  )
}
