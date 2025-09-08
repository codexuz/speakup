import { VoiceRecorder } from "capacitor-voice-recorder";
import { Preferences } from "@capacitor/preferences";

// Recording Controls
export async function startRecording() {
  try {
    const permission = await VoiceRecorder.requestAudioRecordingPermission();
    console.log("Permission status:", permission);

    if (permission.value) {
      await VoiceRecorder.startRecording();
      console.log("Recording started");
    } else {
      console.error("Permission denied for audio recording");
    }
  } catch (error) {
    console.error("Failed to start recording:", error);
  }
}

export function pauseRecording() {
  VoiceRecorder.pauseRecording();
  console.log("Recording paused");
}

export function resumeRecording() {
  VoiceRecorder.resumeRecording();
  console.log("Recording resumed");
}

export async function stopRecording() {
  try {
    const recording = await VoiceRecorder.stopRecording();

    if (!recording || !recording.value || !recording.value.recordDataBase64) {
      console.error("Recording is empty or null");
      throw new Error("No recording data received");
    }

    const base64Audio = recording.value.recordDataBase64;

    // Log the size of the base64 data to help with debugging
    console.log("Recording base64 length:", base64Audio.length);

    if (base64Audio.length === 0) {
      console.error("Recording data is empty");
      throw new Error("Recording data is empty");
    }

    const audioMimeType = recording.value.mimeType || "audio/mp4";
    const audioBase64String = `data:${audioMimeType};base64,${base64Audio}`;

    const audioBlob = await convertBase64ToBlob(audioBase64String);

    // Log the size of the blob to help with debugging
    console.log("Blob size:", audioBlob.size);

    if (audioBlob.size === 0) {
      console.error("Audio blob is empty");
      throw new Error("Converted audio blob is empty");
    }

    return audioBlob;
  } catch (error) {
    console.error("Failed to stop recording:", error);
    throw error; // Re-throw to handle in the calling function
  }
}

// Convert base64 to Blob
async function convertBase64ToBlob(base64String) {
  try {
    // Check if base64String is valid
    if (
      !base64String ||
      base64String.length === 0 ||
      !base64String.includes("base64")
    ) {
      console.error("Invalid base64 string:", base64String);
      throw new Error("Invalid base64 string");
    }

    // More robust way to convert base64 to blob
    const parts = base64String.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    console.log("Raw data length:", rawLength);

    if (rawLength === 0) {
      throw new Error("Decoded base64 data is empty");
    }

    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  } catch (error) {
    console.error("Failed to convert base64 to blob:", error);
    throw error;
  }
}
