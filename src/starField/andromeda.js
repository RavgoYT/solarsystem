export function createAndromedaGalaxy(scene) {
    const andromedaGeometry = new THREE.BufferGeometry();
    const andromedaVertices = [];
    const andromedaColors = [];
    const andromedaCenter = { x: 80000, y: 300000, z: -450000 };
    const andromedaSize = 30000;
    const andromedaStars = 6000;


    // the shape of andromeda isnt that accurate here. def not as accurate as the milky way that I made (bcuz I made that one after), but this isnt really something to "visit", so it's fine for now. 
    // If I add galaxy cams in the future, this will need to be redone.
    for (let i = 0; i < andromedaStars; i++) {
        const arm = Math.floor(Math.random() * 2);
        const armOffset = arm * Math.PI;
        const angle = Math.random() * 3 * Math.PI + armOffset;
        let radius = Math.random() < 0.3 ? Math.random() * (andromedaSize * 0.2) :
            (andromedaSize * 0.2) + Math.random() * (andromedaSize * 0.8);
        const spiralTightness = 0.3;
        const spiralRadius = radius + Math.sin(angle * spiralTightness) * (andromedaSize * 0.2);
        const localX = spiralRadius * Math.cos(angle);
        const localY = spiralRadius * Math.sin(angle);
        const localZ = (Math.random() - 0.5) * (andromedaSize * 0.05);
        const x = andromedaCenter.x + localX;
        const y = andromedaCenter.y + localY;
        const z = andromedaCenter.z + localZ;
        andromedaVertices.push(x, y, z);
        let color = radius < andromedaSize * 0.2 ? new THREE.Color(0xffddaa) : new THREE.Color(0xaabbff);
        andromedaColors.push(color.r, color.g, color.b);
    }

    andromedaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(andromedaVertices, 3));
    andromedaGeometry.setAttribute('color', new THREE.Float32BufferAttribute(andromedaColors, 3));
    const andromedaMaterial = new THREE.PointsMaterial({
        size: 1.2,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        sizeAttenuation: true
    });
    const andromeda = new THREE.Points(andromedaGeometry, andromedaMaterial);
    andromeda.name = 'andromeda_galaxy';
    scene.add(andromeda);
}