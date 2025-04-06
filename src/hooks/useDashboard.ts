import { databaseName } from "../utils/shared_functions";
import { fetchCarRequestStats, fetchDocumentMissingStats, fetchDossierStats } from "../services/statsService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export interface DossierStat {
    devisId: number;
    clientName: string;
    carModel: string;
    createdDate: Date;
    reservationDate: Date;
}


export interface DocumentMissingData {
    devisId: number;
    clientName: string;
    carModel: string;
    creationDate: Date;
    facturationDate: Date;
    missingDocuments: string[];
}

export interface DocumentMissingStats {
  result: DocumentMissingData[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export const useDocumentMissingStats = (page: number, status: string) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook
    return useQuery<DocumentMissingStats>({
        queryKey: ['documentMissingStats', page, status], // Include all dependencies in the key
        queryFn: () => fetchDocumentMissingStats(databaseName, page, status, navigate),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
};


export interface CarSalesStats {
    TOTAL_SALES: number;
    TODAY: number;
    THIS_MONTH: number;
}

export interface CarUnavailableStats {
    message: string;
}

export type CarRequestStats = {
    [carModel: string]:
        | CarUnavailableStats
        | { [seller: string]: CarSalesStats };
};

export const useCarStats = (carModels: string[]) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook

    return useQuery<CarRequestStats>({
        queryKey: ['carModels', carModels],
        queryFn: () => fetchCarRequestStats(databaseName, carModels, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
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