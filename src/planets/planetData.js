// These values were all ran through scripts to normalize them based on Earth = 1.0. It's accurate enough to pass, I'm not gonna crash ppl's browser by making it genuinely realistic, lol. (I'm surprised the galaxies and stuff dont already crash it)

export const planetData = [
    { name: 'Mercury', color: 0x909090, size: 0.383, distance: 57.9, axialTilt: 0.034, rotationPeriod: 58.646, retrograde: false, orbitalInclination: 7.0, orbitalPeriod: 87.97, eccentricity: 0.2056, moons: 0 },
    { name: 'Venus', color: 0xEED6A3, size: 0.949, distance: 108.2, axialTilt: 177.4, rotationPeriod: -243.025, retrograde: true, orbitalInclination: 3.39, orbitalPeriod: 224.7, eccentricity: 0.0068, moons: 0 },
    { name: 'Earth', color: 0x2C74D6, size: 1.0, distance: 149.6, axialTilt: 23.44, rotationPeriod: 1.0, retrograde: false, orbitalInclination: 0.0, orbitalPeriod: 365.25, eccentricity: 0.0167, moons: 1 },
    { name: 'Mars', color: 0xB22222, size: 0.532, distance: 227.9, axialTilt: 25.19, rotationPeriod: 1.026, retrograde: false, orbitalInclination: 1.85, orbitalPeriod: 686.98, eccentricity: 0.0934, moons: 2 },
    { name: 'Jupiter', color: 0xD2B48C, size: 11.21, distance: 778.6, axialTilt: 3.13, rotationPeriod: 0.4135, retrograde: false, orbitalInclination: 1.31, orbitalPeriod: 4332.59, eccentricity: 0.0489, moons: 95 },
    { name: 'Saturn', color: 0xF5DEB3, size: 9.45, distance: 1433.5, axialTilt: 26.73, rotationPeriod: 0.444, retrograde: false, orbitalInclination: 2.49, orbitalPeriod: 10759, eccentricity: 0.0565, moons: 146 },
    { name: 'Uranus', color: 0xAFEEEE, size: 4.01, distance: 2872.5, axialTilt: 97.77, rotationPeriod: -0.718, retrograde: true, orbitalInclination: 0.77, orbitalPeriod: 30687.15, eccentricity: 0.0464, moons: 27 },
    { name: 'Neptune', color: 0x4169E1, size: 3.88, distance: 4495.1, axialTilt: 28.32, rotationPeriod: 0.671, retrograde: false, orbitalInclination: 1.77, orbitalPeriod: 60190, eccentricity: 0.0095, moons: 14 },
    { name: 'Pluto (Dwarf Planet)', color: 0xA67B5B, size: 0.186, distance: 5906.4, axialTilt: 119.61, rotationPeriod: -6.387, retrograde: true, orbitalInclination: 17.16, orbitalPeriod: 90560, eccentricity: 0.2488, moons: 5 },
    { name: 'Eris (Dwarf Planet)', color: 0xccccff, size: 0.182, distance: 10100, axialTilt: 44, rotationPeriod: 25.9, retrograde: false, orbitalInclination: 44.04, orbitalPeriod: 203830, eccentricity: 0.44177, moons: 1 }
];

export const baseOffset = 100;

export const planetNames = planetData.map(p => p.name);
export const planetColors = planetData.map(p => p.color);
export const planetSizes = planetData.map(p => p.size);
export const baseDistances = planetData.map(p => p.distance);
export const planetDistances = baseDistances.map(d => d + baseOffset);