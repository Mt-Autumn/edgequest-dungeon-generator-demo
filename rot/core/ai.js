// AIs control actors in the game
class DumbAI {
    constructor(actor) {
        this.actor = actor;
    }

    // Move 'override'
    move() {
        var dx = 0;
        var dy = 0

        // Roll a random direction
        switch (Math.floor((Math.random() * 4) + 1)) {
            case 1:
                dx += 1;
                break;
            case 2:
                dx -= 1;
                break;
            case 3:
                dy += 1;
                break;
            case 4:
                dy -= 1;
                break;
        }

        // Make sure we aren't violating map bounds
        if (Settings.mapWidth - 2 < this.actor.x) {
            dx = 0;
        } else if (this.actor.x < 0) {
            dx = 0;
        } else if (this.actor.y < 0) {
            dy = 0;
        } else if (Settings.mapHeight - 2 < this.actor.y) {
            dy = 0;
        }

        // Move
        this.actor.move(dx, dy);
        
    }
}
