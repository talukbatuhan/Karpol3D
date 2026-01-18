'use client';

import { Html, useProgress } from '@react-three/drei';

export default function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-lg p-4 text-white font-mono min-w-[150px]">
                <div className="h-1 w-full bg-zinc-700 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-blue-500 transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-zinc-400">{progress.toFixed(0)}% loaded</p>
            </div>
        </Html>
    );
}
