import { soundManager, CommentarySystem } from './SoundManager.js';
import { Unit, UNIT_TYPES } from './Unit.js';

// Game constants
const GRID_WIDTH = 12;
const GRID_HEIGHT = 8;
const TILE_SIZE = 60;
const RESOURCE_GAIN_INTERVAL = 5; // Turns between resource gains
const CANVAS_WIDTH = GRID_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * TILE_SIZE;

const TERRAIN_TYPES = {
    GRASS: 0,
    FOREST: 1,
    MOUNTAIN: 2,
    WATER: 3
};

class Game {
    constructor(commentarySystem) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.commentarySystem = commentarySystem;
        
        // Set canvas size
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        
        // Remove the click handler from constructor as we'll add it in initialization
        // this.canvas.addEventListener('click', (event) => this.handleClick(event));
        
        // Initialize resources
        this.resources = {
            gold: 100,
            wood: 50,
            goldRate: 5,
            woodRate: 3
        };
        
        // Initialize game state
        this.currentPlayer = 1;
        this.selectedUnit = null;
        this.turn = 1;
        this.units = [];
        this.grid = [];
        
        // Initialize grid
        this.initializeGrid();
        
        // Initialize units
        this.initializeUnits();
        
        // Set up shop event listeners
        this.setupShopListeners();
        
        // Update resource display
        this.updateResourceDisplay();
        
