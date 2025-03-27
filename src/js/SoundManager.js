export class SoundManager {
    constructor() {
        this.sounds = {};
        this.initialized = false;
        this.baseUrl = window.location.origin; // Get the current server URL
    }

    async init() {
        if (this.initialized) return;

        const soundFiles = {
            'menu-music': `${this.baseUrl}/sounds/menu-music.wav`,
            'button-click': `${this.baseUrl}/sounds/button-click.wav`,
            'move': `${this.baseUrl}/sounds/move.wav`,
            'attack': `${this.baseUrl}/sounds/attack.wav`,
            'purchase': `${this.baseUrl}/sounds/purchase.wav`
        };

        // Create Audio objects for each sound
        for (const [name, path] of Object.entries(soundFiles)) {
            try {
                console.log(`Loading sound: ${name} from path: ${path}`);
                const audio = new Audio(path);
                audio.volume = 0.3;
                
                // Add event listeners for debugging
                audio.addEventListener('canplaythrough', () => {
                    console.log(`Sound loaded successfully: ${name}`);
                });
                
                audio.addEventListener('error', (e) => {
                    console.error(`Error loading sound ${name}:`, e.target.error);
                });

                if (name === 'menu-music') {
                    audio.loop = true;
                }
                
                this.sounds[name] = audio;
            } catch (err) {
                console.error(`Failed to load sound: ${name}`, err);
            }
        }

        this.initialized = true;
        console.log('Sound initialization complete. Available sounds:', Object.keys(this.sounds));
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }

        try {
            console.log(`Attempting to play sound: ${soundName}`);
            if (!soundName.includes('music')) {
                sound.currentTime = 0;
            }
            sound.play()
                .then(() => console.log(`Playing sound: ${soundName}`))
                .catch(err => console.error(`Error playing sound: ${soundName}`, err));
        } catch (err) {
            console.error(`Error playing sound: ${soundName}`, err);
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    setVolume(soundName, volume) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        sound.volume = Math.max(0, Math.min(1, volume));
    }
}

// Create and export a single instance
export const soundManager = new SoundManager();

export class CommentarySystem {
    constructor() {
        this.commentaryBox = document.getElementById('commentary');
        this.messages = [];
    }

    getSquareNotation(x, y) {
        const file = String.fromCharCode(97 + x); // a, b, c, ...
        const rank = y + 1;
        return `${file}${rank}`;
    }

    addMessage(text, isImportant = false) {
        const message = document.createElement('div');
        message.className = 'message';
        if (isImportant) {
            message.style.color = '#ff4444';
            message.style.fontWeight = 'bold';
        }
        message.textContent = text;
        
        this.commentaryBox.appendChild(message);
        this.commentaryBox.scrollTop = this.commentaryBox.scrollHeight;
        
        // Keep only last 50 messages
        while (this.commentaryBox.children.length > 50) {
            this.commentaryBox.removeChild(this.commentaryBox.firstChild);
        }
    }

    announceMove(unit, fromX, fromY, toX, toY) {
        const from = this.getSquareNotation(fromX, fromY);
        const to = this.getSquareNotation(toX, toY);
        const playerColor = unit.owner === 1 ? 'Red' : 'Blue';
        const unitType = unit.type.name;
        
        this.addMessage(`${playerColor} ${unitType} moves from ${from} to ${to}`);
    }

    announceAttack(attacker, defender) {
        const attackerColor = attacker.owner === 1 ? 'Red' : 'Blue';
        const defenderColor = defender.owner === 1 ? 'Red' : 'Blue';
        const pos = this.getSquareNotation(defender.x, defender.y);
        
        this.addMessage(
            `${attackerColor} ${attacker.type.name} attacks ${defenderColor} ${defender.type.name} at ${pos}`
        );
    }

    announceUnitPurchase(unit, x, y) {
        const playerColor = unit.owner === 1 ? 'Red' : 'Blue';
        const pos = this.getSquareNotation(x, y);
        
        this.addMessage(
            `${playerColor} recruits a ${unit.type.name} at ${pos}`
        );
    }

    announceTurnChange(playerNumber) {
        const playerColor = playerNumber === 1 ? 'Blue' : 'Red';
        this.addMessage(`${playerColor}'s turn begins`);
    }

    announceResourceGain(player, gold, wood) {
        const playerColor = player === 1 ? 'Blue' : 'Red';
        this.addMessage(
            `${playerColor} gains ${gold} gold and ${wood} wood`
        );
    }

    announceUnitDeath(unit) {
        const playerColor = unit.owner === 1 ? 'Blue' : 'Red';
        const pos = this.getSquareNotation(unit.x, unit.y);
        this.addMessage(
            `${playerColor} ${unit.type.name} at ${pos} has been defeated!`
        );
    }

    announceUnitSelected(unitType) {
        this.addMessage(`Selected ${unitType} unit`);
    }

    announceMove(unitType, x, y) {
        this.addMessage(`${unitType} moved to position (${x}, ${y})`);
    }

    announceAttack(attackerType, targetType, targetHealth) {
        this.addMessage(`${attackerType} attacks ${targetType}! ${targetType} has ${targetHealth} health remaining.`);
    }

    announceUnitDestroyed(unitType) {
        this.addMessage(`${unitType} unit was destroyed!`, true);
    }

    announceUnitPurchase(unitType, player) {
        const playerColor = player === 1 ? 'Blue' : 'Red';
        this.addMessage(`${playerColor} player purchased a new ${unitType} unit`);
    }

    announceResourceGain(type, amount, player) {
        const playerColor = player === "1" ? 'Blue' : 'Red';
        this.addMessage(`${playerColor} player gained ${amount} ${type}`);
    }
} 