import { databaseName } from "../utils/shared_functions";
import { fetchDossierStats } from "../services/statsService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export interface DossierStat {
    devisId: number;
    clientName: string;
    createdDate: Date;
    reservationDate: Date;
  }


const useDossierStats = (status:string) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<DossierStat[]>({
        queryKey: [status],
        queryFn: () => fetchDossierStats(databaseName,status,navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useDossierStats;