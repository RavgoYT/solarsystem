//yes I used ai for this. im not crazy

export const realMoonData = {
    2: [{
        name: "Moon",
        size: 0.273,
        distance: 30,
        color: 0xC0C0C0,
        period: 27.3,
        inclination: 5.14,
        eccentricity: 0.055,
        hasAtmosphere: false,
        axialTilt: 6.7,
        rotationPeriod: 27.3,
        tidallyLocked: true
    }],
    3: [{
        name: "Phobos",
        size: 0.028,
        distance: 6,
        color: 0x8B7355,
        period: 0.32,
        inclination: 0.02,
        eccentricity: 0.015,
        hasAtmosphere: false,
        axialTilt: 0,
        rotationPeriod: 0.32,
        tidallyLocked: true
    }, {
        name: "Deimos",
        size: 0.019,
        distance: 15,
        color: 0x8B7355,
        period: 1.26,
        inclination: 0.03,
        eccentricity: 0.0002,
        hasAtmosphere: false,
        axialTilt: 0,
        rotationPeriod: 1.26,
        tidallyLocked: true
    }],
    4: [
        // Inner regular moons (scaled up for visibility)
        {
            name: "Metis",
            size: 0.03, // was 0.0075
            distance: 20, // was 12.81
            color: 0x8888BB,
            period: 0.295,
            inclination: 0.06,
            eccentricity: 0.0002,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.295,
            tidallyLocked: true
        },
        {
            name: "Adrastea",
            size: 0.025, // was 0.0058
            distance: 22, // was 12.89
            color: 0x8888BB,
            period: 0.298,
            inclination: 0.06,
            eccentricity: 0.0013,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.298,
            tidallyLocked: true
        },
        {
            name: "Amalthea",
            size: 0.06, // was 0.048
            distance: 30, // was 18.14
            color: 0xCC7700,
            period: 0.498,
            inclination: 0.39,
            eccentricity: 0.0032,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.498,
            tidallyLocked: true
        },
        {
            name: "Thebe",
            size: 0.04, // was 0.028
            distance: 35, // was 22.19
            color: 0xCC6600,
            period: 0.675,
            inclination: 1.08,
            eccentricity: 0.018,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.675,
            tidallyLocked: true
        },

        // Galilean moons (slightly increased size and distance for visibility)
        {
            name: "Io",
            size: 1.1, // was 1.05
            distance: 50, // was 42.18
            color: 0xFFFF99,
            period: 1.769,
            inclination: 0.04,
            eccentricity: 0.0041,
            hasAtmosphere: true,
            axialTilt: 0,
            rotationPeriod: 1.769,
            tidallyLocked: true
        },
        {
            name: "Europa",
            size: 1.0, // was 0.90
            distance: 70, // was 67.11
            color: 0xADD8E6,
            period: 3.551,
            inclination: 0.47,
            eccentricity: 0.009,
            hasAtmosphere: true,
            axialTilt: 0.1,
            rotationPeriod: 3.551,
            tidallyLocked: true
        },
        {
            name: "Ganymede",
            size: 1.6, // was 1.52
            distance: 110, // was 107.04
            color: 0x8B8682,
            period: 7.155,
            inclination: 0.20,
            eccentricity: 0.0013,
            hasAtmosphere: false,
            axialTilt: 0.33,
            rotationPeriod: 7.155,
            tidallyLocked: true
        },
        {
            name: "Callisto",
            size: 1.5, // was 1.39
            distance: 200, // was 188.27
            color: 0x404040,
            period: 16.689,
            inclination: 0.19,
            eccentricity: 0.0074,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 16.689,
            tidallyLocked: true
        },

        // More moons as particles...
    ],
    5: [
        // Ring shepherds and inner moons (scaled up for visibility)
        {
            name: "Pan",
            size: 0.03, // was 0.0058
            distance: 25, // was 13.36
            color: 0xAAAAAA,
            period: 0.575,
            inclination: 0.0,
            eccentricity: 0.0001,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.575,
            tidallyLocked: true
        },
        {
            name: "Daphnis",
            size: 0.02, // was 0.002
            distance: 27, // was 13.65
            color: 0xCCDDFF,
            period: 0.594,
            inclination: 0.0,
            eccentricity: 0.0,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.594,
            tidallyLocked: true
        },
        {
            name: "Atlas",
            size: 0.04, // was 0.0092
            distance: 28, // was 13.77
            color: 0xDDCC99,
            period: 0.601,
            inclination: 0.0,
            eccentricity: 0.001,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.601,
            tidallyLocked: true
        },

        // Co-orbitals of Prometheus/Pandora-Janus-Epimetheus group
        {
            name: "Prometheus",
            size: 0.06, // was 0.029
            distance: 30, // was 13.94
            color: 0xCC8844,
            period: 0.613,
            inclination: 0.0,
            eccentricity: 0.002,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.613,
            tidallyLocked: true
        },
        {
            name: "Pandora",
            size: 0.05, // was 0.024
            distance: 32, // was 14.17
            color: 0xCC3344,
            period: 0.628,
            inclination: 0.0,
            eccentricity: 0.003,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.628,
            tidallyLocked: true
        },
        {
            name: "Epimetheus",
            size: 0.07, // was 0.034
            distance: 34, // was 15.14
            color: 0xAA8844,
            period: 0.695,
            inclination: 0.0,
            eccentricity: 0.009,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.695,
            tidallyLocked: true
        },
        {
            name: "Janus",
            size: 0.09, // was 0.051
            distance: 36, // was 15.15
            color: 0xAA6633,
            period: 0.695,
            inclination: 0.0,
            eccentricity: 0.0001,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.695,
            tidallyLocked: true
        },

        // Major icy moons (slightly increased size and distance for visibility)
        {
            name: "Mimas",
            size: 0.15, // was 0.114
            distance: 45, // was 18.56
            color: 0xC0C0C0,
            period: 0.942,
            inclination: 1.53,
            eccentricity: 0.0196,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.942,
            tidallyLocked: true
        },
        {
            name: "Methone",
            size: 0.02, // was 0.0009
            distance: 47, // was 19.4
            color: 0xEEEEFF,
            period: 1.038,
            inclination: 0.0,
            eccentricity: 0.006,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 1.038,
            tidallyLocked: true
        },
        {
            name: "Pallene",
            size: 0.02, // was 0.0011
            distance: 50, // was 21.1
            color: 0xDDDDEE,
            period: 1.146,
            inclination: 0.0,
            eccentricity: 0.003,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 1.146,
            tidallyLocked: true
        },
        {
            name: "Enceladus",
            size: 0.18, // was 0.144
            distance: 55, // was 23.81
            color: 0xF0F8FF,
            period: 1.370,
            inclination: 0.009,
            eccentricity: 0.0047,
            hasAtmosphere: true,
            axialTilt: 0,
            rotationPeriod: 1.370,
            tidallyLocked: true
        },
        {
            name: "Telesto",
            size: 0.03, // was 0.0069
            distance: 65, // was 29.47
            color: 0xCCEEBB,
            period: 1.888,
            inclination: 0.0,
            eccentricity: 0.0005,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 1.888,
            tidallyLocked: true
        },
        {
            name: "Calypso",
            size: 0.025, // was 0.0055
            distance: 65, // was 29.47
            color: 0xFFEECC,
            period: 1.888,
            inclination: 1.56,
            eccentricity: 0.0005,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 1.888,
            tidallyLocked: true
        },
        {
            name: "Tethys",
            size: 0.35, // was 0.305
            distance: 65, // was 29.47
            color: 0xC0E0FF,
            period: 1.888,
            inclination: 1.12,
            eccentricity: 0.0,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 1.888,
            tidallyLocked: true
        },
        {
            name: "Dione",
            size: 0.38, // was 0.322
            distance: 80, // was 37.74
            color: 0xE0E0E0,
            period: 2.737,
            inclination: 0.02,
            eccentricity: 0.0022,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 2.737,
            tidallyLocked: true
        },
        {
            name: "Helene",
            size: 0.04, // was 0.0092
            distance: 80, // was 37.74
            color: 0xE0FFAA,
            period: 2.737,
            inclination: 0.213,
            eccentricity: 0.0071,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 2.737,
            tidallyLocked: true
        },
        {
            name: "Rhea",
            size: 0.45, // was 0.44
            distance: 110, // was 52.71
            color: 0xB0B0B0,
            period: 4.518,
            inclination: 0.35,
            eccentricity: 0.001,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 4.518,
            tidallyLocked: true
        },
        {
            name: "Titan",
            size: 0.8, // was 0.74
            distance: 250, // was 122.19
            color: 0xFFA500,
            period: 15.945,
            inclination: 0.33,
            eccentricity: 0.0288,
            hasAtmosphere: true,
            axialTilt: 0,
            rotationPeriod: 15.945,
            tidallyLocked: true
        },
        {
            name: "Hyperion",
            size: 0.09, // was 0.077
            distance: 300, // was 146.41
            color: 0xAAAAAA,
            period: 21.28,
            inclination: 0.43,
            eccentricity: 0.0274,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Iapetus",
            size: 0.25, // was 0.21
            distance: 700, // was 356.08
            color: 0x999966,
            period: 79.33,
            inclination: 15.0,
            eccentricity: 0.0283,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 79.33,
            tidallyLocked: true
        },

        // Small Irregular moons (examples, left unchanged)
        {
            name: "Anthe",
            size: 0.002, // was 0.0005
            distance: 50, // was 19.77
            color: 0xCCEEFF,
            period: 1.0509,
            inclination: 0.1,
            eccentricity: 0.0011,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Suttungr",
            size: 0.02, // was 0.002
            distance: 2000, // was 1966.7
            color: 0x777777,
            period: -1016.7,
            inclination: 175.8,
            eccentricity: 0.114,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Phoebe",
            size: 0.07, // was 0.069
            distance: 1300, // was 1294.43
            color: 0x7777AA,
            period: -550.48,
            inclination: 175.5,
            eccentricity: 0.163,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        }
    ],
    6: [{
        name: "Titania",
        size: 0.199,
        distance: 27,
        color: 0x8FBC8F,
        period: 8.71,
        inclination: 0.34,
        eccentricity: 0.0011,
        hasAtmosphere: false,
        axialTilt: 0,
        rotationPeriod: 8.71,
        tidallyLocked: true
    }, {
        name: "Oberon",
        size: 0.174,
        distance: 36,
        color: 0x696969,
        period: 13.46,
        inclination: 0.058,
        eccentricity: 0.0014,
        hasAtmosphere: false,
        axialTilt: 0,
        rotationPeriod: 13.46,
        tidallyLocked: true
    }],
    7: [
        // Neptune's moons unchanged
        {
            name: "Naiad",
            size: 58 / 3474,
            distance: 48227 / 10000,
            color: 0x8888FF,
            period: 0.294396,
            inclination: 4.74,
            eccentricity: 0.0003,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.294396,
            tidallyLocked: true
        },
        {
            name: "Thalassa",
            size: 80 / 3474,
            distance: 50075 / 10000,
            color: 0x8888FF,
            period: 0.311485,
            inclination: 0.21,
            eccentricity: 0.0002,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.311485,
            tidallyLocked: true
        },
        {
            name: "Despina",
            size: 148 / 3474,
            distance: 52526 / 10000,
            color: 0xAAAAAA,
            period: 0.334655,
            inclination: 0.07,
            eccentricity: 0.00038,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.334655,
            tidallyLocked: true
        },
        {
            name: "Galatea",
            size: 158 / 3474,
            distance: 61953 / 10000,
            color: 0x9999CC,
            period: 0.428745,
            inclination: 0.05,
            eccentricity: 0.00022,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.428745,
            tidallyLocked: true
        },
        {
            name: "Larissa",
            size: 193 / 3474,
            distance: 73548 / 10000,
            color: 0x888888,
            period: 0.554654,
            inclination: 0.20,
            eccentricity: 0.0014,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.554654,
            tidallyLocked: true
        },
        {
            name: "Hippocamp",
            size: 36 / 3474,
            distance: 105300 / 10000,
            color: 0xAAAAFF,
            period: 0.950,
            inclination: 0,
            eccentricity: 0.0000,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 0.950,
            tidallyLocked: true
        },
        {
            name: "Proteus",
            size: 418 / 3474,
            distance: 117647 / 10000,
            color: 0x555555,
            period: 1.122315,
            inclination: 0.04,
            eccentricity: 0.0004,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 1.122315,
            tidallyLocked: true
        },
        {
            name: "Triton",
            size: 2706.8 / 3474,
            distance: 354760 / 10000,
            color: 0x87CEEB,
            period: -5.876854,
            inclination: 157.3,
            eccentricity: 0.000016,
            hasAtmosphere: true,
            axialTilt: 0,
            rotationPeriod: 5.876854,
            tidallyLocked: true
        },
        {
            name: "Nereid",
            size: 340 / 3474,
            distance: 5513400 / 10000,
            color: 0xCCCCCC,
            period: 360.13619,
            inclination: 5.8,
            eccentricity: 0.749,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: 11.594 / 24,
            tidallyLocked: false
        },
        {
            name: "Halimede",
            size: 30 / 3474,
            distance: 15730000 / 10000,
            color: 0xAAAA77,
            period: 1879.7,
            inclination: 134.1,
            eccentricity: 0.571,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Sao",
            size: 20 / 3474,
            distance: 22420000 / 10000,
            color: 0x7777AA,
            period: 2914.1,
            inclination: 48.5,
            eccentricity: 0.293,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Laomedeia",
            size: 20 / 3474,
            distance: 23570000 / 10000,
            color: 0x77AA77,
            period: 3167.9,
            inclination: 34.7,
            eccentricity: 0.424,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Psamathe",
            size: 20 / 3474,
            distance: 46700000 / 10000,
            color: 0xAAAAAA,
            period: 9115.9,
            inclination: 137.4,
            eccentricity: 0.450,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "Neso",
            size: 30 / 3474,
            distance: 48390000 / 10000,
            color: 0x777777,
            period: 9374.0,
            inclination: 132.6,
            eccentricity: 0.495,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        },
        {
            name: "S/2021 N1",
            size: 14 / 3474,
            distance: 50760000 / 10000,
            color: 0x9999FF,
            period: 10018.8,
            inclination: 134.5,
            eccentricity: 0.44,
            hasAtmosphere: false,
            axialTilt: 0,
            rotationPeriod: null,
            tidallyLocked: false
        }
    ]
}


// add a rough number of moonlike objects to each planet based on how many I have currently in the array minus how many theyre supposd to have.
// saturn is supposed to have 146 moons, but I only have 20 in the array, so it will get 126 generic moons.
// Jupiter is supposed to have 95 moons, but I only have 10 in the array, so it will get 85 generic moons.

