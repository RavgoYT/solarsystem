import { realMoonData } from './moonData.js';
import { applyMoonOrbitalMechanics } from './moonOrbitalMechanics.js';
import { createPlanetaryGlow } from '../planets/planetFeatures.js';

export function createMoons(orb, planetIndex, camera) {
    // Add named moons first
    if (realMoonData[planetIndex]) {
        realMoonData[planetIndex].forEach((moonInfo, moonIndex) => {
            const moonGeometry = new THREE.SphereGeometry(moonInfo.size, 48, 48);
            const moonMaterial = new THREE.MeshStandardMaterial({
                color: moonInfo.color,
                roughness: 0.8,
                metalness: 0.1
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            const initialAngle = (moonIndex / realMoonData[planetIndex].length) * Math.PI * 2;
            const initialDistance = moonInfo.distance;
            const inclination = moonInfo.inclination * Math.PI / 180;
            moon.position.set(
                Math.cos(initialAngle) * initialDistance,
                Math.sin(initialAngle) * initialDistance * Math.sin(inclination),
                Math.sin(initialAngle) * initialDistance * Math.cos(inclination)
            );
            applyMoonOrbitalMechanics(moon, moonInfo);
            moon.angle = initialAngle;
            moon.distance = moonInfo.distance;
            moon.name = moonInfo.name;
            moon.planetIndex = planetIndex;
            moon.moonIndex = moonIndex;
            moon.castShadow = true;
            moon.receiveShadow = true;
            if (moonInfo.hasAtmosphere) {
                createPlanetaryGlow(moon, planetIndex, camera);
            }
            orb.add(moon);
            orb.moons.push(moon);
        });
    }
    // Adding generic moons if planet has more moons than named ones in the moonData cuz i am NOT adding all the moons lol.
    const planetMoons = orb.userData && orb.userData.moons ? orb.userData.moons : (typeof planetData !== 'undefined' && planetData[planetIndex] ? planetData[planetIndex].moons : 0);
    const namedCount = realMoonData[planetIndex] ? realMoonData[planetIndex].length : 0;
    const genericCount = Math.max(0, planetMoons - namedCount);
    for (let i = 0; i < genericCount; i++) {
        const size = 0.01 + Math.random() * 0.03; // Small generic moon
        const distance = 30 + namedCount * 10 + i * 5 + Math.random() * 10;
        const color = 0x888888;
        const initialAngle = (i / genericCount) * Math.PI * 2 + Math.random() * 0.2;
        const inclination = Math.random() * 0.2;
        const moonGeometry = new THREE.SphereGeometry(size, 24, 24);
        const moonMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(
            Math.cos(initialAngle) * distance,
            Math.sin(initialAngle) * distance * Math.sin(inclination),
            Math.sin(initialAngle) * distance * Math.cos(inclination)
        );
        moon.angle = initialAngle;
        moon.distance = distance;
        moon.name = `Moon ${namedCount + i + 1}`;
        moon.planetIndex = planetIndex;
        moon.moonIndex = namedCount + i;
        moon.castShadow = false;
        moon.receiveShadow = false;
        moon.userData = { orbitalInclination: inclination, orbitalPeriod: 1 + Math.random() * 10, rotationPeriod: 1 + Math.random() * 10, tidallyLocked: true };
        orb.add(moon);
        orb.moons.push(moon);
    }
}