"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clean voice hook:
 * - Handles mic capture (MediaStream)
 * - Waveform via Web Audio API AnalyserNode
 * - Speaking detection (RMS threshold)
 * - STT: prefers Web Speech API if present; falls back to /api/transcribe (server)
 *   by recording chunks via MediaRecorder (audio/webm).
 */
export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recChunksRef = useRef<BlobPart[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataArrRef = useRef<Uint8Array | null>(null);
  const speechRecRef = useRef<any>(null);

  const stopRAF = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const closeAudio = () => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
    streamRef.current = null;
    if (ctxRef.current) {
      // Close when safe; ignore failures
      ctxRef.current.close?.();
      ctxRef.current = null;
    }
    analyserRef.current = null;
    dataArrRef.current = null;
    stopRAF();
  };

  const loopDetect = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    if (!dataArrRef.current) {
      dataArrRef.current = new Uint8Array(analyser.fftSize);
    }
    analyser.getByteTimeDomainData(dataArrRef.current);
    // speaking detection via RMS-ish amplitude from 128 baseline:
    let sum = 0;
    const arr = dataArrRef.current;
    for (let i = 0; i < arr.length; i++) {
      const v = (arr[i] - 128) / 128; // -1..1
      sum += v * v;
    }
    const rms = Math.sqrt(sum / arr.length);
    setIsSpeaking(rms > 0.06); // tweakable threshold
    rafRef.current = requestAnimationFrame(loopDetect);
  };

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript("");
    if (typeof window === "undefined") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // MediaRecorder for fallback server STT
      recChunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data?.size > 0) recChunksRef.current.push(e.data);
      };
      mr.start();

      // WebAudio for waveform + speaking detect
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      analyserRef.current = analyser;
      loopDetect();

      // Start Web Speech API if available
      const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        rec.onresult = (ev: any) => {
          let txt = "";
          for (let i = ev.resultIndex; i < ev.results.length; i++) {
            txt += ev.results[i][0].transcript;
          }
          setTranscript(txt);
        };
        rec.onerror = () => {};
        rec.onend = () => {};
        rec.start();
        speechRecRef.current = rec;
      } else {
        speechRecRef.current = null; // server fallback will be used on stop
      }

      setIsRecording(true);
    } catch (e: any) {
      setError(e?.message ?? "Microphone access failed");
      closeAudio();
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;
    setIsRecording(false);
    // stop speech recognition
    try { speechRecRef.current?.stop?.(); } catch {}
    speechRecRef.current = null;

    // stop media recorder
    const mr = mediaRecorderRef.current;
    let audioBlob: Blob | null = null;
    if (mr && mr.state !== "inactive") {
      const done: Promise<Blob> = new Promise((res) => {
        mr.onstop = () => res(new Blob(recChunksRef.current, { type: "audio/webm" }));
      });
      mr.stop();
      audioBlob = await done;
    }

    closeAudio();

    // If transcript empty and we have blob, do server STT
    if (!transcript.trim() && audioBlob) {
      try {
        setIsTranscribing(true);
        const form = new FormData();
        form.append("file", audioBlob, "voice.webm");
        const r = await fetch("/api/transcribe", { method: "POST", body: form });
        const j = await r.json();
        setTranscript(j?.text ?? "");
      } catch (e: any) {
        setError(e?.message ?? "Transcription failed");
      } finally {
        setIsTranscribing(false);
      }
    }
  }, [isRecording, transcript]);

  useEffect(() => {
    return () => {
      try { speechRecRef.current?.stop?.(); } catch {}
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      closeAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRecording,
    isTranscribing,
    analyser: analyserRef.current,
    isSpeaking,
    transcript,
    error,
    startRecording,
    stopRecording,
  };
}