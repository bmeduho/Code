var camera, scene, renderer;
var geometry, material, mesh;
var objects = [];

var buttonMesh = [], obstacleMesh = [], enemyMesh = [];
var level = Prototype;
var controlsEnabled = true;
var raycaster;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
	scene.add( camera );
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true; break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	// floor
	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	/*for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;
	}*/
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.rotation.x = -Math.PI / 2;
	scene.add( mesh );
	// objects.buttons
	for (var i = 0; i < level.buttons.length; i++) {
		geometry = new THREE.PlaneGeometry(5,5);
		material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide});
		mesh = new THREE.Mesh(geometry,material);
		mesh.position.x = level.buttons[i].PosX;
		mesh.position.y = level.buttons[i].PosY;
		mesh.position.z = level.buttons[i].PosZ;
		scene.add(mesh);
		mesh.objectType = "Button";
		objects.push(mesh);
	}
	for (var i = 0; i < level.obstacles.length; i++) {
		geometry = new THREE.BoxGeometry(level.obstacles[i].width,level.obstacles[i].height,level.obstacles[i].length);
		material = new THREE.MeshBasicMaterial( {color: 0xff00ff, side: THREE.FrontSide});
		mesh = new THREE.Mesh(geometry,material);
		mesh.position.x = level.obstacles[i].PosX;
		mesh.position.y = level.obstacles[i].PosY;
		mesh.position.z = level.obstacles[i].PosZ;
		scene.add(mesh);
		mesh.objectType = "Cube";
		objects.push(mesh);
	}
	for (var i = 0; i < level.enemies.length; i++) {
		if (level.enemies[i].type === 'Thumb') {
			geometry = new THREE.SphereGeometry(5,16,16);
			material = new THREE.MeshBasicMaterial( {color: 0x00ffff, side: THREE.FrontSide});
			mesh = new THREE.Mesh(geometry,material);
			mesh.position.x = level.enemies[i].PosX;
			mesh.position.y = level.enemies[i].PosY;
			mesh.position.z = level.enemies[i].PosZ;
			scene.add(mesh);
			mesh.objectType = "Thumb";
			objects.push(mesh);
		}
	}




	/*geometry = new THREE.BoxGeometry( 20, 20, 20 );
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	for ( var i = 0; i < 500; i ++ ) {
		material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
		mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
		mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
		scene.add( mesh );
		material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		objects.push( mesh );
	}*/
	// SkySphere
	geometry = new THREE.SphereGeometry(400,16,16);
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
	material.side = THREE.BackSide
	mesh = new THREE.Mesh( geometry, material );
	mesh.rotation.y = -Math.PI / 2;
	scene.add( mesh );
	// Player
		geometry = new THREE.SphereGeometry(10,16,16);
		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		}
		material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
		player = new THREE.Mesh( geometry, material );
		scene.add( player );
	//
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );

	raycaster.ray.origin.copy( player.position );
	raycaster.ray.origin.y -= 10;
	var intersections = raycaster.intersectObjects( objects );
	var isOnObject = intersections.length > 0;
	var time = performance.now();
	var delta = ( time - prevTime ) / 1000;
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	if ( moveForward) velocity.z -= 400.0 * delta;
	if ( moveBackward ) velocity.z += 400.0 * delta;
	if ( moveLeft ) player.rotation.y += 2.0 * delta;
	if ( moveRight ) player.rotation.y -= 2.0 * delta;

	for (var i = 0; i < objects.length; i++) {
		if (objects[i].objectType === "Button") {
			/*if (((player.position.x + 10 || player.position.x || player.position.x - 10) <= buttonMesh[i].position.x + 2.5 && (player.position.x + 10 || player.position.x - 10) >= buttonMesh[i].position.x- 2.5) && ((player.position.y + 10 ||player.position.y ||  player.position.y - 10) <= buttonMesh[i].position.y + 2.5 && (player.position.y + 10 || player.position.y - 10) >= buttonMesh[i].position.y- 2.5) && ((player.position.z + 10 ||player.position.z ||  player.position.z - 10) <= buttonMesh[i].position.z + 2.5 && (player.position.z + 10 || player.position.z - 10) >= buttonMesh[i].position.z - 2.5) && buttonMesh[i].visible === true) {
				console.log("Working");
				buttonMesh[i].visible = false;
			}*/
			objects[i].rotation.y += 5.0 * delta;
		}
		if (objects[i].objectType === "Cube") {
			if ( isOnObject === true ) {
				if (player.position.y > objects[i].position.y + 20)
					velocity.y = Math.max( 0, velocity.y );
					player.position.y = objects[i].position.y + 20;
					canJump = true;
				}
				if (player.position.x + 10 >= objects[i].position.x + 10 && player.position.x + 10 <= objects[i].position.x - 10)
					player.position.x = objects[i].position.x - 20.5;
				} else if (player.position.x - 10 >= objects[i].position.x + 10 && player.position.x - 10 <= objects[i].position.x - 10)
					player.position.x = objects[i].position.x + 20.5;
				}
			}
		}
		if (objects[i].objectType === "Thumb") {
			
		}
	}

	player.translateX( velocity.x * delta );
	player.translateY( velocity.y * delta );
	player.translateZ( velocity.z * delta );
	if ( player.position.y < 10 ) {
		velocity.y = 0;
		player.position.y = 10;
		canJump = true;
	}

	var relativeCameraOffset = new THREE.Vector3(0,0,40);

	var cameraOffset = relativeCameraOffset.applyMatrix4( player.matrixWorld );

	camera.position.x = cameraOffset.x;
	camera.position.y = player.position.y + 20;
	camera.position.z = cameraOffset.z;
	camera.lookAt( player.position );

	prevTime = time;

	renderer.render( scene, camera );
}
init();
animate();