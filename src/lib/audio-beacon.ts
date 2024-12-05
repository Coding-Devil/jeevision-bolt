export const playDirectionalSound = (direction: 'left' | 'right' | 'center') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const stereoPanner = audioContext.createStereoPanner();

  stereoPanner.pan.value = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
  oscillator.connect(stereoPanner).connect(gainNode).connect(audioContext.destination);
  
  oscillator.start();
  setTimeout(() => oscillator.stop(), 200);
}; 