import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ambientSoundConfigs, 
  getDominantSound, 
  getMatchingSounds,
  type AmbientSoundConfig 
} from '@/data/soundConfigs';

interface SoundLayerInstance {
  oscillator?: OscillatorNode;
  noiseSource?: AudioBufferSourceNode;
  gainNode: GainNode;
  filterNode?: BiquadFilterNode;
  lfo?: OscillatorNode;
  lfoGain?: GainNode;
}

interface ActiveSound {
  config: AmbientSoundConfig;
  layers: SoundLayerInstance[];
  masterGain: GainNode;
}

export function useAmbientSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSoundsRef = useRef<Map<string, ActiveSound>>(new Map());
  const globalGainRef = useRef<GainNode | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentSoundIds, setCurrentSoundIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const createNoiseBuffer = useCallback((audioContext: AudioContext, duration: number = 2): AudioBuffer => {
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }, []);

  const initAudioContext = useCallback(() => {
    if (audioContextRef.current) return;
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    globalGainRef.current = audioContextRef.current.createGain();
    globalGainRef.current.gain.value = isMuted ? 0 : volume;
    globalGainRef.current.connect(audioContextRef.current.destination);
    
    setIsInitialized(true);
  }, [isMuted, volume]);

  const createSoundLayer = useCallback((
    audioContext: AudioContext,
    layer: any,
    noiseBuffer: AudioBuffer,
    output: GainNode
  ): SoundLayerInstance => {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    
    let filterNode: BiquadFilterNode | undefined;
    if (layer.filter) {
      filterNode = audioContext.createBiquadFilter();
      filterNode.type = layer.filter.type;
      filterNode.frequency.value = layer.filter.frequency;
      if (layer.filter.Q !== undefined) {
        filterNode.Q.value = layer.filter.Q;
      }
      gainNode.connect(filterNode);
      filterNode.connect(output);
    } else {
      gainNode.connect(output);
    }
    
    let lfo: OscillatorNode | undefined;
    let lfoGain: GainNode | undefined;
    if (layer.modulation?.type === 'lfo' && layer.modulation.frequency !== undefined) {
      lfo = audioContext.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = layer.modulation.frequency;
      
      lfoGain = audioContext.createGain();
      lfoGain.gain.value = layer.volume * (layer.modulation.depth || 0.5);
      
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();
    }
    
    let oscillator: OscillatorNode | undefined;
    let noiseSource: AudioBufferSourceNode | undefined;
    
    if (layer.type === 'noise') {
      noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      noiseSource.connect(gainNode);
      noiseSource.start();
    } else {
      oscillator = audioContext.createOscillator();
      oscillator.type = layer.type;
      oscillator.frequency.value = layer.frequency;
      oscillator.connect(gainNode);
      oscillator.start();
    }
    
    return { oscillator, noiseSource, gainNode, filterNode, lfo, lfoGain };
  }, []);

  const startSound = useCallback((soundId: string, fadeInDuration: number = 1.5) => {
    if (!audioContextRef.current || !globalGainRef.current) return;
    
    if (activeSoundsRef.current.has(soundId)) return;
    
    const config = ambientSoundConfigs[soundId];
    if (!config) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const masterGain = audioContextRef.current.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(globalGainRef.current);
    
    const noiseBuffer = createNoiseBuffer(audioContextRef.current);
    const layers: SoundLayerInstance[] = [];
    
    for (const layerConfig of config.layers) {
      const layer = createSoundLayer(audioContextRef.current, layerConfig, noiseBuffer, masterGain);
      layers.push(layer);
      
      const targetVolume = layerConfig.volume * config.masterVolume;
      layer.gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        audioContextRef.current.currentTime + fadeInDuration
      );
    }
    
    masterGain.gain.linearRampToValueAtTime(
      1,
      audioContextRef.current.currentTime + fadeInDuration
    );
    
    activeSoundsRef.current.set(soundId, { config, layers, masterGain });
    setCurrentSoundIds(Array.from(activeSoundsRef.current.keys()));
    setIsPlaying(true);
  }, [createNoiseBuffer, createSoundLayer]);

  const stopSound = useCallback((soundId: string, fadeOutDuration: number = 1) => {
    if (!audioContextRef.current) return;
    
    const activeSound = activeSoundsRef.current.get(soundId);
    if (!activeSound) return;
    
    const { layers, masterGain } = activeSound;
    
    masterGain.gain.linearRampToValueAtTime(
      0,
      audioContextRef.current.currentTime + fadeOutDuration
    );
    
    setTimeout(() => {
      layers.forEach(layer => {
        try {
          layer.oscillator?.stop();
          layer.oscillator?.disconnect();
          layer.noiseSource?.stop();
          layer.noiseSource?.disconnect();
          layer.lfo?.stop();
          layer.lfo?.disconnect();
          layer.lfoGain?.disconnect();
          layer.filterNode?.disconnect();
          layer.gainNode.disconnect();
        } catch (e) {
          // ignore cleanup errors
        }
      });
      
      try {
        masterGain.disconnect();
      } catch (e) {
        // ignore
      }
      
      activeSoundsRef.current.delete(soundId);
      setCurrentSoundIds(Array.from(activeSoundsRef.current.keys()));
      
      if (activeSoundsRef.current.size === 0) {
        setIsPlaying(false);
      }
    }, fadeOutDuration * 1000);
  }, []);

  const stopAllSounds = useCallback((fadeOutDuration: number = 1) => {
    const soundIds = Array.from(activeSoundsRef.current.keys());
    soundIds.forEach(id => stopSound(id, fadeOutDuration));
  }, [stopSound]);

  const transitionToSounds = useCallback((newSoundIds: string[], transitionDuration: number = 1.5) => {
    const currentIds = Array.from(activeSoundsRef.current.keys());
    
    const soundsToStop = currentIds.filter(id => !newSoundIds.includes(id));
    const soundsToStart = newSoundIds.filter(id => !currentIds.includes(id));
    
    soundsToStop.forEach(id => stopSound(id, transitionDuration));
    
    setTimeout(() => {
      soundsToStart.forEach(id => startSound(id, transitionDuration));
    }, transitionDuration * 300);
  }, [stopSound, startSound]);

  const updateForLocation = useCallback((tags: string[]) => {
    if (!isInitialized) {
      initAudioContext();
    }
    
    const matchingSounds = getMatchingSounds(tags);
    transitionToSounds(matchingSounds);
  }, [isInitialized, initAudioContext, transitionToSounds]);

  const setGlobalVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (globalGainRef.current && !isMuted) {
      globalGainRef.current.gain.linearRampToValueAtTime(
        clampedVolume,
        audioContextRef.current?.currentTime || 0 + 0.1
      );
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    if (globalGainRef.current && audioContextRef.current) {
      globalGainRef.current.gain.linearRampToValueAtTime(
        newMuted ? 0 : volume,
        audioContextRef.current.currentTime + 0.3
      );
    }
  }, [isMuted, volume]);

  const togglePlay = useCallback(() => {
    if (!isInitialized) {
      initAudioContext();
      return;
    }
    
    if (isPlaying) {
      stopAllSounds();
    } else if (currentSoundIds.length > 0) {
      currentSoundIds.forEach(id => startSound(id));
    }
  }, [isInitialized, initAudioContext, isPlaying, currentSoundIds, stopAllSounds, startSound]);

  useEffect(() => {
    return () => {
      stopAllSounds(0.5);
      setTimeout(() => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      }, 600);
    };
  }, [stopAllSounds]);

  const getCurrentSoundConfigs = useCallback((): AmbientSoundConfig[] => {
    return currentSoundIds
      .map(id => ambientSoundConfigs[id])
      .filter(Boolean);
  }, [currentSoundIds]);

  return {
    isPlaying,
    isMuted,
    volume,
    isInitialized,
    currentSoundIds,
    currentSounds: getCurrentSoundConfigs(),
    initAudioContext,
    updateForLocation,
    startSound,
    stopSound,
    stopAllSounds,
    transitionToSounds,
    setVolume: setGlobalVolume,
    toggleMute,
    togglePlay,
    getDominantSound,
    getMatchingSounds
  };
}
