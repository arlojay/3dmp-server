import { BoxGeometry, Color, Euler, HemisphereLight, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3D, ObjectLoader, PlaneGeometry, Quaternion, ShaderMaterial, Vector3 } from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import Server from "./server.js";
import { readFileSync } from "fs";

class RevolvingBox {
    constructor(angle, radius) {
        this.angle = angle;
        this.radius = radius;
        this.speed = 10 / radius;

        this.timeOffset = Math.random() * 1000;
        this.rotationSpeeds = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    getPosition(time) {
        time *= this.speed;
        return this.rotateVector3(
            new Vector3(),
            new Vector3(this.radius * Math.cos(time), 0, this.radius * Math.sin(time)),
            this.angle
        );
    }

    getRotation(time) {
        return new Euler(
            time * 0.315 + this.timeOffset * this.rotationSpeeds.x,
            time * 0.416 + this.timeOffset * this.rotationSpeeds.y,
            time * 0.382 + this.timeOffset * this.rotationSpeeds.z,
        );
    }

    rotateVector3(point, origin, euler) {
        // Create a new vector for the output
        let rotatedVector = new Vector3().copy(point);
    
        // Subtract the origin from the point to get the relative position
        rotatedVector.sub(origin);
    
        // Create a quaternion from the Euler angles
        let quaternion = new Quaternion();
        quaternion.setFromEuler(euler);
    
        // Apply the quaternion rotation to the vector
        rotatedVector.applyQuaternion(quaternion);
    
        // Add the origin back to the rotated vector
        rotatedVector.add(origin);
    
        return rotatedVector;
    }
}

class DemoServer extends Server {
    init() {
        this.playerBodies = new Map();

        // Create the shader material
        const customShader = new MeshPhongMaterial({ color: 0x888888 });

        const ground = new Mesh(
            new PlaneGeometry(4096, 4096, 256, 256),
            customShader
        );

        const groundObject = this.world.createGameObject(ground);

        groundObject.rotation.value.set(Math.PI * -0.5, 0, 0);
        groundObject.position.value.set(0, -200, 0);

        for(let i = 0; i < 8; i++) {
            this.createNewRevolvingBox();
        }

        const light = new HemisphereLight(0xffffff, 0x443300);
        const lightParent = new Object3D();
        lightParent.add(light);
        this.world.createGameObject(lightParent);


        setInterval(() => this.createNewRevolvingBox(), 200);
    }

    createNewRevolvingBox() {
        const geometry = new BoxGeometry(6, 4, 12);
        const material = new MeshPhongMaterial();

        const box = new RevolvingBox(
            new Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2),
            Math.random() * 50 + 20
        );

        const gameObject = this.world.createGameObject(new Mesh(geometry, material));

        function update() {
            const time = performance.now() * 0.001;
            gameObject.position.value.copy(box.getPosition(time));
            gameObject.rotation.value.copy(box.getRotation(time));
        }

        const updateInterval = setInterval(() => {
            update();
        }, 5);
        update();

        setTimeout(() => {
            this.world.removeGameObject(gameObject);
            clearInterval(updateInterval);
        }, Math.random() * 10000 + 5000);
    }

    async onConnection(player) {
        const loader = new OBJLoader();
        const skullData = readFileSync("./skull.obj").toString();
        
        const geometry = loader.parse(skullData).children[0].geometry;
        const material = new MeshPhongMaterial({ color: 0xffffff, wireframe: false });

        const playerBody = new Mesh(geometry, material);


        const gameObject = this.world.createGameObject(playerBody);
        await new Promise(r => setTimeout(r, 100));
        this.world.setObjectVisible(gameObject, player.id, false);

        this.playerBodies.set(player, gameObject);

        player.peer.on("set-player-position", packet => {
            const [x, y, z] = packet.content;

            gameObject.position.value.set(x, y, z);
        });
        player.peer.on("set-player-rotation", packet => {
            const [x, y, z] = packet.content.slice(0, 3);
            gameObject.rotation.value.set(x, y, z);
            gameObject.rotation.value.order = packet.content[3];
        });
    }

    onDisconnection(player) {
        const playerBody = this.playerBodies.get(player);

        this.world.removeGameObject(playerBody);
    }
}

export default DemoServer;