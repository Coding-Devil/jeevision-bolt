export const setupVoiceCommands = () => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (command.includes('capture')) {
        // Trigger capture
      } else if (command.includes('switch camera')) {
        // Switch camera
      } else if (command.includes('repeat')) {
        // Repeat last description
      }
    };
    return recognition;
  }
  return null;
}; 