import { planetColors, planetSizes } from './planetData.js';

export function createPlanetaryGlow(planet, planetIndex, camera) {
    const planetRadius = planet.geometry.parameters.radius;
    const glowGeometry = new THREE.SphereGeometry(planetRadius * 1.2, 32, 32); // This adds a bit of realism, may not be allat accurate, but it looks cool to me.
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            viewVector: { value: camera.position },
            glowColor: { value: new THREE.Color(planetColors[planetIndex]) },
            intensity: { value: 0.5 },
            falloff: { value: 2.5 }
        },
        // again, copy pasted from some forum.
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            uniform vec3 viewVector;
            uniform float intensity;
            uniform float falloff;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vec3 viewDir = normalize(viewVector - vPosition);
                float fresnel = pow(1.0 - dot(vNormal, viewDir), falloff);
                gl_FragColor = vec4(glowColor * fresnel * intensity, fresnel * 0.2);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    planet.add(glow);
}

export function addPlanetLight(planet, planetIndex) { // Planets bounce the sun's light onto their moons. It makes some really cool displays.
    const planetLight = new THREE.PointLight(planetColors[planetIndex], 0.3, planetSizes[planetIndex] * 20);
    planetLight.position.set(0, 0, 0);
    planet.add(planetLight);
    planet.userData.planetLight = planetLight;
}


