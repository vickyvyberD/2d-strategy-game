# 2D Strategy Game

A turn-based 2D strategy game built with HTML5 Canvas, JavaScript, and GSAP animations.

## Features

- Turn-based gameplay
- Multiple unit types (Archer, Knight, Mage)
- Resource management system
- Combat mechanics with counter-attacks
- Animated UI using GSAP
- Sound effects and background music
- Responsive design
- Commentary system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/2d-strategy-game.git
cd 2d-strategy-game
```

2. Start the development server:
```bash
cd src
node server.js
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Game Controls

- Click on units to select them
- Click on valid tiles to move units
- Click on enemy units to attack
- Use the "End Turn" button to switch players
- Use the "Generate Sound Files" button to create game sounds

## Game Rules

1. Each player starts with:
   - 100 gold
   - 50 wood
   - Initial units

2. Resources are generated every 5 turns

3. Units can:
   - Move within their range
   - Attack adjacent enemies
   - Counter-attack when attacked

4. Victory conditions:
   - Destroy all enemy units
   - Prevent enemy from building new units

## Development

### Project Structure

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

### Documentation

Detailed documentation can be found in `src/docs/tutorial.md`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GSAP for animations
- HTML5 Canvas API
- Web Audio API 