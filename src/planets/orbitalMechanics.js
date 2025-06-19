export function applyOrbitalMechanics(celestialBody, orbitalData) {
    celestialBody.userData.orbitalInclination = orbitalData.orbitalInclination * Math.PI / 180;
    celestialBody.userData.orbitalPeriod = orbitalData.orbitalPeriod;
    celestialBody.userData.eccentricity = orbitalData.eccentricity || 0;
    const baseSpeed = 0.1;
    celestialBody.userData.orbitalAngularVelocity = baseSpeed / Math.abs(orbitalData.orbitalPeriod);
    celestialBody.userData.axialTilt = orbitalData.axialTilt * Math.PI / 180;
    celestialBody.userData.rotationPeriod = orbitalData.rotationPeriod;
    celestialBody.userData.isRetrograde = orbitalData.retrograde || orbitalData.rotationPeriod < 0;
    const rotationSpeed = (2 * Math.PI) / (Math.abs(orbitalData.rotationPeriod) * 100);
    celestialBody.userData.rotationSpeed = celestialBody.userData.isRetrograde ? -rotationSpeed : rotationSpeed;
}

export function updatePhysics(orbs, scene) {
    let timeScale = parseFloat(document.getElementById('speed').value) || 0.1;
    const orbitLines = orbs.map((_, i) => scene.getObjectByName(`orbit_line_${i}`) || orbs[i].orbitLine);

    orbs.forEach((orb, index) => {
        // Orbital motion
        orb.angle += orb.userData.orbitalAngularVelocity * timeScale;
        orb.angle = orb.angle % (2 * Math.PI);
        const eccentricity = orb.userData.eccentricity || 0;
        const semiMajorAxis = orb.distance;
        const cosAngle = Math.cos(orb.angle);
        const denominator = 1 + eccentricity * cosAngle;
        if (Math.abs(denominator) < 1e-10) {
            console.warn(`Invalid orbital calculation for ${orb.name}: denominator=${denominator}`);
            return;
        }
        const distance = semiMajorAxis * (1 - eccentricity * eccentricity) / denominator;
        const orbitalInclination = orb.userData.orbitalInclination;
        const sinAngle = Math.sin(orb.angle);
        const x = cosAngle * distance;
        const y = Math.sin(orbitalInclination) * distance * sinAngle * 0.2;
        const z = sinAngle * distance * Math.cos(orbitalInclination);
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            console.warn(`NaN position for ${orb.name}`);
            return;
        }
        orb.position.set(x, y, z);

        // Update orbit path
        const newPosition = orb.position.clone();
        if (isFinite(newPosition.x) && isFinite(newPosition.y) && isFinite(newPosition.z)) {
            orb.orbitPath.push(newPosition);
            if (orb.orbitPath.length > 30000) orb.orbitPath.shift();
        }

        if (orb.orbitPath.length > 1) {
            const positions = new Float32Array(orb.orbitPath.length * 3);
            let validPositions = true;
            orb.orbitPath.forEach((pos, i) => {
                if (isFinite(pos.x) && isFinite(pos.y) && isFinite(pos.z)) {
                    positions[i * 3] = pos.x;
                    positions[i * 3 + 1] = pos.y;
                    positions[i * 3 + 2] = pos.z;
                } else {
                    validPositions = false;
                }
            });
            if (validPositions && orbitLines[index]) {
                orbitLines[index].geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                orbitLines[index].geometry.attributes.position.needsUpdate = true;
                orbitLines[index].geometry.computeBoundingSphere();
            }
        }

        // Planetary rotation
        if (orb.userData.rotationSpeed) {
            orb.rotation.set(0, 0, 0);
            const rotationDirection = orb.userData.isRetrograde ? -1 : 1;
            orb.rotation.y += orb.userData.rotationSpeed * rotationDirection * timeScale;
            orb.rotation.z = orb.userData.axialTilt;
            // --- Jupiter belts and spot spin with planet ---
            if (index === 4 && orb.userData.belts) {
                orb.userData.belts.forEach(beltMesh => {
                    beltMesh.rotation.y += orb.userData.rotationSpeed * rotationDirection * timeScale;
                });
            }
            if (index === 4 && orb.userData.greatRedSpot) {
                orb.userData.greatRedSpot.rotation.y += orb.userData.rotationSpeed * rotationDirection * timeScale;
            }
        }

        // Moon updates
        orb.moons.forEach(moon => {
            moon.angle += moon.userData.orbitalAngularVelocity * timeScale;
            moon.angle = moon.angle % (2 * Math.PI);
            const eccentricity = moon.userData.eccentricity || 0;
            const semiMajorAxis = moon.distance;
            const cosAngle = Math.cos(moon.angle);
            const distance = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * cosAngle);
            const inclination = moon.userData.orbitalInclination || 0;
            const x = Math.cos(moon.angle) * distance;
            const y = Math.sin(moon.angle) * distance * Math.sin(inclination);
            const z = Math.sin(moon.angle) * distance * Math.cos(inclination);
            moon.position.set(x, y, z);

            if (moon.userData.tidallyLocked) {
                // If camera is tidal-locked to this moon, always face the planet
                if (moon.userData.tidalLockCamera) {
                    // This will be handled in camera logic, not here
                }
                moon.rotation.y = moon.angle + Math.PI;
            } else {
                moon.rotation.y += moon.userData.rotationSpeed * timeScale;
            }
            if (moon.userData.axialTilt) {
                moon.rotation.z = moon.userData.axialTilt;
            }
        });

        // Animate Jupiter surface
        if (orb.userData.animateJupiter) {
            orb.material.uniforms.time.value = performance.now() * 0.001;
        }
    });
}