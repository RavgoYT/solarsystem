import { planetData, planetNames, planetColors, planetSizes, planetDistances } from './planetData.js';
import { createPlanetaryGlow, createJupiterBelts, createSaturnRings, createUranusRings, createJupiterRings, addPlanetLight } from './planetFeatures.js';
import { applyOrbitalMechanics } from './orbitalMechanics.js';
import { realMoonData } from '../moons/moonData.js';
import { createMoons } from '../moons/moonCreation.js';
import { lightingConfig } from '../config/config.js';

export function createPlanets(scene, camera) {
    const orbs = [];
    const orbitLines = [];

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(50 * 0.7, 128, 128);
    const sunMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffff66,
        emissive: 0xffff66,
        emissiveIntensity: 7
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun glow layers
    const glowLayers = [
        { size: 65 * 0.7, color: 0xffff99, opacity: 0.3 },
        { size: 80 * 0.7, color: 0xffaa00, opacity: 0.15 },
        { size: 300 * 0.7, color: 0xffcc00, opacity: 0.001 }
    ];
    glowLayers.forEach(layer => {
        const glowGeometry = new THREE.SphereGeometry(layer.size, 64, 64);
        const glowMaterial = new THREE.MeshPhysicalMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        scene.add(glow);
    });

    // Lighting setup
    const sunLight = new THREE.PointLight(
        lightingConfig.sunLight.color,
        lightingConfig.sunLight.intensity,
        lightingConfig.sunLight.distance,
        lightingConfig.sunLight.decay
    );
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = lightingConfig.sunLight.shadow.mapSize.width;
    sunLight.shadow.mapSize.height = lightingConfig.sunLight.shadow.mapSize.height;
    sunLight.shadow.camera.near = lightingConfig.sunLight.shadow.camera.near;
    sunLight.shadow.camera.far = lightingConfig.sunLight.shadow.camera.far;
    scene.add(sunLight);

    const directionalLight = new THREE.DirectionalLight(
        lightingConfig.directionalLight.color,
        lightingConfig.directionalLight.intensity
    );
    directionalLight.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = lightingConfig.directionalLight.shadow.mapSize.width;
    directionalLight.shadow.mapSize.height = lightingConfig.directionalLight.shadow.mapSize.height;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(
        lightingConfig.ambientLight.color,
        lightingConfig.ambientLight.intensity
    );
    scene.add(ambientLight);

    // Create planets
    for (let i = 0; i < planetData.length; i++) {
        const distance = planetDistances[i];
        const radius = planetSizes[i];
        const planetGeometry = new THREE.SphereGeometry(radius, 96, 96);
        const orbMaterial = new THREE.MeshStandardMaterial({
            color: planetColors[i],
            roughness: 0.7,
            metalness: 0.2
        });
        const orb = new THREE.Mesh(planetGeometry, orbMaterial);

        // Initial position with orbital inclination
        const angle = Math.random() * Math.PI * 2;
        const orbitalInclination = planetData[i].orbitalInclination * Math.PI / 180;
        orb.position.set(
            Math.cos(angle) * distance,
            Math.sin(orbitalInclination) * distance * Math.sin(angle) * 0.2,
            Math.sin(angle) * distance * Math.cos(orbitalInclination)
        );

        // Apply orbital mechanics
        applyOrbitalMechanics(orb, planetData[i]);

        // Store initial orbital data
        orb.angle = angle;
        orb.distance = distance;
        orb.name = planetNames[i];
        orb.orbitPath = [];
        orb.castShadow = true;
        orb.receiveShadow = true;
        orb.moons = [];

        // Add planetary features
        createPlanetaryGlow(orb, i, camera);
        if (i === 4) {
            createJupiterBelts(orb);
            createJupiterRings(orb);
            const jupiterShader = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    baseColor: { value: new THREE.Color(planetColors[i]) }
                },
                // i dont actually know how these work, theyre just copy pasted but they work so whatever.
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 baseColor;
                    varying vec2 vUv;
                    varying vec3 vPosition;

                    float noise(vec2 p) {
                        return sin(p.x * 10.0 + time * 0.5) * sin(p.y * 15.0 + time * 0.3) * 0.5 + 0.5;
                    }

                    void main() {
                        vec2 uv = vUv;
                        float flow1 = noise(uv * 3.0 + vec2(time * 0.1, 0.0));
                        float flow2 = noise(uv * 5.0 + vec2(time * 0.15, time * 0.05));
                        float flow3 = noise(uv * 8.0 + vec2(time * 0.08, time * 0.12));
                        vec3 cloudColor = mix(baseColor * 0.8, baseColor * 1.2, flow1);
                        cloudColor = mix(cloudColor, baseColor * 0.9, flow2 * 0.5);
                        cloudColor = mix(cloudColor, vec3(0.9, 0.7, 0.4), flow3 * 0.3);
                        gl_FragColor = vec4(cloudColor, 1.0);
                    }
                `
            });
            orb.material = jupiterShader;
            orb.userData.animateJupiter = true;
        }
        if (i === 5) {
            createSaturnRings(orb);
            addPlanetLight(orb, i);
        }
        if (i === 6) {
            createUranusRings(orb);
            addPlanetLight(orb, i);
        }
        if (realMoonData[i]) {
            addPlanetLight(orb, i);
        }

        // Create moons
        if (realMoonData[i]) {
            createMoons(orb, i, camera);
        }

        orbs.push(orb);
        scene.add(orb);

        // Create orbit lines
        const orbitGeometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: false,
            opacity: 1
        });
        const line = new THREE.Line(orbitGeometry, material);
        orbitLines.push(line);
        scene.add(line);
    }

    return { orbs, orbitLines };
}