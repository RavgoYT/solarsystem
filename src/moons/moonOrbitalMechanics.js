export function applyMoonOrbitalMechanics(moon, moonData) {
    moon.userData.orbitalInclination = moonData.inclination * Math.PI / 180;
    moon.userData.orbitalPeriod = Math.abs(moonData.period);
    moon.userData.eccentricity = moonData.eccentricity;
    const baseMoonSpeed = 0.1;
    let orbitalSpeed = baseMoonSpeed / moon.userData.orbitalPeriod;
    if (moonData.period < 0) {
        orbitalSpeed *= -1;
    }
    moon.userData.orbitalAngularVelocity = orbitalSpeed;
    moon.userData.rotationPeriod = Math.abs(moonData.rotationPeriod);
    moon.userData.tidallyLocked = moonData.tidallyLocked;
    moon.userData.axialTilt = moonData.axialTilt * Math.PI / 180;
    if (!moonData.tidallyLocked) {
        const rotationSpeed = (2 * Math.PI) / (moon.userData.rotationPeriod * 100);
        moon.userData.rotationSpeed = moonData.rotationPeriod < 0 ? -rotationSpeed : rotationSpeed;
    }
    // For tidally locked moons, rotation is handled in the update loop (see monolithic script)
}