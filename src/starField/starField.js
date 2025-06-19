import { createMilkyWayGalaxy } from './milkyway.js';
import { createDistantGalaxies } from './distantGalaxies.js';
import { createAndromedaGalaxy } from './andromeda.js';

export function createRealisticStarfield(scene) {
    // Stellar classification data
    const stellarClasses = [
        { class: 'O', color: 0x9bb0ff, temp: 30000, size: 15, brightness: 30000, percent: 0.00003 },
        { class: 'B', color: 0xaabfff, temp: 20000, size: 7, brightness: 10000, percent: 0.13 },
        { class: 'A', color: 0xcad7ff, temp: 8500, size: 2.1, brightness: 40, percent: 0.6 },
        { class: 'F', color: 0xf8f7ff, temp: 6500, size: 1.4, brightness: 6, percent: 3.0 },
        { class: 'G', color: 0xfff4ea, temp: 5500, size: 1.0, brightness: 1, percent: 7.6 },
        { class: 'K', color: 0xffeaa7, temp: 4000, size: 0.8, brightness: 0.4, percent: 12.1 },
        { class: 'M', color: 0xffcc6f, temp: 3000, size: 0.4, brightness: 0.04, percent: 76.45 }
    ];

    let cumulative = 0;
    const distribution = stellarClasses.map(cls => ({ ...cls, cumulative: cumulative += cls.percent }));

    function selectStellarClass() {
        const rand = Math.random() * 100;
        return distribution.find(cls => rand <= cls.cumulative) || distribution[distribution.length - 1];
    }

    const starSystems = stellarClasses.map(cls => ({
        geometry: new THREE.BufferGeometry(),
        material: new THREE.PointsMaterial({
            color: cls.color,
            size: Math.max(0.05, cls.size * 0.05),
            transparent: true,
            opacity: Math.min(1.0, Math.sqrt(cls.brightness) * 0.1)
        }),
        vertices: []
    }));

    // Background stars
    const backgroundStars = 6000;
    for (let i = 0; i < backgroundStars; i++) {
        const stellarClass = selectStellarClass();
        const classIndex = stellarClasses.findIndex(c => c.class === stellarClass.class);
        const radius = 4000 + Math.random() * 8000;
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        starSystems[classIndex].vertices.push(x, y, z);
    }

    // Local stars
    const localStars = 5000; // "You can see 9000 stars in the sky" according to NASA, if you look in every direction. A good like 40% of these in my scene are from the milky way, though, so I'm gonna make this less.
    // If there's too many of these, it looks like a bulge in the galaxy view, which is weird and inaccurate.
    for (let i = 0; i < localStars; i++) {
        const stellarClass = selectStellarClass();
        const classIndex = stellarClasses.findIndex(c => c.class === stellarClass.class);
        const radius = 1000 + Math.random() * 2000;
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        starSystems[classIndex].vertices.push(x, y, z);
    }

    // Star clusters
    const clusters = 9;
    for (let cluster = 0; cluster < clusters; cluster++) {
        const clusterCenter = {
            x: -60000 + (Math.random() - 0.5) * 70000,
            y: (Math.random() - 0.5) * 32000,
            z: (Math.random() - 0.5) * 90000
        };
        const clusterSize = 2000 + Math.random() * 3000;
        const clusterStars = 200 + Math.random() * 400;
        for (let i = 0; i < clusterStars; i++) {
            let stellarClass = Math.random() < 0.4 ?
                distribution.find(cls => ['O', 'B', 'A'].includes(cls.class)) || selectStellarClass() :
                selectStellarClass();
            const classIndex = stellarClasses.findIndex(c => c.class === stellarClass.class);
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.abs(THREE.MathUtils.randFloatSpread(clusterSize * 0.5));
            const x = clusterCenter.x + distance * Math.cos(angle);
            const y = clusterCenter.y + THREE.MathUtils.randFloatSpread(clusterSize * 0.3);
            const z = clusterCenter.z + distance * Math.sin(angle);
            starSystems[classIndex].vertices.push(x, y, z);
        }
    }

    // I like how these look so I keep them in there with the others
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    const starVertices = [];
    for (let i = 0; i < 600; i++) {
        const radius = 4000 + Math.random() * 12000;
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        starVertices.push(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(theta)
        );
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create star points
    starSystems.forEach((system, index) => {
        if (system.vertices.length > 0) {
            system.geometry.setAttribute('position', new THREE.Float32BufferAttribute(system.vertices, 3));
            const brightnesses = new Array(system.vertices.length / 3).fill(0).map(() => 0.5 + Math.random() * 0.5);
            system.geometry.setAttribute('brightness', new THREE.Float32BufferAttribute(brightnesses, 1));
            const material = new THREE.PointsMaterial({
                color: stellarClasses[index].color,
                size: Math.max(0.08, stellarClasses[index].size * 0.08),
                transparent: true,
                opacity: Math.min(1.0, Math.sqrt(stellarClasses[index].brightness) * 0.15),
                vertexColors: false,
                sizeAttenuation: true
            });
            const points = new THREE.Points(system.geometry, material);
            points.name = `stars_${stellarClasses[index].class}`;
            scene.add(points);
        }
    });

    createMilkyWayGalaxy(scene);
    createDistantGalaxies(scene);
    createAndromedaGalaxy(scene);

    console.log(`Generated realistic starfield with ${localStars + 25000 + (clusters * 300)} stars plus distant galaxies`);
    // it's random, so^
}