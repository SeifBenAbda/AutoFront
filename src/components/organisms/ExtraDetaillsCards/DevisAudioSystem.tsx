import React, { useEffect, useState } from 'react';
import useAudioRecorder from '../../../hooks/useAudioRecorder';
import { useAudioUpload, useGetAudioFiles } from '../../../hooks/useUploadAudio';
import { Mic, StopCircle, Trash2 } from 'lucide-react';
import CustomAudioPlayer from '../../../components/atoms/CustomAudioPlayer';
import { Button } from '../../../@/components/ui/button';
import { Card, CardContent } from '../../../@/components/ui/card';
import { useNavigate } from 'react-router-dom';


interface AudioFile {
    id: number;
    file_name: string;
    file_path: string;
}

const AudioRecorder: React.FC<{ devisId: number }> = ({ devisId }) => {
    const API_URL = import.meta.env.VITE_FILES_URL;
    const {
        isRecording,
        startRecording,
        stopRecording,
        audioBlob,
        resetRecording,
    } = useAudioRecorder();

    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const [isLoadingAudios, setIsLoadingAudios] = useState(true); // State for loading audios
    const [showBottomBar, setShowBottomBar] = useState(false); // State to control bottom bar visibility
    const [uploadMessage, setUploadMessage] = useState<string>(''); // State for upload messages
    const navigate = useNavigate();
    const { data: fetchedAudioFiles, refetch } = useGetAudioFiles({ devisId,navigate });
    
    const uploadAudio = useAudioUpload({ devisId, navigate });

    useEffect(() => {
        if (fetchedAudioFiles?.audioFiles) {
            setAudioFiles(fetchedAudioFiles.audioFiles);
            setIsLoadingAudios(false); // Stop loading when files are fetched
        }
    }, [fetchedAudioFiles]);

    useEffect(() => {
        if (uploadAudio.isSuccess) {
            setShowBottomBar(false); // Hide bottom bar on successful upload
            setUploadMessage('Upload réussi!'); // Success message
            refetch();
            setIsLoadingUpload(false);

            // Clear the message after 3 seconds
            setTimeout(() => {
                setUploadMessage('');
            }, 3000);
        } else if (uploadAudio.isError) {
            setUploadMessage('Erreur lors de l\'upload. Veuillez réessayer.'); // Error message
            setIsLoadingUpload(false);

            // Clear the message after 3 seconds
            setTimeout(() => {
                setUploadMessage('');
            }, 3000);
        }
    }, [uploadAudio.isSuccess, uploadAudio.isError, refetch]);

    useEffect(() => {
        if (audioBlob) {
            setShowBottomBar(true); // Show bottom bar when audioBlob is available
        }
    }, [audioBlob]);

    const handleRecordClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleUpload = async () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('database', 'Commer_2024_AutoPro');
            formData.append('DevisId', devisId.toString());
            formData.append('file', new File([audioBlob], `audio_${Date.now()}.wav`, { type: 'audio/wav' }));

            setIsLoadingUpload(true); // Set loading state to true before uploading
            setUploadMessage('Uploading...'); // Set loading message
            uploadAudio.mutate(formData);
            resetRecording();
        } else {
            console.error("No audioBlob to upload");
        }
    };

    const handleCancel = () => {
        resetRecording();
        setShowBottomBar(false); // Hide bottom bar when cancelled
    };

    return (
        <div className="p-4 relative">
            {isLoadingUpload && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="text-lightWhite font-oswald">Veuillez patienter...</div>
                </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
                <div className='flex flex-row space-x-2 items-center'>
                    <h2 className="text-xl font-bold text-highGrey2 font-oswald">Rappels Audio</h2>
                    {/* Display upload messages */}
                    {uploadMessage && (
                        <div className="p-2 text-center bg-red-500 border-red-500 rounded-md text-lightWhite font-oswald">
                            {uploadMessage}
                        </div>
                    )}
                </div>
                <Button
                    onClick={handleRecordClick}
                    className="bg-blueCiel text-highGrey2 hover:bg-blueCiel border border-blueCiel rounded-md flex items-center gap-2 font-oswald"
                >
                    {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                    {isRecording ? "Arrêter l'enregistrement" : 'Enregistrer audio'}
                </Button>
            </div>

            {isLoadingAudios && (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className="w-12 h-12 border-4 border-t-highGrey2 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-4">
                {audioFiles.map((file) => {
                    const sanitizedFilePath = file.file_path.replace(/\\/g, '/');
                    const fullUrl = `${API_URL}${encodeURIComponent(sanitizedFilePath)}`;

                    return (
                        <Card key={file.id}>
                            <CardContent>
                                <CustomAudioPlayer fullUrl={fullUrl} fileName={file.file_name!} />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {showBottomBar && audioBlob && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span>Enregistrement terminé. Voulez-vous le transférer ?</span>
                        <CustomAudioPlayer fullUrl={URL.createObjectURL(audioBlob)} fileName={""} />
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleUpload} className="bg-greenOne hover:bg-greenOne text-highGrey2 rounded-md font-oswald">Transférer</Button>
                        <Button onClick={handleCancel} className="bg-lightRed hover:bg-lightRed rounded-md font-oswald">
                            <Trash2 size={20} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
