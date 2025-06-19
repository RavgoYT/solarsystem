

// THIS TOOK SO LONG.
export function createMilkyWayGalaxy(scene) {
    const milkyWayGeometry = new THREE.BufferGeometry();
    const milkyWayVertices = [];
    const milkyWayColors = [];
    const milkyWayCenter = { x: -60000, y: 0, z: 0 };
    const milkyWaySize = 90000;
    const milkyWayStars = 60000;
    const bulgeA = milkyWaySize * 0.18;
    const bulgeB = milkyWaySize * 0.09;
    const numArms = 4;
    const armScatter = milkyWaySize * 0.09;
    const armThickness = milkyWaySize * 0.08;

    for (let i = 0; i < milkyWayStars; i++) {
        let localX, localY, localZ, radius, angle;
        const r = Math.random();
        if (r < 0.18) {
            const bulgeAngle = Math.random() * 2 * Math.PI;
            const bulgeRadius = Math.sqrt(Math.random());
            localX = Math.cos(bulgeAngle) * bulgeA * bulgeRadius * (0.8 + 0.4 * Math.random());
            localY = Math.sin(bulgeAngle) * bulgeA * bulgeRadius * (0.8 + 0.4 * Math.random());
            localZ = (Math.random() - 0.5) * 2 * bulgeB * Math.sqrt(1 - bulgeRadius * bulgeRadius);
            radius = Math.sqrt(localX * localX + localY * localY);
        } else if (r < 0.75) {
            const arm = Math.floor(Math.random() * numArms);
            const armOffset = (arm / numArms) * 2 * Math.PI;
            const armAngle = Math.random() * 1.8 * Math.PI;
            angle = armAngle + armOffset;
            const baseRadius = bulgeA * 1.1;
            const maxRadius = milkyWaySize * 0.92;
            radius = baseRadius + (armAngle / (1.8 * Math.PI)) * (maxRadius - baseRadius);
            const scatter = (Math.random() - 0.5) * armScatter;
            const thickness = (Math.random() - 0.5) * armThickness;
            angle += (radius / milkyWaySize) * 1.1 + scatter / milkyWaySize;
            localX = (radius + thickness) * Math.cos(angle);
            localY = (radius + thickness) * Math.sin(angle);
            localZ = (Math.random() - 0.5) * (milkyWaySize * 0.08 + Math.abs(thickness) * 0.5);
        } else {
            const diskAngle = Math.random() * 2 * Math.PI;
            const diskRadius = bulgeA * 1.2 + Math.pow(Math.random(), 1.5) * (milkyWaySize * 0.95 - bulgeA * 1.2);
            localX = diskRadius * Math.cos(diskAngle) + (Math.random() - 0.5) * milkyWaySize * 0.08;
            localY = diskRadius * Math.sin(diskAngle) + (Math.random() - 0.5) * milkyWaySize * 0.08;
            localZ = (Math.random() - 0.5) * milkyWaySize * 0.17;
            radius = diskRadius;
        }

        const x = milkyWayCenter.x + localX;
        const y = milkyWayCenter.y + localY;
        const z = milkyWayCenter.z + localZ;
        milkyWayVertices.push(x, y, z);

        let color;
        if (radius < bulgeA * 1.1) {
            const redness = Math.random() * 0.18;
            color = new THREE.Color(1.0, 0.92 - redness * 0.2, 0.7 - redness * 0.7);
        } else if (r < 0.75) {
            const blueType = Math.random();
            if (blueType < 0.60) {
                color = new THREE.Color(0.65 + Math.random() * 0.15, 0.75 + Math.random() * 0.18, 0.95 + Math.random() * 0.05);
            } else if (blueType < 0.85) {
                color = new THREE.Color(0.95 + Math.random() * 0.05, 0.95 + Math.random() * 0.04, 0.8 + Math.random() * 0.1);
            } else {
                color = new THREE.Color(1.0, 0.85 + Math.random() * 0.1, 0.7 + Math.random() * 0.1);
            }
        } else {
            const t = Math.random();
            if (t < 0.7) {
                color = new THREE.Color(0.95 + Math.random() * 0.05, 0.95 + Math.random() * 0.05, 0.95 + Math.random() * 0.05);
            } else if (t < 0.9) {
                color = new THREE.Color(1.0, 0.95 + Math.random() * 0.03, 0.85 + Math.random() * 0.08);
            } else {
                color = new THREE.Color(1.0, 0.8 + Math.random() * 0.1, 0.7 + Math.random() * 0.1);
            }
        }
        milkyWayColors.push(color.r, color.g, color.b);
    }

    const nebulaRegions = 120;
    for (let i = 0; i < nebulaRegions; i++) {
        const arm = Math.floor(Math.random() * numArms);
        const armOffset = (arm / numArms) * 2 * Math.PI;
        const armAngle = Math.random() * 1.5 * Math.PI;
        let angle = armAngle + armOffset;
        const baseRadius = bulgeA * 1.2;
        const maxRadius = milkyWaySize * 0.85;
        let radius = baseRadius + (armAngle / (1.5 * Math.PI)) * (maxRadius - baseRadius);
        angle += (radius / milkyWaySize) * 0.5;
        const localX = radius * Math.cos(angle);
        const localY = radius * Math.sin(angle);
        const localZ = (Math.random() - 0.5) * (milkyWaySize * 0.09);
        const x = milkyWayCenter.x + localX;
        const y = milkyWayCenter.y + localY;
        const z = milkyWayCenter.z + localZ;
        milkyWayVertices.push(x, y, z);

        let color;
        const nebulaType = Math.random();
        if (nebulaType < 0.35) {
            color = new THREE.Color(1.0, 0.3 + Math.random() * 0.2, 0.6 + Math.random() * 0.7);
        } else if (nebulaType < 0.6) {
            color = new THREE.Color(0.4 + Math.random() * 0.2, 0.7 + Math.random() * 0.2, 1.0);
        } else if (nebulaType < 0.8) {
            color = new THREE.Color(0.9 + Math.random() * 0.1, 0.5 + Math.random() * 0.2, 0.3 + Math.random() * 0.1);
        } else {
            color = new THREE.Color(0.6 + Math.random() * 0.2, 1.0, 0.7 + Math.random() * 0.4);
        }
        milkyWayColors.push(color.r, color.g, color.b);
    }

    milkyWayGeometry.setAttribute('position', new THREE.Float32BufferAttribute(milkyWayVertices, 3));
    milkyWayGeometry.setAttribute('color', new THREE.Float32BufferAttribute(milkyWayColors, 3));
    const milkyWayMaterial = new THREE.PointsMaterial({
        size: 0.7,
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
        sizeAttenuation: true
    });
    const milkyWay = new THREE.Points(milkyWayGeometry, milkyWayMaterial);
    milkyWay.name = 'milky_way_galaxy';
    scene.add(milkyWay);
}
