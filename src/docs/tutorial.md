# 2D Strategy Game Tutorial
A comprehensive guide to understanding and building a 2D strategy game from scratch.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Game Architecture](#game-architecture)
3. [Core Concepts](#core-concepts)
4. [Game Mechanics](#game-mechanics)
5. [User Interface](#user-interface)
6. [Audio System](#audio-system)
7. [Animation System](#animation-system)
8. [Resource Management](#resource-management)
9. [Unit System](#unit-system)
10. [Combat System](#combat-system)
11. [Turn Management](#turn-management)
12. [Win Conditions](#win-conditions)

## Project Setup

### File Structure
```
src/
├── assets/         # Game assets (images, sprites)
├── css/           # Stylesheets
├── js/            # JavaScript files
├── sounds/        # Audio files
├── docs/          # Documentation
├── menu.html      # Main menu page
├── game.html      # Game page
└── server.js      # Local development server
```

### Development Environment
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Clone the repository
3. Run `cd src && node server.js`
4. Access the game at `http://localhost:3000`

## Game Architecture

### Core Components
1. **Game Class**: Main game controller
2. **Unit Class**: Handles unit properties and behaviors
3. **SoundManager**: Manages game audio
4. **CommentarySystem**: Handles game feedback
5. **ResourceManager**: Manages game resources

### Game Loop
```javascript
function gameLoop() {
    game.render();
    requestAnimationFrame(gameLoop);
}
```

## Core Concepts

### Canvas Rendering
- Uses HTML5 Canvas for 2D graphics
- Grid-based system for unit placement
- Sprite-based rendering for units

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
```

### Grid System
- 12x8 grid layout
- Each tile is 60x60 pixels
- Units can only move on valid tiles

```javascript
const GRID_WIDTH = 12;
const GRID_HEIGHT = 8;
const TILE_SIZE = 60;
```

## Game Mechanics

### Unit Movement
1. Click to select a unit
2. Click valid tile to move
3. Units can only move within their range
4. Units can't move through obstacles

```javascript
if (this.selectedUnit && !clickedUnit && this.grid[gridY][gridX] !== TERRAIN_TYPES.WATER) {
    this.selectedUnit.move(gridX, gridY);
}
```

### Combat System
1. Units can attack adjacent enemies
2. Damage calculation based on unit stats
3. Counter-attack mechanics
4. Unit destruction when health reaches 0

```javascript
if (this.selectedUnit.canAttack(clickedUnit)) {
    this.selectedUnit.attack(clickedUnit);
}
```

## User Interface

### Menu System
- Main menu with game options
- Animated transitions using GSAP
- Responsive design for all screen sizes

```javascript
const menuTimeline = gsap.timeline({
    defaults: { ease: "back.out(1.7)" }
});
```

### Game Interface
- Resource display
- Unit information
- Turn indicator
- Commentary box

## Audio System

### Sound Management
- Background music
- Sound effects for actions
- Commentary system
- Volume control

```javascript
class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }
}
```

## Animation System

### GSAP Animations
- Menu transitions
- Unit movements
- Combat effects
- UI feedback

```javascript
gsap.to(element, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: "elastic.out(1, 0.5)"
});
```

## Resource Management

### Resource Types
- Gold: Used for unit purchases
- Wood: Used for unit purchases
- Resource generation every 5 turns

```javascript
this.resources = {
    gold: 100,
    wood: 50,
    goldRate: 5,
    woodRate: 3
};
```

## Unit System

### Unit Types
1. **Archer**
   - Range: 2
   - Attack: 15
   - Defense: 5
   - Cost: 50 gold, 20 wood

2. **Knight**
   - Range: 1
   - Attack: 20
   - Defense: 15
   - Cost: 80 gold, 30 wood

3. **Mage**
   - Range: 2
   - Attack: 25
   - Defense: 3
   - Cost: 100 gold, 40 wood

### Unit Properties
```javascript
class Unit {
    constructor(type, owner, x, y) {
        this.type = type;
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.health = type.health;
        this.attack = type.attack;
        this.defense = type.defense;
        this.moveRange = type.moveRange;
    }
}
```

## Combat System

### Attack Mechanics
1. Check if attack is possible
2. Calculate damage
3. Apply damage
4. Handle counter-attack
5. Remove destroyed units

```javascript
attack(target) {
    if (!this.canAttack(target)) return false;
    
    const damage = Math.max(0, this.attack - target.defense);
    target.health -= damage;
    
    if (target.isAlive() && this.isAdjacent(target)) {
        target.counterAttack(this);
    }
}
```

## Turn Management

### Turn Structure
1. Player 1's turn
2. Resource generation
3. Unit actions
4. Player 2's turn
5. Repeat

```javascript
endTurn() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    if (this.currentPlayer === 1) {
        this.turn++;
        this.addResources();
    }
}
```

## Win Conditions

### Victory Rules
1. Player loses when:
   - All units are destroyed AND
   - No resources to build new units

2. Game ends when:
   - Victory dialog appears
   - Victory sound plays
   - Game interactions disabled

```javascript
checkWinCondition() {
    const player1Lost = player1Units.length === 0 && 
                       this.resources.gold < cheapestUnitCost;
    const player2Lost = player2Units.length === 0 && 
                       this.resources.gold < cheapestUnitCost;
    
    if (player1Lost || player2Lost) {
        this.handleVictory(player1Lost ? 2 : 1);
    }
}
```

## Creating Your Own Game

### Step-by-Step Guide
1. Set up the project structure
2. Create the basic HTML files
3. Implement the game loop
4. Add unit system
5. Implement movement
6. Add combat system
7. Create resource management
8. Add UI elements
9. Implement audio system
10. Add animations
11. Test and balance

### Tips for Beginners
1. Start with a simple grid system
2. Add one feature at a time
3. Test thoroughly after each addition
4. Use console.log for debugging
5. Keep code organized and commented
6. Use version control (Git)
7. Follow consistent naming conventions

### Common Pitfalls to Avoid
1. Not handling edge cases
2. Forgetting to update UI
3. Not cleaning up event listeners
4. Ignoring performance optimization
5. Not testing on different devices
6. Poor error handling
7. Inconsistent state management

## Additional Resources
- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [GSAP Documentation](https://greensock.com/docs/)
- [HTML5 Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [JavaScript Game Development](https://developer.mozilla.org/en-US/docs/Games)
