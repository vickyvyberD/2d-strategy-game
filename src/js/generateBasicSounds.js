// Function to generate a simple WAV file
function generateWAV(frequency, duration, volume = 0.3) {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const samples = new Float32Array(numSamples);
    
    // Generate samples
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume;
    }
    
    // Create WAV header
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    
    // Write WAV header
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(view, 0, 'RIFF');  // RIFF identifier
    view.setUint32(4, 36 + samples.length * 2, true);  // File length
    writeString(view, 8, 'WAVE');  // WAVE identifier
    writeString(view, 12, 'fmt ');  // fmt chunk
    view.setUint32(16, 16, true);  // fmt chunk size
    view.setUint16(20, 1, true);  // Audio format (1 = PCM)
    view.setUint16(22, 1, true);  // Number of channels
    view.setUint32(24, sampleRate, true);  // Sample rate
    view.setUint32(28, sampleRate * 2, true);  // Byte rate
    view.setUint16(32, 2, true);  // Block align
    view.setUint16(34, 16, true);  // Bits per sample
    writeString(view, 36, 'data');  // data chunk
    view.setUint32(40, samples.length * 2, true);  // data chunk size
    
    // Write audio data
    for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    return buffer;
}

// Function to save buffer as WAV file
function saveWAV(buffer, filename) {
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Generate and save sound files
function generateGameSounds() {
    // Menu music (longer, lower frequency)
    const menuMusic = generateWAV(440, 3, 0.2);
    saveWAV(menuMusic, 'menu-music.wav');

    // Button click (short, high frequency)
    const buttonClick = generateWAV(880, 0.1, 0.2);
    saveWAV(buttonClick, 'button-click.wav');

    // Move sound (medium duration, medium frequency)
    const moveSound = generateWAV(660, 0.2, 0.2);
    saveWAV(moveSound, 'move.wav');

    // Attack sound (short, low frequency)
    const attackSound = generateWAV(220, 0.3, 0.3);
    saveWAV(attackSound, 'attack.wav');

    // Purchase sound (short, high frequency)
    const purchaseSound = generateWAV(1000, 0.2, 0.2);
    saveWAV(purchaseSound, 'purchase.wav');

    // Show success message
    const instructions = document.getElementById('instructions');
    if (instructions) {
        instructions.innerHTML = `
            <p>✅ Sound files generated! Please move the downloaded files to the src/sounds directory and refresh the page.</p>
            <p style="font-size: 0.9em; margin-top: 10px;">
                The files should be placed in: ${window.location.origin}/sounds/
            </p>
        `;
        instructions.style.backgroundColor = '#d4edda';
        instructions.style.color = '#155724';
    }
}

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateSounds');
    if (generateButton) {
        generateButton.onclick = generateGameSounds;
    }
}); 