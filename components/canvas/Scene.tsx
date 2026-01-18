'use client';

import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { Suspense } from 'react';
import clsx from 'clsx'; // Assuming clsx is installed, if not we'll install it or just use template literals. I installed it earlier.

type SceneProps = {
    children?: React.ReactNode;
    className?: string;
    eventSource?: React.RefObject<HTMLElement>;
    eventPrefix?: 'client' | 'offset' | 'page' | 'layer' | 'screen';
};

export default function Scene({ children, className, eventSource, eventPrefix = 'client', ...props }: SceneProps) {
    return (
        <Canvas
            className={clsx('relative h-full w-full', className)}
            eventSource={eventSource}
            eventPrefix={eventPrefix}
            {...props}
        >
            <View.Port />
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </Canvas>
    );
}
