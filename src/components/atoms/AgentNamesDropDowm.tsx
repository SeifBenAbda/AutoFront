import { forwardRef } from 'react';

import { useAgentNames } from '../../hooks/useAgents';

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "../../@/components/ui/select";

interface AgentNamesDropDowmTypes {
value?: string;
onChange: (value: string) => void;
}

const AgentNamesDropDowm = forwardRef<HTMLButtonElement, AgentNamesDropDowmTypes>(
({ value, onChange }, ref) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    const { data: agents, isLoading, error } = useAgentNames();

    if (isLoading){
        return (
            <div className="flex justify-center items-center h-10">
                <div className="flex border-2 border-t-highBlue h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }
    if (error) return <div className='text-lightRed'>Erreur: {(error as Error).message}</div>;

    return (
        <Select onValueChange={onChange}>
            <SelectTrigger ref={ref} className="w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue">
                <SelectValue placeholder={value ? value.toString() : "Non déterminé"} className={hoverItem}/>
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey">
                <SelectItem value="Non déterminé" className={hoverItem}>
                    Non déterminé
                </SelectItem>
                {agents?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.username} className={hoverItem}>
                        {agent.username}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
);

AgentNamesDropDowm.displayName = 'AgentNamesDropDowm';

export default AgentNamesDropDowm;