// Simple script to generate placeholder sound files
const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '../assets/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
}

// Generate a simple WAV file (1 second of silence)
const generateSilentWav = () => {
    const sampleRate = 44100;
    const duration = 1; // seconds
    const numSamples = sampleRate * duration;
    
    const buffer = Buffer.alloc(44 + numSamples * 2); // 44 bytes header + 2 bytes per sample
    
    // WAV header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + numSamples * 2, 4); // File size - 8
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Format chunk size
    buffer.writeUInt16LE(1, 20); // Audio format (PCM)
    buffer.writeUInt16LE(1, 22); // Number of channels
    buffer.writeUInt32LE(sampleRate, 24); // Sample rate
    buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
    buffer.writeUInt16LE(2, 32); // Block align
    buffer.writeUInt16LE(16, 34); // Bits per sample
    buffer.write('data', 36);
    buffer.writeUInt32LE(numSamples * 2, 40); // Data chunk size
    
    return buffer;
};

// List of sound files to generate
const sounds = [
    'menu-music.wav',
    'button-click.wav',
    'move.wav',
    'attack.wav',
    'purchase.wav'
];

// Generate each sound file
sounds.forEach(sound => {
    const filePath = path.join(soundsDir, sound);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, generateSilentWav());
        console.log(`Generated ${sound}`);
    }
}); 