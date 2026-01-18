'use client';

import { Suspense } from 'react';
import { ThreeElements } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import Loader from './Loader';

type ModelProps = ThreeElements['group'] & {
    url?: string;
};

function GLTFModel({ url, ...props }: { url: string } & ThreeElements['group']) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} {...props} />;
}

export default function Model({ url, ...props }: ModelProps) {
    if (!url) {
        return (
            <group {...props}>
                <mesh rotation={[0, 0, 0]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
            </group>
        );
    }

    return (
        <group {...props} dispose={null}>
            <Suspense fallback={<Loader />}>
                <GLTFModel url={url} />
            </Suspense>
        </group>
    );
}
