import { BoxGeometry, Euler, HemisphereLight, Mesh, MeshNormalMaterial, MeshPhongMaterial, PlaneGeometry, Quaternion, SphereGeometry, TorusGeometry, Vector3 } from "three";
import Server from "../../server/server.js";
import CustomSceneObject from "../../server/customSceneObject.js";
import PlayerModelModule from "../../modules/playerModelModule.js";
import PlayerChatModule from "../../modules/playerChatModule.js";

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
        this.registerModules(new PlayerModelModule(this), new PlayerChatModule(this));

        this.hemisphereLight = new CustomSceneObject(this, new HemisphereLight(0xffffff, 0x443300));

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


        setInterval(() => this.createNewRevolvingBox(), 200);


        const torusGeometry = new TorusGeometry(1024, 256, 256, 128);
        const torus = new Mesh(torusGeometry, new MeshPhongMaterial({ color: 0x8888ff }));

        const torusObject = this.world.createGameObject(torus);
        torusObject.rotation.value.set(Math.PI * 0.5, 0, 0);

        let goingClockwise = false;
        for(let radius = 16; radius <= 512; radius += 64) {
            goingClockwise = !goingClockwise;

            let speed = 200 / (radius * Math.PI * 2);
            speed *= goingClockwise ? 1 : -1;

            for(let theta = 0; theta < Math.PI * 2; theta += Math.PI * Math.abs(speed)) {
        
                const mesh = new Mesh(new SphereGeometry(16), new MeshNormalMaterial());
                const gameObject = this.world.createGameObject(mesh);

                setInterval(() => {
                    const a = theta + performance.now() * 0.001 * speed;

                    const x = Math.cos(a) * radius;
                    const z = Math.sin(a) * radius;
        
                    gameObject.position.value.set(x, 0, z);
                }, 50);
            }
        }
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
        }, 50);
        update();

        setTimeout(() => {
            this.world.removeGameObject(gameObject);
            clearInterval(updateInterval);
        }, Math.random() * 10000 + 5000);
    }
}

export default DemoServer;