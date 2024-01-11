import { BoxGeometry, Color, HemisphereLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry } from "three";
import CustomSceneObject from "../../server/customSceneObject.js";
import Server from "../../server/server.js";
import PlayerModelModule from "../../modules/playerModelModule.js";
import PlayerChatModule from "../../modules/playerChatModule.js";

class DemoServer2 extends Server {
    init() {
        this.registerModules(new PlayerModelModule(this), new PlayerChatModule(this));
        
        this.hemisphereLight = new CustomSceneObject(this, new HemisphereLight(0xffffff, 0x443300));

        const playSpace = new Mesh(
            new BoxGeometry(1024, 1024, 1024),
            new MeshBasicMaterial({ color: 0x888888, wireframe: true })
        );

        this.world.createGameObject(playSpace);

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
}

export default DemoServer2;