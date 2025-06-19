export function createDistantGalaxies(scene) {
    const galaxies = [
        {
            name: 'Large Magellanic Cloud',
            distance: 65000,
            size: 1500,
            stars: 400,
            color: 0xffeedd,
            x: -60000 + 65000 * Math.cos(Math.PI / 4),
            y: 65000 * Math.sin(Math.PI / 4),
            z: 80000
        },
        {
            name: 'Small Magellanic Cloud',
            distance: 70000,
            size: 900,
            stars: 250,
            color: 0xffddcc,
            x: -60000 + 70000 * Math.cos(Math.PI / 3),
            y: 70000 * Math.sin(Math.PI / 3),
            z: 90000
        },
        {
            name: 'Triangulum Galaxy',
            distance: 85000,
            size: 3000,
            stars: 300,
            color: 0xeeeeff,
            x: -60000 + 85000 * Math.cos(Math.PI / 6),
            y: 0,
            z: -85000 * Math.sin(Math.PI / 6)
        },
        {
            name: 'Distant Galaxy 1',
            distance: 95000,
            size: 2000,
            stars: 150,
            color: 0xffffdd,
            x: -60000 - 95000 * 0.6,
            y: 95000 * 0.3,
            z: 95000 * 0.6
        },
        {
            name: 'Distant Galaxy 2',
            distance: 99000,
            size: 1800,
            stars: 120,
            color: 0xffeeff,
            x: -60000 + 99000 * 0.5,
            y: -99000 * 0.7,
            z: 99000 * 0.5
        }
    ];

    galaxies.forEach(galaxy => {
        const galaxyGeometry = new THREE.BufferGeometry();
        const galaxyVertices = [];
        const galaxyColors = [];
        for (let i = 0; i < galaxy.stars; i++) {
            const angle = Math.random() * 4 * Math.PI;
            const radius = Math.random() * galaxy.size;
            const spiralOffset = Math.sin(angle * 0.5) * (galaxy.size * 0.3);
            const localX = (radius + spiralOffset) * Math.cos(angle);
            const localY = (radius + spiralOffset) * Math.sin(angle);
            const localZ = (Math.random() - 0.5) * (galaxy.size * 0.1);
            const x = galaxy.x + localX;
            const y = galaxy.y + localY;
            const z = galaxy.z + localZ;
            galaxyVertices.push(x, y, z);
            const color = new THREE.Color(galaxy.color);
            galaxyColors.push(color.r, color.g, color.b);
        }
        galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyVertices, 3));
        galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));
        const galaxyMaterial = new THREE.PointsMaterial({
            size: 0.8,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            sizeAttenuation: true
        });
        const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
        galaxyPoints.name = galaxy.name.toLowerCase().replace(/\s+/g, '_');
        scene.add(galaxyPoints);
    });

    // Additional distant galaxies otherwise when you zoom out everything looks empty.
    for (let i = 0; i < 1200; i++) {
        const distance = 950000 + Math.random() * 40000;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * 2 * Math.PI;
        const x = distance * Math.sin(theta) * Math.cos(phi);
        const y = distance * Math.sin(theta) * Math.sin(phi);
        const z = distance * Math.cos(theta);
        const galaxySize = 400 + Math.random() * 800;
        const starCount = 80 + Math.floor(Math.random() * 120);
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const baseColor = new THREE.Color().setHSL(Math.random(), 0.3 + Math.random() * 0.4, 0.7 + Math.random() * 0.2);
        for (let j = 0; j < starCount; j++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.pow(Math.random(), 1.7) * galaxySize;
            const armOffset = Math.sin(angle * (2 + Math.random())) * (galaxySize * 0.2 * Math.random());
            const px = x + (radius + armOffset) * Math.cos(angle);
            const py = y + (radius + armOffset) * Math.sin(angle);
            const pz = z + (Math.random() - 0.5) * galaxySize * 0.2;
            positions.push(px, py, pz);
            const c = baseColor.clone().offsetHSL((Math.random() - 0.5) * 0.05, 0, (Math.random() - 0.5) * 0.1);
            colors.push(c.r, c.g, c.b);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({
            size: 2.5 + Math.random() * 2,
            transparent: true,
            opacity: 0.25 + Math.random() * 0.25,
            vertexColors: true,
            sizeAttenuation: true
        });
        const points = new THREE.Points(geometry, material);
        points.name = `distant_galaxy_${i}`;
        scene.add(points);
    }
}