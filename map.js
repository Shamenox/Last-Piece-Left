var rooms = {};
	rooms.width = 23;
	rooms.depth = 22;
var map = {};
for (var i = 0; i < 32; i++){
	map[i] = {};
	for (var h = 0; h < 32; h++){
		map[i][h] = {
			north : "pass",
			south : "pass",
			east : "pass",
			west : "pass",
			light : true,
		}
	}
}



////

class Room {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.light = true
        this.doorNorth = null
        this.doorSouth = null
        this.doorWest = null
        this.doorEast = null
    }

    GetNorthRoom() {
        return this.doorNorth.getOppositeRoom(this)
    }

    GetSouthRoom() {
        return this.doorSouth.getOppositeRoom(this)
    }

    GetWestRoom() {
        return this.doorWest.getOppositeRoom(this)
    }

    GetEastRoom() {
        return this.doorEast.getOppositeRoom(this)
    }

    GetDoorCount() {
        let count = 0

        if (this.doorNorth) count++
        if (this.doorSouth) count++
        if (this.doorWest) count++
        if (this.doorEast) count++

        return count
    }
}

class Door {
    constructor(roomA, roomB) {
        this.roomA = roomA
        this.roomB = roomB
        this.trasition = null
    }

    getOppositeRoom(room) {
        if (room === this.roomA) return this.roomB
        if (room === this.roomB) return this.roomA

        throw new Error('This door does not know the room at x:' + room.x + " y:" + room.y)
    }
}

class Map {
    constructor(width, height, seed) {
        this.bounds = {width, height}

        this._seedArgs = seed + 535232;

        this._rooms = []

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                this._rooms.push(new Room(x, y))
            }
        }
        
    }

    _random() {
        let x = Math.sin(this._seedArgs++) * 1000000
        return x - Math.floor(x)
    }

    _randomRange(min, max) {
       return Math.floor((this._random() * max) + min);
    }

    GetAtCoord(x, y) {
        for (var i = 0; i < this._rooms.length; i++) {
            var element = this._rooms[i]
            
            if (element.x === x && element.y === y) return element
        }

        throw new Error('Element not found at x: ' + x + ', y: ' + y)
    }



    RandomizeDoors() {
        let startRoom = this.GetAtCoord(
            Math.floor(this.bounds.width / 2),
            Math.floor(this.bounds.height / 2)
        )

        this.CreateDoorNorth(startRoom)
        this.CreateDoorWest(startRoom)
        this.CreateDoorSouth(startRoom)
        this.CreateDoorEast(startRoom)
             

       while(this.AddDoorWherePossible());

       console.log("ok 0.0")
    }

    AddDoorWherePossible() {
        var doorsChanged = 0

        for (var x = 1; x < this.bounds.width-1; x++) {
            for (var y = 1; y < this.bounds.height-1; y++) {
                var room = this.GetAtCoord(x, y)
                
                if ((room.GetDoorCount() === 0) || (room.GetDoorCount() === 4)) continue;

             //   if (room.GetDoorCount() > 1)console.log(room.GetDoorCount())

                if (this.CanPutDoorNorthAt(room.x, room.y) && (this._randomRange(0, 3) == 1)) {
                    this.CreateDoorNorth(room)
                    doorsChanged++
                }
                if (this.CanPutDoorWestAt(room.x, room.y) && (this._randomRange(0, 3) == 1)) {
                    this.CreateDoorWest(room)
                    doorsChanged++
                }
                if (this.CanPutDoorSouthAt(room.x, room.y) && (this._randomRange(0, 3) == 1)) {
                    this.CreateDoorSouth(room)
                    doorsChanged++
                }
                if (this.CanPutDoorEastAt(room.x, room.y) && (this._randomRange(0, 3) == 1)) {
                    this.CreateDoorEast(room)
                    doorsChanged++
                }

               
            }
        }

        console.log(doorsChanged)

        return doorsChanged
    }

    CreateDoorNorth(roomSource) {
        const roomDest = this.GetAtCoord(roomSource.x, roomSource.y - 1)
        const door = new Door(roomSource, roomDest)

        roomSource.doorNorth = door
        roomDest.doorNorth = door
    }
    CreateDoorSouth(roomSource) {
        const roomDest = this.GetAtCoord(roomSource.x, roomSource.y + 1)
        const door = new Door(roomSource, roomDest)

        roomSource.doorSouth = door
        roomDest.doorSouth = door
    }
    CreateDoorEast(roomSource) {
        const roomDest = this.GetAtCoord(roomSource.x + 1, roomSource.y)
        const door = new Door(roomSource, roomDest)

        roomSource.doorEast = door
        roomDest.doorEast = door
    }
    CreateDoorWest(roomSource) {
        const roomDest = this.GetAtCoord(roomSource.x - 1, roomSource.y)
        const door = new Door(roomSource, roomDest)

        roomSource.doorWest = door
        roomDest.doorWest = door
    }

    CanPutDoorNorthAt(x, y) {        
        return this.GetAtCoord(x, y - 1).GetDoorCount() === 0
    }
    CanPutDoorSouthAt(x, y) {       
        return this.GetAtCoord(x, y + 1).GetDoorCount() === 0
    }
    CanPutDoorWestAt(x, y) {     
        return this.GetAtCoord(x - 1, y).GetDoorCount() === 0
    }
    CanPutDoorEastAt(x, y) {
       
        return this.GetAtCoord(x + 1, y).GetDoorCount() === 0
    }
}
