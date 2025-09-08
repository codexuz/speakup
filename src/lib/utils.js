import { Preferences } from '@capacitor/preferences';
import { VoiceRecorder  } from 'capacitor-voice-recorder';
import { StatusBar } from '@capacitor/status-bar';





export const  translateSentence  = async (text) => {
    const ApiKey = 'trnsl.1.1.20240328T172133Z.800fbf38653eb71f.274911e5561765645d307633ea22ebddc2a2156e';
    const res = await fetch(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${ApiKey}&text=${text}&lang=en-uz`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    return data.text[0];
  }



  export const  translateUzb  = async (text) => {
    const ApiKey = 'trnsl.1.1.20240328T172133Z.800fbf38653eb71f.274911e5561765645d307633ea22ebddc2a2156e';
    const res = await fetch(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${ApiKey}&text=${text}&lang=uz-en`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    console.log(data)
    return data.text[0];
  }


  export async function startRecording() {
    try {
        const permission = await VoiceRecorder.requestAudioRecordingPermission();
        console.log(permission);
        if (permission.value) {
            await VoiceRecorder.startRecording();
        } else {
            console.error('Audio recording permission denied');
        }
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}


export async function stopRecording() {
    try {
        
            const recordingData = await VoiceRecorder.stopRecording();
            
            const base64Sound = recordingData.value.recordDataBase64;
            const mimeType = recordingData.value.mimeType;
            const base64 = `data:${mimeType};base64,${base64Sound}`;
            return base64
    } catch (error) {
        console.error('Error stopping or processing recording:', error);
    }
}




export const changeStatusBar = async (color) => {
  if(color === "main"){
    StatusBar.setBackgroundColor({
      color: "#070404"
    })
  }
  else if(color === "primary"){
    StatusBar.setBackgroundColor({
      color: "#070404"
    })
  }
  
}