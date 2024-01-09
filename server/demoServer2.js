import { BackSide, BoxGeometry, Color, HemisphereLight, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Object3D, SphereGeometry } from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import Server from "./server.js";
import { readFileSync } from "fs";

class DemoServer2 extends Server {
    init() {
        this.playerBodies = new Map();

        const playSpace = new Mesh(
            new BoxGeometry(1024, 1024, 1024),
            new MeshBasicMaterial({ color: 0x888888, wireframe: true })
        );

        this.world.createGameObject(playSpace);

        const light = new HemisphereLight(0xffffff, 0x443300);
        const lightParent = new Object3D();
        lightParent.add(light);
        this.world.createGameObject(lightParent);

        for(let i = 0; i < 256; i++) {
            const mesh = new Mesh(new SphereGeometry(4 + Math.random() * 16), new MeshPhongMaterial({ color: new Color(Math.random(), Math.random(), Math.random()) }));
            const gameObject = this.world.createGameObject(mesh);

            let velocityX = 0;
            let velocityY = 0;
            let velocityZ = 0;

            setInterval(() => {
                velocityX = Math.max(-10, Math.min(10, velocityX + (Math.random() - 0.5) * 2));
                velocityY = Math.max(-10, Math.min(10, velocityY + (Math.random() - 0.5) * 2));
                velocityZ = Math.max(-10, Math.min(10, velocityZ + (Math.random() - 0.5) * 2));

                let { x, y, z } = gameObject.position.value;

                const BOUND_SIZE = 512;
                if(Math.abs(x) > BOUND_SIZE) {
                    velocityX *= -1;
                }
                if(Math.abs(y) > BOUND_SIZE) {
                    velocityY *= -1;
                }
                if(Math.abs(z) > BOUND_SIZE) {
                    velocityZ *= -1;
                }

                gameObject.position.value.set(x + velocityX, y + velocityY, z + velocityZ);
            }, 50);
        }
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

export default DemoServer2;