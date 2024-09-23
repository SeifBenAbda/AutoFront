import { Button } from '../../@/components/ui/button';
import React, { useRef, useState, useEffect } from 'react';

interface CustomAudioPlayerProps {
    fullUrl: string;
    fileName: string;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ fullUrl, fileName }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState<number | null>(null); // Duration will be set to null initially
    const [showDuration, setShowDuration] = useState(false); // Manage visibility of duration

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setShowDuration(true); // Show duration when play is pressed
            setDuration(audioRef.current.duration); // Set duration when play is pressed
        }
    };

    const pauseAudio = () => {
        audioRef.current?.pause();
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleEnded = () => {
        setShowDuration(false); // Hide duration when audio ends
        setCurrentTime(0); // Optionally reset current time when audio ends
    };

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.addEventListener('loadedmetadata', () => {
                // Set the duration when metadata is loaded if it's not playing
                if (audioElement.paused) {
                    setDuration(audioElement.duration);
                }
            });

            // Add event listener for audio ending
            audioElement.addEventListener('ended', handleEnded);

            return () => {
                audioElement.removeEventListener('loadedmetadata', () => {
                    setDuration(audioElement.duration);
                });
                audioElement.removeEventListener('ended', handleEnded); // Clean up event listener
            };
        }
    }, []);

    // Calculate progress percentage
    const progressPercent = (currentTime / (duration || 1)) * 100 || 0; // Prevent division by zero

    return (
        <div className="audio-player bg-lightWhite p-2 rounded-md font-oswald w-full">
            <audio
                ref={audioRef}
                src={fullUrl}
                onTimeUpdate={handleTimeUpdate}
            />



            <div className='flex flex-row space-x-2 mb-2'>
                <span className="mt-2 text-sm">{fileName}</span>

                <div className='flex flex-row space-x-2 items-center'>
                    <Button onClick={playAudio} className="bg-greenOne hover:bg-greenOne border-greenOne border rounded-md">
                        Écoutez
                    </Button>
                    <Button onClick={pauseAudio} className="bg-red-600 text-white px-4 py-2 rounded">
                        Pause
                    </Button>
                    {fileName == "" && <>
                        {showDuration && (
                            <div className="progress-info text-sm text-highGrey">
                                {Math.floor(currentTime)} secondes sur {duration !== null ? Math.floor(duration) : '...'} secondes
                            </div>
                        )}
                    </>}
                </div>
            </div>
            <div className='flex flex-col space-y-2'>
                <div className="progress-bar relative w-full h-2 bg-gray-300 rounded-md overflow-hidden">
                    <div
                        className="progress bg-highGrey h-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {fileName != "" && <>
                    {showDuration && (
                        <div className="progress-info text-sm text-highGrey">
                            {Math.floor(currentTime)} secondes sur {duration !== null ? Math.floor(duration) : '...'} secondes
                        </div>
                    )}
                </>}
            </div>
        </div>
    );
};

export default CustomAudioPlayer;
