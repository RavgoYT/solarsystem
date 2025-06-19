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
let timeScale = 1; // 1x is real time
const targetNameElement = document.getElementById('targetName');
const tidalStatusElement = document.getElementById('tidalStatus');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

// --- Speed slider min/max logic ---
const SPEED_MIN = 0; // stopped
const SPEED_MAX = 100; // super fast, set as you like
const SPEED_REALTIME = 0.000001; // set your real time value

speedSlider.min = SPEED_MIN;
speedSlider.max = SPEED_MAX;
speedSlider.step = 0.001;
speedSlider.value = 1;

timeScale = SPEED_REALTIME;

function updateSpeedDisplay(val) {
    let displayVal;
    if (val == 0) {
        speedValue.textContent = 'Stopped';
        return;
    } else if (val == 1) {
        speedValue.textContent = '1x (Real Time)';
        return;
    } else if (val == SPEED_MAX) {
        speedValue.textContent = '1000x';
        return;
    }
    // Above 2: steps of 5, no decimals
    if (val > 2) {
        displayVal = Math.round(val / 5) * 5;
        speedValue.textContent = displayVal + 'x';
    } else if (val > 0.5) {
        // 0.5 to 2: steps of 0.5
        displayVal = Math.round(val * 2) / 2;
        speedValue.textContent = displayVal.toFixed(1).replace(/\.0$/, '') + 'x';
    } else {
        // 0 to 0.5: steps of 0.05
        displayVal = Math.round(val / 0.05) * 0.05;
        speedValue.textContent = displayVal.toFixed(2).replace(/0+$/, '').replace(/\.$/, '') + 'x';
    }
}

speedSlider.addEventListener('input', (event) => {
    let sliderVal = parseFloat(event.target.value);
    if (sliderVal === 1) {
        timeScale = SPEED_REALTIME;
    } else if (sliderVal === SPEED_MAX) {
        timeScale = 1000;
    } else {
        timeScale = sliderVal;
    }
    updateSpeedDisplay(sliderVal);
});

// Initialize display
updateSpeedDisplay(speedSlider.value);

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

// Restore h key toggle for tooltips, UI, and orbit lines
window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        tooltipsEnabled = !tooltipsEnabled;
        // Toggle UI panel
        const panel = document.querySelector('.control-panel');
        if (panel) panel.style.display = tooltipsEnabled ? '' : 'none';
        // Toggle orbit lines (planets)
        orbitLines.forEach(line => line.visible = tooltipsEnabled);
        // Toggle moon orbit lines (only those for the current planet)
        orbs.forEach((orb, i) => {
            if (orb.moons) {
                orb.moons.forEach(moon => {
                    if (moon.orbitLine) {
                        // Only show if in planet view of this planet, or in moon view of this planet
                        moon.orbitLine.visible = tooltipsEnabled && (
                            (inMoonView && currentTargetIndex === i) || (!inMoonView && currentTargetIndex === i)
                        );
                    }
                });
            }
        });
        // Also immediately update tooltips
        updateTooltips();
        // Toggle controls UI (instructions)
        const instructions = document.getElementById('instructions');
        if (instructions) instructions.style.display = tooltipsEnabled ? '' : 'none';
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

// Tooltip always-on logic for planets, moons, galaxies
let tooltipsEnabled = true;
const raycaster = new THREE.Raycaster();
const tooltip = window._solarSystemTooltip;
const tooltipElements = [];
const moonTooltipElements = [];

function createTooltipForObject(obj, label, isMoon = false) {
    const el = document.createElement('div');
    el.className = 'object-tooltip';
    el.innerHTML = label;
    el.style.position = 'absolute';
    el.style.pointerEvents = 'none';
    el.style.background = 'rgba(30,30,40,0.95)';
    el.style.color = '#fff';
    el.style.padding = '8px 16px';
    el.style.borderRadius = '10px';
    el.style.fontSize = '1.05em';
    el.style.fontWeight = 'bold';
    el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
    el.style.transition = 'opacity 0.2s';
    el.style.opacity = '1';
    el.style.zIndex = '1000';
    document.body.appendChild(el);
    if (isMoon) {
        moonTooltipElements.push({el, obj});
    } else {
        tooltipElements.push({el, obj});
    }
}