// I really need to rework this. Belt data is "real"ish, but the way it generates is not. It should be more random, but also more realistic. I just don't know how to do that yet.
export function createJupiterBelts(planet) {
    const planetRadius = planet.geometry.parameters.radius;
    const beltData = [
        { latitude: 0.7, width: 0.15, color: 0xD2691E, intensity: 0.8 },
        { latitude: 0.5, width: 0.12, color: 0xF4A460, intensity: 0.9 },
        { latitude: 0.3, width: 0.18, color: 0xDEB887, intensity: 0.7 },
        { latitude: 0.1, width: 0.14, color: 0xCD853F, intensity: 0.85 },
        { latitude: -0.1, width: 0.16, color: 0xA0522D, intensity: 0.75 },
        { latitude: -0.3, width: 0.13, color: 0x8B4513, intensity: 0.8 },
        { latitude: -0.5, width: 0.17, color: 0xD2691E, intensity: 0.6 },
        { latitude: -0.7, width: 0.12, color: 0xF4A460, intensity: 0.9 }
    ];

    // Store belt meshes for later rotation
    planet.userData.belts = [];
    beltData.forEach((belt) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 64);
        const color = new THREE.Color(belt.color);
        gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0)`);
        gradient.addColorStop(0.5, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${belt.intensity})`);
        gradient.addColorStop(1, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 64);

        for (let i = 0; i < 150; i++) {
            const x = Math.random() * 512;
            const y = 32 + (Math.random() - 0.5) * 20;
            const size = Math.random() * 15 + 5;
            context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
            context.beginPath();
            context.ellipse(x, y, size, size * 0.3, Math.random() * Math.PI, 0, Math.PI * 2);
            context.fill();
        }

        if (Math.random() > 0.7) {
            const stormX = Math.random() * 512;
            const stormY = 32;
            context.fillStyle = `rgba(255, 100, 100, 0.4)`;
            context.beginPath();
            context.ellipse(stormX, stormY, 25, 15, 0, 0, Math.PI * 2);
            context.fill();
        }

        const beltTexture = new THREE.CanvasTexture(canvas);
        beltTexture.wrapS = THREE.RepeatWrapping;
        beltTexture.wrapT = THREE.ClampToEdgeWrapping;
        beltTexture.repeat.set(8, 1);

        const startPhi = Math.PI / 2 + belt.latitude - belt.width / 2;
        const endPhi = Math.PI / 2 + belt.latitude + belt.width / 2;
        // wtf do I use that for ^ I forgot.
        const beltGeometry = new THREE.SphereGeometry(
            planetRadius * 1.002,
            128,
            64,
            0,
            Math.PI * 2,
            startPhi,
            belt.width
        );
        const beltMaterial = new THREE.MeshStandardMaterial({
            map: beltTexture,
            transparent: true,
            opacity: belt.intensity,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.1,
            emissive: new THREE.Color(belt.color),
            emissiveIntensity: 0.1
        });
        const beltMesh = new THREE.Mesh(beltGeometry, beltMaterial);
        beltMesh.rotation.y = Math.random() * Math.PI * 2;
        planet.add(beltMesh);
        planet.userData.belts.push(beltMesh);
    });

    const spotCanvas = document.createElement('canvas');
    spotCanvas.width = 128;
    spotCanvas.height = 128;
    const spotContext = spotCanvas.getContext('2d');
    const spotGradient = spotContext.createRadialGradient(64, 64, 10, 64, 64, 60);
    spotGradient.addColorStop(0, 'rgba(200, 50, 50, 0.9)');
    spotGradient.addColorStop(0.7, 'rgba(150, 30, 30, 0.7)');
    spotGradient.addColorStop(1, 'rgba(100, 20, 20, 0.1)');
    spotContext.fillStyle = spotGradient;
    spotContext.fillRect(0, 0, 128, 128);

    const spotTexture = new THREE.CanvasTexture(spotCanvas);
    const spotGeometry = new THREE.SphereGeometry(planetRadius * 1.003, 32, 32, 0, Math.PI / 3, Math.PI / 2 - 0.1, 0.2);
    const spotMaterial = new THREE.MeshStandardMaterial({
        map: spotTexture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const greatRedSpot = new THREE.Mesh(spotGeometry, spotMaterial); // It wouldn't be Jupiter without this, even tho its stretched and low res. Might just want to add community made textures onto these or sumn.
    planet.add(greatRedSpot);
    planet.userData.greatRedSpot = greatRedSpot;
}

export function createSaturnRings(planet) {
    const planetRadius = planet.geometry.parameters.radius;

    // Lowk proud of this, theyre accurate and also look pretty good! I think I'm missing E ring.
    const ringData = [
        { inner: planetRadius * 1.2, outer: planetRadius * 1.5, color: 0xF5DEB3, opacity: 0.9, name: 'D Ring' },
        { inner: planetRadius * 1.5, outer: planetRadius * 1.8, color: 0xDDD8C0, opacity: 1.0, name: 'C Ring' },
        { inner: planetRadius * 1.8, outer: planetRadius * 2.3, color: 0xE6E0D4, opacity: 1.0, name: 'B Ring' },
        { inner: planetRadius * 2.4, outer: planetRadius * 2.8, color: 0xDDD8C0, opacity: 0.8, name: 'A Ring' },
        { inner: planetRadius * 3.2, outer: planetRadius * 3.4, color: 0xCCC7BB, opacity: 0.6, name: 'F Ring' }

    ];
    ringData.forEach((ring) => {
        const ringGeometry = new THREE.RingGeometry(ring.inner, ring.outer, 128);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const baseColor = new THREE.Color(ring.color);
        const r = baseColor.r * 255;
        const g = baseColor.g * 255;
        const b = baseColor.b * 255;
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${ring.opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${ring.opacity * 0.7})`);
        gradient.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, ${ring.opacity * 0.4})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 128;
            const x = 128 + Math.cos(angle) * radius;
            const y = 128 + Math.sin(angle) * radius;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.04 + Math.random() * 0.06})`;
            ctx.fillRect(x, y, 1, 1);
        }
        const ringTexture = new THREE.CanvasTexture(canvas);
        ringTexture.encoding = THREE.sRGBEncoding;
        const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            transparent: true,
            opacity: ring.opacity,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.1,
            emissive: new THREE.Color(ring.color),
            emissiveIntensity: 0.4,
            depthWrite: false
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        planet.add(ringMesh);
    });
}

