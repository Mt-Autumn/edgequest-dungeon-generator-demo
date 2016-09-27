// Global object to store monsters and items
var Objects = {
    monList: [],
    itemList: [],
    clearAll: function() {
        this.monList = [];
        this.itemList = [];
    },
    clearMons: function() {
        this.monList = [];
    },
    clearItems: function() {
        this.itemList = [];
    },
    addMon: function(obj) {
        this.monList.push(obj);
    },
    addItem: function(obj) {
        this.itemList.push(obj);
    },
    getAll: function() {
        return this.monList + this.itemList;
    },
    getMons: function() {
        return this.monList;
    },
    getItems: function() {
        return this.itemList;
    }
}
