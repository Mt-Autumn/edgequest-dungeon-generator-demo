// Wrap an actor with player input
// DEPENDS: Actor

var Player = {

    actor: new Actor(0, 0, new Symbol('@', 'white', 'red')),

    // Move 'override'
    move: function(dx, dy) {
        this.actor.move(dx, dy);
    }

}
