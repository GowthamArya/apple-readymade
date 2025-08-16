import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('model.glb', function (gltf) {
    scene.add(gltf.scene);

    // If animated
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());

    // In your animation loop
    function animate() {
        requestAnimationFrame(animate);
        mixer.update(clock.getDelta());
        renderer.render(scene, camera);
    }
    animate();
});
