export const UNIT_TYPES = {
    WARRIOR: {
        name: 'Warrior',
        attack: 30,
        defense: 20,
        moveRange: 2,
        cost: {
            gold: 50
        }
    },
    ARCHER: {
        name: 'Archer',
        attack: 25,
        defense: 15,
        moveRange: 3,
        cost: {
            gold: 40,
            wood: 10
        }
    },
    KNIGHT: {
        name: 'Knight',
        attack: 35,
        defense: 30,
        moveRange: 4,
        cost: {
            gold: 80,
            wood: 20
        }
    }
};

export class Unit {
    constructor(x, y, type, owner) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.owner = owner;
        this.health = 100;
        this.maxHealth = 100;
        this.attackPower = type.attack;
        this.defense = type.defense;
        this.moveRange = type.moveRange;
        this.hasMoved = false;
        this.hasAttacked = false;
    }

    move(newX, newY) {
        if (this.hasMoved) return false;
        
        const distance = Math.abs(newX - this.x) + Math.abs(newY - this.y);
        if (distance <= this.moveRange) {
            this.x = newX;
            this.y = newY;
            this.hasMoved = true;
            return true;
        }
        return false;
    }

    canAttack(target) {
        if (target.owner === this.owner) return false;
        if (this.hasAttacked) return false;
        
        const distance = Math.abs(target.x - this.x) + Math.abs(target.y - this.y);
        return distance <= 1; // Only adjacent units for now
    }

    attack(target) {
        if (!this.canAttack(target)) {
            console.log(`Cannot attack: ${this.type.name} has already attacked or target is not adjacent`);
            return false;
        }

        // Calculate damage
        const damage = Math.max(5, this.attackPower - target.defense);
        target.health -= damage;
        console.log(`${this.type.name} deals ${damage} damage to ${target.type.name}`);

        // Counter-attack if target is still alive and adjacent
        if (target.isAlive() && !target.hasAttacked && this.isAdjacent(target)) {
            const counterDamage = Math.max(3, Math.floor((target.attackPower - this.defense) * 0.7));
            this.health -= counterDamage;
            console.log(`${target.type.name} counter-attacks for ${counterDamage} damage`);
        }

        this.hasAttacked = true;
        return true;
    }

    isAdjacent(other) {
        const distance = Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
        return distance === 1;
    }

    resetTurn() {
        this.hasMoved = false;
        this.hasAttacked = false;
    }

    isAlive() {
        return this.health > 0;
    }
} 