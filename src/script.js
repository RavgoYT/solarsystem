import { sceneConfig, cameraConfig, rendererConfig } from './config/config.js';
import { createPlanets } from './planets/planetCreation.js';
import { createRealisticStarfield } from './starField/starField.js';
import { createOrbitControls } from './ui/orbitControls.js';
import { setupCameraControls, updateCamera } from './ui/cameraControls.js';
import { setupUIElements } from './ui/uiElements.js';
import { updatePhysics } from './planets/orbitalMechanics.js';


/*

Everything in here needs a bit of a reorganize. The whole point of having modules is so that the main script isn't really long
and messy, but right now it is. I need to move the camera controls and the UI elements into their own modules, and then import them here.
This will make the code cleaner and easier to maintain.

Hi to anyone reading this btw lol.

*/


// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(sceneConfig.backgroundColor);
const camera = new THREE.PerspectiveCamera(
    cameraConfig.fov,
    window.innerWidth / window.innerHeight,
    cameraConfig.near,
    cameraConfig.far
);
const renderer = new THREE.WebGLRenderer({
    alpha: rendererConfig.alpha,
    antialias: rendererConfig.antialias
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = rendererConfig.shadowMap.enabled;
renderer.shadowMap.type = rendererConfig.shadowMap.type;
renderer.toneMapping = rendererConfig.toneMapping;
renderer.toneMappingExposure = rendererConfig.toneMappingExposure;
document.body.appendChild(renderer.domElement);

// Initialize components
const controls = createOrbitControls(camera, renderer.domElement);
createRealisticStarfield(scene);
const { orbs, orbitLines } = createPlanets(scene, camera);
setupCameraControls(orbs, orbitLines, camera, controls);
setupUIElements();

// --- Global State for Camera/Target/Transitions ---
let currentTargetIndex = -1;
let currentMoonIndex = -1;
let inMoonView = false;
let isTidalLocked = false;
let isMoonTidalLocked = false;
let isTransitioning = false;
let transitionProgress = 0;
let transitionDuration = 1.0;
let startCameraPosition = new THREE.Vector3();
let startTargetPosition = new THREE.Vector3();
let timeScale = 0.1;
const targetNameElement = document.getElementById('targetName');
const tidalStatusElement = document.getElementById('tidalStatus');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

speedSlider.addEventListener('input', (event) => {
    timeScale = parseFloat(event.target.value);
    speedValue.textContent = timeScale.toFixed(2);
});

function toggleTidalLock() {
    if (currentTargetIndex >= 0) {
        if (inMoonView && currentMoonIndex >= 0) {
            isMoonTidalLocked = !isMoonTidalLocked;
            controls.enableRotate = !isMoonTidalLocked;
        } else if (!inMoonView) {
            isTidalLocked = !isTidalLocked;
            updateTidalStatus();
            controls.enableRotate = !isTidalLocked;
        }
    }
}

function updateTidalStatus() {
    if (currentTargetIndex >= 0 && isTidalLocked && !inMoonView) {
        tidalStatusElement.textContent = "🔒 Tidal Locked to Sun";
        tidalStatusElement.style.display = "block";
    } else if (currentTargetIndex >= 0 && isMoonTidalLocked && inMoonView) {
        tidalStatusElement.textContent = "🔒 Tidal Locked to Planet";
        tidalStatusElement.style.display = "block";
    } else {
        tidalStatusElement.style.display = "none";
    }
}

function updateTarget() {
    startCameraPosition.copy(camera.position);
    startTargetPosition.copy(controls.target);
    transitionProgress = 0;
    isTransitioning = true;
    // Dynamically set minDistance based on current target
    if (currentTargetIndex === -1) {
        targetNameElement.textContent = 'Sun';
        isTidalLocked = false;
        controls.enableRotate = true;
        controls.minDistance = 500; // Sun view default
    } else if (inMoonView && currentMoonIndex >= 0) {
        const moon = orbs[currentTargetIndex].moons[currentMoonIndex];
        targetNameElement.textContent = moon.name;
        isTidalLocked = false;
        controls.enableRotate = true;
        // Set minDistance for moon
        const moonRadius = moon.geometry.parameters.radius;
        controls.minDistance = Math.max(moonRadius * 4, 10);
    } else {
        targetNameElement.textContent = orbs[currentTargetIndex].name;
        controls.enableRotate = !isTidalLocked;
        // Set minDistance for planet
        const planet = orbs[currentTargetIndex];
        const planetRadius = planet.geometry.parameters.radius;
        controls.minDistance = Math.max(planetRadius * 4, 10);
    }
    updateTidalStatus();
}

function getOptimalCameraDistance(planetIndex) {
    if (planetIndex === -1) return 1500;
    const planet = orbs[planetIndex];
    const planetRadius = planet.geometry.parameters.radius;
    const fov = camera.fov * Math.PI / 180;
    const targetSize = planetRadius * 8;
    const distance = targetSize / Math.tan(fov / 2);
    return Math.max(distance, planetRadius * 4);
}

function toggleMoonView() {
    if (currentTargetIndex >= 0 && orbs[currentTargetIndex].moons.length > 0) {
        if (!inMoonView) {
            inMoonView = true;
            currentMoonIndex = 0;
            updateTarget();
        } else {
            inMoonView = false;
            currentMoonIndex = -1;
            updateTarget();
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        if (inMoonView && currentTargetIndex >= 0 && orbs[currentTargetIndex].moons.length > 1) {
            currentMoonIndex = (currentMoonIndex + 1) % orbs[currentTargetIndex].moons.length;
            updateTarget();
        } else if (!inMoonView) {
            currentTargetIndex = currentTargetIndex >= orbs.length - 1 ? -1 : currentTargetIndex + 1;
            inMoonView = false;
            currentMoonIndex = -1;
            updateTarget();
        }
    } else if (event.key === 'ArrowLeft') {
        if (inMoonView && currentTargetIndex >= 0 && orbs[currentTargetIndex].moons.length > 1) {
            currentMoonIndex = currentMoonIndex <= 0 ? orbs[currentTargetIndex].moons.length - 1 : currentMoonIndex - 1;
            updateTarget();
        } else if (!inMoonView) {
            currentTargetIndex = currentTargetIndex <= -1 ? orbs.length - 1 : currentTargetIndex - 1;
            inMoonView = false;
            currentMoonIndex = -1;
            updateTarget();
        }
    } else if (event.key === ' ') {
        event.preventDefault();
        currentTargetIndex = -1;
        inMoonView = false;
        currentMoonIndex = -1;
        updateTarget();
    } else if (event.key === 'm' || event.key === 'M') {
        toggleMoonView();
    } else if (event.key === 'l' || event.key === 'L') {
        toggleTidalLock();
    }
});

function updateCameraTransition(deltaTime) {
    if (isTransitioning) {
        transitionProgress += deltaTime / transitionDuration;
        if (transitionProgress >= 1.0) {
            transitionProgress = 1.0;
            isTransitioning = false;
        }
        const t = transitionProgress * transitionProgress * (3.0 - 2.0 * transitionProgress);
        let targetPosition = new THREE.Vector3();
        let cameraTargetPosition = new THREE.Vector3();
        if (currentTargetIndex === -1) {
            // Sun view
            targetPosition.set(0, 0, 0);
            cameraTargetPosition.copy(startCameraPosition).lerp(new THREE.Vector3(0, 500, 1500), t);
        } else if (inMoonView && currentMoonIndex >= 0) {
            // Moon view
            const planet = orbs[currentTargetIndex];
            const moon = planet.moons[currentMoonIndex];
            const moonWorldPosition = new THREE.Vector3();
            moon.getWorldPosition(moonWorldPosition);
            targetPosition.copy(moonWorldPosition);
            const moonRadius = moon.geometry.parameters.radius;
            const optimalDistance = moonRadius * 8;
            const direction = new THREE.Vector3(1, 0.5, 1).normalize();
            const desiredCameraPos = new THREE.Vector3().addVectors(moonWorldPosition, direction.multiplyScalar(optimalDistance));
            cameraTargetPosition.copy(startCameraPosition).lerp(desiredCameraPos, t);
        } else {
            // Planet view
            const planet = orbs[currentTargetIndex];
            targetPosition.copy(planet.position);
            const optimalDistance = getOptimalCameraDistance(currentTargetIndex);
            const direction = new THREE.Vector3(1, 0.5, 1).normalize();
            const desiredCameraPos = new THREE.Vector3().addVectors(planet.position, direction.multiplyScalar(optimalDistance));
            cameraTargetPosition.copy(startCameraPosition).lerp(desiredCameraPos, t);
        }
        // Lerp controls' target
        controls.target.copy(startTargetPosition).lerp(targetPosition, t);
        camera.position.copy(cameraTargetPosition);
        camera.lookAt(controls.target);
    }
}

camera.position.set(0, 500, 1500);
controls.target.set(0, 0, 0);
controls.update();

function updateCameraFollowing() {
    if (currentTargetIndex >= 0 && currentTargetIndex < orbs.length) {
        let targetPosition = new THREE.Vector3();
        if (inMoonView && currentMoonIndex >= 0) {
            // Follow moon
            const moon = orbs[currentTargetIndex].moons[currentMoonIndex];
            moon.getWorldPosition(targetPosition);
        } else {
            // Follow planet
            targetPosition.copy(orbs[currentTargetIndex].position);
        }
        const oldTarget = controls.target.clone();
        controls.target.copy(targetPosition);
        const targetDelta = new THREE.Vector3().subVectors(controls.target, oldTarget);
        camera.position.add(targetDelta);
        if (isTidalLocked && !inMoonView) {
            const sunPosition = new THREE.Vector3(0, 0, 0);
            const planetPosition = controls.target;
            const directionToSun = new THREE.Vector3().subVectors(sunPosition, planetPosition).normalize();
            // Enforce minimum distance for tidal lock
            let distance = camera.position.distanceTo(controls.target);
            const minDistance = getOptimalCameraDistance(currentTargetIndex);
            if (distance < minDistance) distance = minDistance;
            const tidalLockedPosition = new THREE.Vector3()
                .copy(planetPosition)
                .add(directionToSun.multiplyScalar(-distance));
            camera.position.lerp(tidalLockedPosition, 0.05);
            camera.lookAt(controls.target);
        } else if (isMoonTidalLocked && inMoonView && currentMoonIndex >= 0) {
            // Tidal lock to planet from moon
            const planet = orbs[currentTargetIndex];
            const moon = planet.moons[currentMoonIndex];
            const planetWorldPosition = new THREE.Vector3();
            planet.getWorldPosition(planetWorldPosition);
            const moonWorldPosition = new THREE.Vector3();
            moon.getWorldPosition(moonWorldPosition);
            const directionToPlanet = new THREE.Vector3().subVectors(planetWorldPosition, moonWorldPosition).normalize();
            let distance = camera.position.distanceTo(controls.target);
            const minDistance = Math.max(moon.geometry.parameters.radius * 4, 10);
            if (distance < minDistance) distance = minDistance;
            const tidalLockedPosition = new THREE.Vector3()
                .copy(moonWorldPosition)
                .add(directionToPlanet.multiplyScalar(-distance));
            camera.position.lerp(tidalLockedPosition, 0.05);
            camera.lookAt(controls.target);
        } else {
            if (!controls.rotatingState && !controls.zoomingState && !controls.panningState) {
                const currentDistance = camera.position.distanceTo(controls.target);
                let optimalDistance;
                if (inMoonView && currentMoonIndex >= 0) {
                    const moon = orbs[currentTargetIndex].moons[currentMoonIndex];
                    const moonRadius = moon.geometry.parameters.radius;
                    optimalDistance = moonRadius * 8;
                } else {
                    optimalDistance = getOptimalCameraDistance(currentTargetIndex);
                }
                const distanceRatio = currentDistance / optimalDistance;
                if (distanceRatio < 0.5 || distanceRatio > 2.0) {
                    const targetDistance = THREE.MathUtils.lerp(currentDistance, optimalDistance, 0.02);
                    const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
                    camera.position.copy(controls.target).add(direction.multiplyScalar(targetDistance));
                }
            }
        }
    }
}

// Animation loop
let lastTime = performance.now();
let currentOrbIndex = 0;
function animate() {
    requestAnimationFrame(animate);
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000.0;
    lastTime = currentTime;
    updatePhysics(orbs, scene, timeScale);
    // Animate Saturn rings (if using custom shader/uniforms)
    if (orbs[5] && orbs[5].userData && orbs[5].userData.rings) {
        orbs[5].userData.rings.forEach(ringMaterial => {
            if (ringMaterial.uniforms && ringMaterial.uniforms.time) {
                ringMaterial.uniforms.time.value = currentTime * 0.001;
                if (ringMaterial.uniforms.sunPosition) ringMaterial.uniforms.sunPosition.value.set(0, 0, 0);
                if (ringMaterial.uniforms.planetPosition) ringMaterial.uniforms.planetPosition.value.copy(orbs[5].position);
            }
        });
    }
    // Animate Jupiter surface
    if (orbs[4] && orbs[4].userData && orbs[4].userData.animateJupiter && orbs[4].material && orbs[4].material.uniforms && orbs[4].material.uniforms.time) {
        orbs[4].material.uniforms.time.value = currentTime * 0.001;
    }
    updateCameraTransition(deltaTime);
    if (!isTransitioning) {
        updateCameraFollowing();
        controls.update();
    }
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});