function getObjectLabel(obj) {
    if (obj.userData && obj.userData.isMoon) {
        return `<b>${obj.name}</b>`;
    } else if (obj.userData && obj.userData.isPlanet) {
        return `<b>${obj.name}</b>`;
    } else if (obj.name && obj.name.includes('galaxy')) {
        return `<b>${obj.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</b>`;
    } else if (obj.name && obj.name.startsWith('stars_')) {
        return `<b>${obj.name.replace('stars_', '').toUpperCase()} Class Stars</b>`;
    }
    return null;
}

// Mark planets and moons for tooltips
orbs.forEach((orb, planetIdx) => {
    orb.userData.isPlanet = true;
    createTooltipForObject(orb, getObjectLabel(orb));
    orb.moons.forEach((moon, moonIdx) => {
        moon.userData.isMoon = true;
        createTooltipForObject(moon, getObjectLabel(moon), true);
    });
});

// Hover logic for moons
window.addEventListener('pointermove', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(orbs.flatMap(orb => orb.moons), true);
    let found = false;
    moonTooltipElements.forEach(({el, obj}) => {
        el.style.opacity = '0';
    });
    for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        const moonTip = moonTooltipElements.find(t => t.obj === obj);
        if (moonTip) {
            moonTip.el.style.opacity = '1';
            found = true;
            break;
        }
    }
});

function updateTooltips() {
    if (!tooltipsEnabled) {
        tooltipElements.forEach(({el}) => el.style.opacity = '0');
        moonTooltipElements.forEach(({el}) => el.style.opacity = '0');
        return;
    }
    tooltipElements.forEach(({el, obj}, idx) => {
        // In moon view: only show the parent planet's tooltip
        if (inMoonView) {
            if (currentTargetIndex >= 0 && obj === orbs[currentTargetIndex]) {
                el.style.opacity = '1';
            } else {
                el.style.opacity = '0';
            }
        } else {
            // Hide tooltip if this is the current planet
            if (!inMoonView && currentTargetIndex >= 0 && obj === orbs[currentTargetIndex]) {
                el.style.opacity = '0';
                return;
            }
            el.style.opacity = '1';
        }
        // Position
        let pos = new THREE.Vector3();
        if (obj.getWorldPosition) {
            obj.getWorldPosition(pos);
        } else if (obj.position) {
            pos.copy(obj.position);
        }
        pos.project(camera);
        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
        el.style.left = `${x}px`;
        el.style.top = `${y - 32}px`;
    });
    // Moon tooltips: only show on hover, or if in planet view for that planet, or in moon view for that planet (except the selected moon)
    moonTooltipElements.forEach(({el, obj}) => {
        let show = false;
        // Show if hovered (opacity already set to 1 by pointermove handler)
        if (el.style.opacity === '1') {
            show = true;
        } else if (!inMoonView && currentTargetIndex >= 0 && orbs[currentTargetIndex].moons.includes(obj)) {
            show = true;
        } else if (inMoonView && currentTargetIndex >= 0 && orbs[currentTargetIndex].moons.includes(obj)) {
            // Hide the tooltip for the currently selected moon
            if (!(currentMoonIndex >= 0 && obj === orbs[currentTargetIndex].moons[currentMoonIndex])) {
                show = true;
            }
        }
        if (show) {
            let pos = new THREE.Vector3();
            if (obj.getWorldPosition) {
                obj.getWorldPosition(pos);
            } else if (obj.position) {
                pos.copy(obj.position);
            }
            pos.project(camera);
            const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
            el.style.left = `${x}px`;
            el.style.top = `${y - 32}px`;
            el.style.opacity = '1';
        } else {
            el.style.opacity = '0';
        }
    });
}

// Animation loop
let lastTime = performance.now();
let currentOrbIndex = 0;
function animate() {
    requestAnimationFrame(animate);
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000.0;
    lastTime = currentTime;
    updatePhysics(orbs, scene, timeScale, tooltipsEnabled, inMoonView, currentTargetIndex);
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
    updateTooltips(); // <-- Ensure tooltips update every frame
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Ensure tooltips are visible by default
setTimeout(() => { updateTooltips(); }, 100);