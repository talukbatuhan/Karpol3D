export const commonLook = {
    position: [0, 0, 6],
    fov: 45,
    near: 0.1,
    far: 200,
} as const;

export const commonLight = {
    ambient: 0.5,
    directional: {
        position: [10, 10, 5] as [number, number, number],
        intensity: 1,
    },
} as const;