        // Show initial turn dialog
        setTimeout(() => {
            this.showTurnDialog(this.currentPlayer);
            this.commentarySystem.announceTurnChange(this.currentPlayer);
        }, 100);
    }
    
    setupShopListeners() {
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', () => {
                const unitType = button.closest('.shop-item').dataset.unit;
                if (this.purchaseUnit(unitType)) {
                    soundManager.play('purchase');
                }
            });
        });
    }

    generateMap() {
        const grid = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            grid[y] = [];
            for (let x = 0; x < GRID_WIDTH; x++) {
                // Generate random terrain with bias towards grass
                const rand = Math.random();
                if (rand < 0.7) grid[y][x] = TERRAIN_TYPES.GRASS;
                else if (rand < 0.8) grid[y][x] = TERRAIN_TYPES.FOREST;
                else if (rand < 0.9) grid[y][x] = TERRAIN_TYPES.MOUNTAIN;
                else grid[y][x] = TERRAIN_TYPES.WATER;
            }
        }
        return grid;
    }
    
    createTurnDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'turnDialog';
        dialog.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 24px;
            z-index: 1000;
            text-align: center;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            animation: fadeInOut 2s ease-in-out;
        `;
        document.body.appendChild(dialog);
    }

    showTurnDialog(player) {
        const dialog = document.getElementById('turnDialog');
        const color = player === 1 ? 'Blue' : 'Red';
        dialog.textContent = `${color} Player's Turn`;
        dialog.style.display = 'block';
        dialog.style.borderColor = player === 1 ? '#0000ff' : '#ff0000';
        
        setTimeout(() => {
            dialog.style.display = 'none';
        }, 2000);
    }
    
    async initializeSounds() {
        try {
            await soundManager.init();
            console.log('Game sounds initialized');
            soundManager.play('menu-music');
        } catch (error) {
            console.error('Failed to initialize sounds:', error);
        }
    }

    init() {
        // Set up initial game state
        this.setupInitialUnits();
        this.updateResourceDisplay();
        this.draw();
        
        // Show initial turn dialog
        setTimeout(() => {
            this.showTurnDialog(this.currentPlayer);
            this.commentarySystem.announceTurnChange(this.currentPlayer);
        }, 100);
    }

    setupInitialUnits() {
        // Player 1 units (bottom)
        this.addUnit(2, GRID_HEIGHT - 1, UNIT_TYPES.WARRIOR, 1);
        this.addUnit(4, GRID_HEIGHT - 1, UNIT_TYPES.ARCHER, 1);
        this.addUnit(6, GRID_HEIGHT - 1, UNIT_TYPES.KNIGHT, 1);

        // Player 2 units (top)
        this.addUnit(2, 0, UNIT_TYPES.WARRIOR, 2);
        this.addUnit(4, 0, UNIT_TYPES.ARCHER, 2);
        this.addUnit(6, 0, UNIT_TYPES.KNIGHT, 2);
    }

    addUnit(x, y, type, owner) {
        const unit = new Unit(x, y, type, owner);
        this.units.push(unit);
        console.log(`Added unit: ${type.name} at (${x}, ${y}) for player ${owner}`);
        return unit;
    }

    handleClick(event) {
        // Get canvas position relative to viewport
        const rect = this.canvas.getBoundingClientRect();
        
        // Calculate click position relative to canvas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert to grid coordinates
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);
    
        console.log(`Canvas clicked at: (${x}, ${y})`);
        console.log(`Mapped to grid: (${gridX}, ${gridY})`);
        console.log(`Grid dimensions: ${GRID_WIDTH}x${GRID_HEIGHT}`);
    
        // Check if within grid boundaries
        if (gridX < 0 || gridX >= GRID_WIDTH || gridY < 0 || gridY >= GRID_HEIGHT) {
            console.warn(`Click out of bounds! Grid coordinates: (${gridX}, ${gridY})`);
            return;
        }
    
        const clickedUnit = this.getUnitAt(gridX, gridY);
        console.log("Clicked Unit:", clickedUnit ? `${clickedUnit.type.name} (Player ${clickedUnit.owner})` : "None");
    
        // If clicking on a friendly unit
        if (clickedUnit && clickedUnit.owner === this.currentPlayer) {
            // If we already had a unit selected
            if (this.selectedUnit) {
                // If clicking the same unit, deselect it
                if (this.selectedUnit === clickedUnit) {
                    console.log(`Deselecting ${clickedUnit.type.name}`);
                    this.selectedUnit = null;
                    soundManager.play("button-click");
                }
                // If clicking a different friendly unit, select it instead
                else {
                    console.log(`Switching selection from ${this.selectedUnit.type.name} to ${clickedUnit.type.name}`);
                    this.selectedUnit = clickedUnit;
                    soundManager.play("button-click");
                    this.commentarySystem.announceUnitSelected(clickedUnit.type.name);
                }
            }
            // If no unit was selected, select this one
            else {
                console.log(`Selecting ${clickedUnit.type.name}`);
                this.selectedUnit = clickedUnit;
                soundManager.play("button-click");
                this.commentarySystem.announceUnitSelected(clickedUnit.type.name);
            }
        }
        // If we have a unit selected and clicked on an enemy unit
        else if (this.selectedUnit && clickedUnit && clickedUnit.owner !== this.currentPlayer) {
            console.log(`${this.selectedUnit.type.name} attempts to attack ${clickedUnit.type.name}`);
            if (this.selectedUnit.canAttack(clickedUnit)) {
                if (this.selectedUnit.attack(clickedUnit)) {
                    soundManager.play("attack");
                    this.commentarySystem.announceAttack(
                        this.selectedUnit.type.name,
                        clickedUnit.type.name,
                        clickedUnit.health
                    );

                    // Remove defeated units
                    if (!clickedUnit.isAlive()) {
                        console.log(`${clickedUnit.type.name} has been destroyed.`);
                        this.removeUnit(clickedUnit);
                        this.commentarySystem.announceUnitDestroyed(clickedUnit.type.name);
                    }
                    if (!this.selectedUnit.isAlive()) {
                        console.log(`${this.selectedUnit.type.name} has been destroyed.`);
                        this.removeUnit(this.selectedUnit);
                        this.commentarySystem.announceUnitDestroyed(this.selectedUnit.type.name);
                    }
                    this.selectedUnit = null;
                }
            } else {
                console.log("Attack not possible - unit has already attacked or target is not adjacent");
            }
        }
        // If we have a unit selected and clicked on an empty valid tile
        else if (this.selectedUnit && !clickedUnit && this.grid[gridY][gridX] !== TERRAIN_TYPES.WATER) {
            const oldX = this.selectedUnit.x;
            const oldY = this.selectedUnit.y;

            console.log(`Attempting to move ${this.selectedUnit.type.name} to (${gridX}, ${gridY})`);
            if (this.selectedUnit.move(gridX, gridY)) {
                console.log(`${this.selectedUnit.type.name} moved from (${oldX}, ${oldY}) to (${gridX}, ${gridY})`);
                soundManager.play("move");
                this.commentarySystem.announceMove(this.selectedUnit.type.name, gridX, gridY);
                this.selectedUnit = null;
            } else {
                console.log("Move not possible - unit has already moved or destination is too far");
            }
        }
        // If clicking empty space with no unit selected
        else {
            console.log("No action taken");
            if (this.selectedUnit) {
                console.log("Deselecting current unit");
                this.selectedUnit = null;
            }
        }
    
        this.render();
    }
    

    getUnitAt(x, y) {
        const unit = this.units.find(unit => unit.x === x && unit.y === y);
        console.log(`Looking for unit at (${x}, ${y}):`, unit ? `${unit.type.name} (Player ${unit.owner})` : 'None');
        return unit;
    }

    removeUnit(unit) {
        const index = this.units.indexOf(unit);
        if (index !== -1) {
            this.units.splice(index, 1);
            this.checkWinCondition(); // Check for win after unit removal
        }
    }

    checkWinCondition() {
        const player1Units = this.units.filter(unit => unit.owner === 1);
        const player2Units = this.units.filter(unit => unit.owner === 2);
        
        // Check if either player has no units and no resources to build new ones
        const player1Lost = player1Units.length === 0 && this.resources.gold < Math.min(...Object.values(UNIT_TYPES).map(type => type.cost.gold));
        const player2Lost = player2Units.length === 0 && this.resources.gold < Math.min(...Object.values(UNIT_TYPES).map(type => type.cost.gold));
        
        if (player1Lost || player2Lost) {
            const winner = player1Lost ? 2 : 1;
            const color = winner === 1 ? 'Blue' : 'Red';
            
            // Create and show victory dialog
            const victoryDialog = document.createElement('div');
            victoryDialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 40px 80px;
                border-radius: 15px;
                font-size: 32px;
                z-index: 1000;
                text-align: center;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            `;
            victoryDialog.textContent = `${color} Player Wins!`;
            document.body.appendChild(victoryDialog);
            
            // Play victory sound
            soundManager.play('victory');
            
            // Announce victory
            this.commentarySystem.announceVictory(color);
            
            // Disable further game interactions
            this.canvas.removeEventListener('click', this.handleClick);
            document.getElementById('endTurn').disabled = true;
        }
    }

    purchaseUnit(unitType) {
        const type = UNIT_TYPES[unitType];
        if (!type) return false;

        const resources = this.resources;
        
        // Check if player has enough resources
        if (resources.gold < type.cost.gold || 
            (type.cost.wood && resources.wood < type.cost.wood)) {
            return false;
        }

        // Find spawn position
        const y = this.currentPlayer === 1 ? GRID_HEIGHT - 1 : 0;
        let x = -1;
        for (let i = 0; i < GRID_WIDTH; i++) {
            if (!this.getUnitAt(i, y)) {
                x = i;
                break;
            }
        }

        if (x === -1) return false; // No space to spawn

        // Deduct resources
        resources.gold -= type.cost.gold;
        if (type.cost.wood) {
            resources.wood -= type.cost.wood;
        }

        // Add unit
        this.addUnit(x, y, type, this.currentPlayer);
        this.updateResourceDisplay();
        this.draw();
        return true;
    }

    updateResourceDisplay() {
        document.getElementById('gold').textContent = this.resources.gold;
        document.getElementById('wood').textContent = this.resources.wood;
        document.getElementById('gold-rate').textContent = this.resources.goldRate;
        document.getElementById('wood-rate').textContent = this.resources.woodRate;
        document.getElementById('turn-counter').textContent = this.turn;
    }

    endTurn() {
        // Reset unit states
        this.units.forEach(unit => {
            if (unit.owner === this.currentPlayer) {
                unit.resetTurn();
            }
        });

        // Switch players
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.selectedUnit = null;

        // Show turn change dialog and play sound
        this.showTurnDialog(this.currentPlayer);
        soundManager.play('button-click');
        this.commentarySystem.announceTurnChange(this.currentPlayer);

        // Increment turn counter for player 1's turn
        if (this.currentPlayer === 1) {
            this.turn++;
            
            // Add resources every RESOURCE_GAIN_INTERVAL turns
            if (this.turn % RESOURCE_GAIN_INTERVAL === 0) {
                const resources = this.resources;
                const rates = { gold: resources.goldRate, wood: resources.woodRate };
                resources.gold += rates.gold;
                resources.wood += rates.wood;
                this.commentarySystem.announceResourceGain('gold', rates.gold, this.currentPlayer);
                this.commentarySystem.announceResourceGain('wood', rates.wood, this.currentPlayer);
            }
        }

        this.updateResourceDisplay();
        this.render();
        
        // Check win condition after turn change
        this.checkWinCondition();
    }

    drawTerrain(x, y, type) {
        const colors = {
            [TERRAIN_TYPES.GRASS]: '#90EE90',
            [TERRAIN_TYPES.FOREST]: '#228B22',
            [TERRAIN_TYPES.MOUNTAIN]: '#808080',
            [TERRAIN_TYPES.WATER]: '#4169E1'
        };

        this.ctx.fillStyle = colors[type];
        this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw terrain
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                this.drawTerrain(x, y, this.grid[y][x]);
            }
        }

        // Draw units
        this.units.forEach(unit => {
            this.drawUnit(unit);
        });

        // Highlight selected unit
        if (this.selectedUnit) {
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.selectedUnit.x * TILE_SIZE,
                this.selectedUnit.y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
            this.ctx.lineWidth = 1;
        }
    }

    drawUnit(unit) {
        const x = unit.x * TILE_SIZE;
        const y = unit.y * TILE_SIZE;
        
        // Draw unit background
        this.ctx.fillStyle = unit.owner === 1 ? '#0000ff' : '#ff0000';
        this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        
        // Draw unit type symbol
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const symbol = unit.type === UNIT_TYPES.WARRIOR ? '⚔️' :
                      unit.type === UNIT_TYPES.ARCHER ? '🏹' : '🛡️';
        this.ctx.fillText(symbol, x + TILE_SIZE/2, y + TILE_SIZE/2);
        
        // Draw health bar
        const healthWidth = (TILE_SIZE - 10) * (unit.health / unit.maxHealth);
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(x + 5, y + TILE_SIZE - 10, healthWidth, 5);
    }

    start() {
        this.draw();
    }

    initializeGrid() {
        // Generate terrain grid
        this.grid = this.generateMap();
        
        // Create turn dialog
        this.createTurnDialog();
        
        console.log('Grid initialized:', this.grid);
    }

    initializeUnits() {
        // Player 1 units (bottom)
        this.addUnit(2, GRID_HEIGHT - 1, UNIT_TYPES.WARRIOR, 1);
        this.addUnit(4, GRID_HEIGHT - 1, UNIT_TYPES.ARCHER, 1);
        this.addUnit(6, GRID_HEIGHT - 1, UNIT_TYPES.KNIGHT, 1);

        // Player 2 units (top)
        this.addUnit(2, 0, UNIT_TYPES.WARRIOR, 2);
        this.addUnit(4, 0, UNIT_TYPES.ARCHER, 2);
        this.addUnit(6, 0, UNIT_TYPES.KNIGHT, 2);

        console.log('Initialized units:', this.units);
    }

    update() {
        // No need to update units every frame
        // This method is kept for future use if needed
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw terrain
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                this.drawTerrain(x, y, this.grid[y][x]);
            }
        }

        // Draw units
        this.units.forEach(unit => {
            this.drawUnit(unit);
        });

        // Highlight selected unit
        if (this.selectedUnit) {
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.selectedUnit.x * TILE_SIZE,
                this.selectedUnit.y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            );
            this.ctx.lineWidth = 1;
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize sound manager
        await soundManager.init();
        
        // Initialize commentary system
        const commentarySystem = new CommentarySystem();
        
        // Initialize game
        const game = new Game(commentarySystem);
        
        // Set up event listeners
        const canvas = document.getElementById('gameCanvas');
        const endTurnButton = document.getElementById('endTurn');
        const generateSoundsButton = document.getElementById('generateSounds');
        
        // Handle canvas clicks
        canvas.addEventListener('click', (e) => game.handleClick(e));
        
        // Handle end turn button
        endTurnButton.addEventListener('click', () => {
            game.endTurn();
        });
        
        // Handle generate sounds button
        generateSoundsButton.addEventListener('click', () => {
            generateBasicSounds();
        });
        
        // Start game loop
        function gameLoop() {
            game.render();
            requestAnimationFrame(gameLoop);
        }
        
        // Initial render
        game.render();
        
        // Start game loop
        gameLoop();
        
        // Log initial game state
        console.log('Game initialized with units:', game.units);
        console.log('Grid state:', game.grid);
        
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error initializing game. Please check the console for details.');
    }
}); 