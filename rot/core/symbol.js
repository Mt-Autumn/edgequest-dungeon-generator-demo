// Symbol to keep track of ASCII art
class Symbol {

    constructor(char, fg, bg) {
        this._char = char || ' ';
        this._fg = fg || 'white';
        this._bg = bg || 'black';
    }

    // Getters and Setters

    getChar() {
        return this._char;
    }

    getBG() {
        return this._bg;
    }

    getFG() {
        return this._fg;
    }

}
