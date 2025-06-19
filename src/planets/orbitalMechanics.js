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

export function updatePhysics(orbs, scene, timeScale = 0.1, tooltipsEnabled = true, inMoonView = false, currentTargetIndex = -1) {
    // Use the passed-in timeScale, not the slider value directly
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

        // Update orbit path (trailing line that follows the planet, not a full history)
        // Calculate max trail length based on distance
        const maxTrailLength = (orb.distance * 6.75);
        // Use a capped minimum step for smoothness at high speed
        const minTrailStep = Math.min(orb.distance * 0.01, 1); // Never more than 1 unit
        const newPosition = orb.position.clone();
        let lastTrailPos = orb.orbitPath.length > 0 ? orb.orbitPath[orb.orbitPath.length - 1] : null;
        if (!lastTrailPos || newPosition.distanceTo(lastTrailPos) > minTrailStep) {
            // If moving a large distance, interpolate points
            if (lastTrailPos && newPosition.distanceTo(lastTrailPos) > minTrailStep * 1.5) {
                const steps = Math.ceil(newPosition.distanceTo(lastTrailPos) / minTrailStep);
                for (let s = 1; s < steps; s++) {
                    const interp = lastTrailPos.clone().lerp(newPosition, s / steps);
                    orb.orbitPath.push(interp);
                }
            }
            orb.orbitPath.push(newPosition);
            if (orb.orbitPath.length > maxTrailLength) orb.orbitPath.splice(0, orb.orbitPath.length - maxTrailLength);
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
                orbitLines[index].position.set(0, 0, 0);
                orbitLines[index].frustumCulled = false;
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

            // --- Moon orbit path (trailing line) update ---
            const maxTrailLength = (moon.distance * 6.75);
            const minTrailStep = Math.min(moon.distance * 0.01, 1);
            // Get moon's world position for the orbit path
            const newWorldPosition = moon.getWorldPosition(new THREE.Vector3());
            let lastTrailPos = moon.orbitPath.length > 0 ? moon.orbitPath[moon.orbitPath.length - 1] : null;
            if (!lastTrailPos || newWorldPosition.distanceTo(lastTrailPos) > minTrailStep) {
                if (lastTrailPos && newWorldPosition.distanceTo(lastTrailPos) > minTrailStep * 1.5) {
                    const steps = Math.ceil(newWorldPosition.distanceTo(lastTrailPos) / minTrailStep);
                    for (let s = 1; s < steps; s++) {
                        const interp = lastTrailPos.clone().lerp(newWorldPosition, s / steps);
                        moon.orbitPath.push(interp);
                    }
                }
                moon.orbitPath.push(newWorldPosition.clone());
                if (moon.orbitPath.length > maxTrailLength) moon.orbitPath.splice(0, moon.orbitPath.length - maxTrailLength);
            }
            // --- Moon orbit line visibility logic ---
            if (moon.orbitPath.length > 1 && moon.orbitLine) {
                // Show if currentTargetIndex matches this planet, and we're in planet or moon view
                const shouldShow = tooltipsEnabled && (currentTargetIndex === index);
                if (moon.orbitLine.visible !== shouldShow) {
                    //console.log(`Moon orbit line for ${moon.name} (planet ${index}) visible:`, shouldShow, 'inMoonView:', inMoonView, 'currentTargetIndex:', currentTargetIndex);
                }
                moon.orbitLine.visible = shouldShow;
                // Debug: log orbitPath length and endpoints if visible
                if (shouldShow) {
                    //console.log(`Moon ${moon.name} orbitPath length:`, moon.orbitPath.length, 'First:', moon.orbitPath[0], 'Last:', moon.orbitPath[moon.orbitPath.length-1]);
                    // Restore moon orbit line to match planet style
                    if (!(moon.orbitLine.material instanceof THREE.LineBasicMaterial)) {
                        moon.orbitLine.material = new THREE.LineBasicMaterial({
                            color: 0xffffff,
                            transparent: true,
                            opacity: 0.7
                        });
                    } else {
                        moon.orbitLine.material.color.set(0xffffff);
                        moon.orbitLine.material.opacity = 0.7;
                    }
                    // Remove debug offset, ensure line is at world origin
                    moon.orbitLine.position.set(0, 0, 0);
                }
                // Always update geometry, even if not visible
                // Ensure all points are in world coordinates
                const positions = new Float32Array(moon.orbitPath.length * 3);
                let validPositions = true;
                moon.orbitPath.forEach((pos, i) => {
                    // If pos is not in world coordinates, convert it here (if needed)
                    positions[i * 3] = pos.x;
                    positions[i * 3 + 1] = pos.y;
                    positions[i * 3 + 2] = pos.z;
                });
                if (validPositions) {
                    moon.orbitLine.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    moon.orbitLine.geometry.attributes.position.needsUpdate = true;
                    moon.orbitLine.geometry.computeBoundingSphere();
                    moon.orbitLine.frustumCulled = false;
                }
            }

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