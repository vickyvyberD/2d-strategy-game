import { soundManager } from './SoundManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize sound manager
        await soundManager.init();
        
        // Get DOM elements
        const startGameButton = document.getElementById('startGame');
        const generateSoundsButton = document.getElementById('generateSounds');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const menuContainer = document.querySelector('.menu-container');
        const gameTitle = document.querySelector('.game-title');
        const buttonContainer = document.querySelector('.button-container');
        const version = document.querySelector('.version');
        
        // Create GSAP timeline for menu animations
        const menuTimeline = gsap.timeline({
            defaults: { ease: "back.out(1.7)" }
        });

        // Animate menu elements
        menuTimeline
            .to(menuContainer, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            })
            .to(gameTitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.4")
            .to(buttonContainer, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.4")
            .to(version, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.7)"
            }, "-=0.4");

        // Enable start game button once sounds are loaded
        startGameButton.disabled = false;
        
        // Handle start game button click with animation
        startGameButton.addEventListener('click', () => {
            soundManager.play('button-click');
            
            // Create exit animation timeline
            const exitTimeline = gsap.timeline({
                onComplete: () => window.location.href = 'game.html'
            });

            exitTimeline
                .to(buttonContainer, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: "power2.in"
                })
                .to(gameTitle, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: "power2.in"
                }, "-=0.2")
                .to(menuContainer, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    ease: "power2.in"
                }, "-=0.2");
        });
        
        // Handle generate sounds button click with animation
        generateSoundsButton.addEventListener('click', async () => {
            try {
                generateSoundsButton.disabled = true;
                loadingDiv.style.display = 'flex';
                errorDiv.style.display = 'none';
                
                // Animate button press
                gsap.to(generateSoundsButton, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
                
                await generateBasicSounds();
                
                // Reinitialize sound manager with new sounds
                await soundManager.init();
                
                // Show success message with animation
                errorDiv.style.display = 'block';
                errorDiv.classList.add('success');
                errorDiv.textContent = 'Sound files generated successfully!';
                
                gsap.from(errorDiv, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
                
                // Remove success class after 3 seconds
                setTimeout(() => {
                    gsap.to(errorDiv, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            errorDiv.classList.remove('success');
                            errorDiv.style.display = 'none';
                        }
                    });
                }, 3000);
                
                soundManager.play('button-click');
            } catch (error) {
                console.error('Error generating sounds:', error);
                errorDiv.style.display = 'block';
                errorDiv.classList.remove('success');
                errorDiv.textContent = 'Error generating sound files. Please check the console for details.';
                
                gsap.from(errorDiv, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            } finally {
                generateSoundsButton.disabled = false;
                loadingDiv.style.display = 'none';
            }
        });
        
        // Play menu music
        soundManager.play('menu-music');
        
    } catch (error) {
        console.error('Error initializing menu:', error);
        errorDiv.style.display = 'block';
        errorDiv.classList.remove('success');
        errorDiv.textContent = 'Error initializing menu. Please check the console for details.';
        
        gsap.from(errorDiv, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }
}); 