export const sceneConfig = {
    backgroundColor: 0x000000
};

export const cameraConfig = {
    fov: 75,
    near: 0.1,
    far: 1000000
};

export const rendererConfig = {
    alpha: true,
    antialias: true,
    shadowMap: {
        enabled: true,
        type: THREE.PCFSoftShadowMap
    },
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.0
};

export const orbitControlsConfig = {
    rotateSpeed: 0.5,
    zoomSpeed: 1.0,
    panSpeed: 0.8,
    minDistance: 1,
    maxDistance: 80000
};

export const lightingConfig = {
    sunLight: {
        color: 0xffffff,
        intensity: 3.0,
        distance: 3000,
        decay: 0.5,
        shadow: {
            mapSize: { width: 4096, height: 4096 },
            camera: { near: 10, far: 3000 }
        }
    },
    directionalLight: {
        color: 0xffffff,
        intensity: 1.5,
        shadow: {
            mapSize: { width: 2048, height: 2048 }
        }
    },
    ambientLight: {
        color: 0x101010,
        intensity: 2.4
    }
};