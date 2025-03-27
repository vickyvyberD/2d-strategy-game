const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Create sounds directory if it doesn't exist
const soundsDir = path.join(__dirname, 'sounds');
if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir);
}

// Function to generate a WAV file using SoX
function generateSound(filename, type) {
    const outputPath = path.join(soundsDir, filename);
    let command;

    switch (type) {
        case 'menu-music':
            // Generate a soft, looping background music
            command = `sox -n "${outputPath}" synth 3 sine 440 sine 880 gain -20 fade 0 3 1`;
            break;
        case 'button-click':
            // Generate a short click sound
            command = `sox -n "${outputPath}" synth 0.1 sine 880 fade 0 0.1 0.05 gain -10`;
            break;
        case 'move':
            // Generate a movement sound
            command = `sox -n "${outputPath}" synth 0.2 sine 660 fade 0 0.2 0.1`;
            break;
        case 'attack':
            // Generate an attack sound
            command = `sox -n "${outputPath}" synth 0.3 square 220 fade 0 0.3 0.1 gain -10`;
            break;
        case 'purchase':
            // Generate a purchase sound
            command = `sox -n "${outputPath}" synth 0.2 sine 1000 fade 0 0.2 0.1`;
            break;
        default:
            // Generate a simple beep as fallback
            command = `sox -n "${outputPath}" synth 0.1 sine 440`;
    }

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating ${filename}:`, error);
                reject(error);
            } else {
                console.log(`Generated ${filename}`);
                resolve();
            }
        });
    });
}

// Generate all required sound files
async function generateAllSounds() {
    const sounds = [
        { name: 'menu-music.wav', type: 'menu-music' },
        { name: 'button-click.wav', type: 'button-click' },
        { name: 'move.wav', type: 'move' },
        { name: 'attack.wav', type: 'attack' },
        { name: 'purchase.wav', type: 'purchase' }
    ];

    try {
        for (const sound of sounds) {
            await generateSound(sound.name, sound.type);
        }
        console.log('All sound files generated successfully!');
    } catch (error) {
        console.error('Error generating sound files:', error);
    }
}

// Run the generation
generateAllSounds(); 