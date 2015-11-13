function Button(PosX,PosY,PosZ) {
	this.PosX = PosX;
	this.PosY = PosY;
	this.PosZ = PosZ;
}
function Enemy(PosX,PosZ,type) {
	this.PosX = PosX;
	this.PosY = 10;
	this.PosZ = PosZ;
	this.type = type;
}
function Obstacle(PosX,PosY,PosZ,length,width,height) {
	this.PosX = PosX;
	this.PosY = PosY;
	this.PosZ = PosZ;
	this.length = length;
	this.width = width;
	this.height = height;
}

var Prototype = {
	buttons: [new Button(30,15,30),new Button(-30,13,30)],
	enemies: [new Enemy(100,-100,'Thumb'),new Enemy(-100,-100,'Thumb')],
	obstacles: [new Obstacle(10,10,-40,20,20,20)]
};