// This is js beautiful lowk. Yes ringdata is ai generated using proper NASA data. 
export function createUranusRings(planet) {
    const planetRadius = planet.geometry.parameters.radius;
    const ringData = [
        { name: "Zeta", radius: planetRadius * 1.95, width: planetRadius * 0.02, color: 0xb8c5d1, opacity: 0.6 },
        { name: "4", radius: planetRadius * 2.07, width: planetRadius * 0.015, color: 0xc2cdd6, opacity: 0.55 },
        { name: "5", radius: planetRadius * 2.09, width: planetRadius * 0.018, color: 0xb8c5d1, opacity: 0.6 },
        { name: "6", radius: planetRadius * 2.11, width: planetRadius * 0.012, color: 0xccd5db, opacity: 0.5 },
        { name: "Alpha", radius: planetRadius * 2.23, width: planetRadius * 0.05, color: 0xd6dde3, opacity: 0.55 },
        { name: "Beta", radius: planetRadius * 2.29, width: planetRadius * 0.04, color: 0xccd5db, opacity: 0.45 },
        { name: "Eta", radius: planetRadius * 2.31, width: planetRadius * 0.015, color: 0xc2cdd6, opacity: 0.25 },
        { name: "Gamma", radius: planetRadius * 2.33, width: planetRadius * 0.025, color: 0xccd5db, opacity: 0.35 },
        { name: "Delta", radius: planetRadius * 2.35, width: planetRadius * 0.03, color: 0xccd5db, opacity: 0.4 },
        { name: "Lambda", radius: planetRadius * 2.37, width: planetRadius * 0.018, color: 0xc2cdd6, opacity: 0.2 },
        { name: "Epsilon", radius: planetRadius * 2.55, width: planetRadius * 0.08, color: 0xe0e5e8, opacity: 0.6 },
        { name: "Nu", radius: planetRadius * 3.4, width: planetRadius * 0.15, color: 0xa8b8c4, opacity: 0.2 },
        { name: "Mu", radius: planetRadius * 4.2, width: planetRadius * 0.6, color: 0x9eafc0, opacity: 0.05 }
    ];

    const rings = [];
    ringData.forEach((ring) => {
        const ringGeometry = new THREE.RingGeometry(
            ring.radius - ring.width / 2,
            ring.radius + ring.width / 2,
            128,
            8
        );
        const ringMaterial = new THREE.MeshLambertMaterial({
            color: ring.color,
            transparent: true,
            opacity: ring.opacity,
            side: THREE.DoubleSide,
            emissive: new THREE.Color(ring.color).multiplyScalar(0.2)
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        if (ring.name !== "Alpha" && ring.name !== "Beta" && ring.name !== "Epsilon") {
            ringMesh.rotation.z = (Math.random() - 0.5) * 0.002;
        }
        ringMesh.userData = { name: ring.name, originalOpacity: ring.opacity };
        rings.push(ringMesh);
        planet.add(ringMesh);
    });
    return rings;
}

export function createJupiterRings(planet) {
    const planetRadius = planet.geometry.parameters.radius;
    const ringData = [
        { name: "Halo", inner: planetRadius * 1.4, outer: planetRadius * 1.71, color: 0x8B7355, opacity: 0.15 },
        { name: "Main", inner: planetRadius * 1.71, outer: planetRadius * 1.806, color: 0xA0895C, opacity: 0.25 },
        { name: "Amalthea", inner: planetRadius * 1.806, outer: planetRadius * 2.54, color: 0x7A6B47, opacity: 0.08 },
        { name: "Thebe", inner: planetRadius * 2.54, outer: planetRadius * 3.11, color: 0x6B5D3F, opacity: 0.05 }
    ];

    ringData.forEach((ring) => {
        const ringGeometry = new THREE.RingGeometry(ring.inner, ring.outer, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: ring.color,
            transparent: true,
            opacity: ring.opacity,
            side: THREE.DoubleSide,
            roughness: 1.0
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        planet.add(ringMesh);
    });
}