import { Button } from '../../@/components/ui/button';
import React, { useRef, useState, useEffect } from 'react';

interface CustomAudioPlayerProps {
    fullUrl: string;
    fileName: string;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ fullUrl, fileName }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState<number | null>(null);
    const [showDuration, setShowDuration] = useState(false);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setShowDuration(true);
            setDuration(audioRef.current.duration);
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
        setShowDuration(false);
        setCurrentTime(0);
    };

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.addEventListener('loadedmetadata', () => {
                if (audioElement.paused) {
                    setDuration(audioElement.duration);
                }
            });

            audioElement.addEventListener('ended', handleEnded);

            return () => {
                audioElement.removeEventListener('loadedmetadata', () => {
                    setDuration(audioElement.duration);
                });
                audioElement.removeEventListener('ended', handleEnded);
            };
        }
    }, []);

    // Fetch the audio file with authentication
    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Basic ${btoa('Faouzi:baf.syrine2013')}`, // Replace with your credentials
                    },
                    credentials: 'include', // Include credentials in the request
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch audio file');
                }

                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                }
            } catch (error) {
                console.error('Error fetching audio file:', error);
            }
        };

        fetchAudio();
    }, [fullUrl]);

    const progressPercent = (currentTime / (duration || 1)) * 100 || 0;

    return (
        <div className="audio-player bg-lightWhite p-2 rounded-md font-oswald w-full">
            <audio
                ref={audioRef}
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
                    {fileName === "" && (
                        <>
                            {showDuration && (
                                <div className="progress-info text-sm text-highGrey2">
                                    {Math.floor(currentTime)} secondes sur {duration !== null ? Math.floor(duration) : '...'} secondes
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className='flex flex-col space-y-2'>
                <div className="progress-bar relative w-full h-2 bg-gray-300 rounded-md overflow-hidden">
                    <div
                        className="progress bg-highGrey2 h-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {fileName !== "" && (
                    <>
                        {showDuration && (
                            <div className="progress-info text-sm text-highGrey2">
                                {Math.floor(currentTime)} secondes sur {duration !== null ? Math.floor(duration) : '...'} secondes
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomAudioPlayer;
