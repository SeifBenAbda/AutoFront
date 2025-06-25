import { state } from "../utils/shared_functions";
import { fetchCarRequestStats, fetchConversionStats, fetchDocumentMissingStats, fetchDossierStats, fetchOverdueRappels, fetchPlanningRappels } from "../services/statsService";
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
        queryFn: () => fetchDocumentMissingStats(state.databaseName, page, status, navigate),
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
        queryFn: () => fetchCarRequestStats(state.databaseName, carModels, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}
export interface PlanningRappelResult {
    clientName:string; 
    carType:string; 
    rappelDate: Date;
    devisId: number;
    rappelContent: string;
}

export interface RappelsByCreator {
    [creator: string]: PlanningRappelResult[];
}

export interface PlanningRappelData {
    creators: string[];
    rappelsByCreator: RappelsByCreator;
    allCreators:string[];
}

export interface PlanningRappel {
    result: PlanningRappelData;
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}


export const usePlanningRappels = (page:number, startingDate:Date, endingDate:Date,selectedCreator:string) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook
    return useQuery<PlanningRappel>({
        queryKey: ['planningRappels', page, startingDate, endingDate,selectedCreator],
        queryFn: () => fetchPlanningRappels(state.databaseName, page, startingDate, endingDate,selectedCreator, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,   
        refetchOnWindowFocus: false,
    });
};


export const useOverDueRappels = (page:number, startingDate:Date, endingDate:Date,selectedCreator:string) => {
    const navigate = useNavigate(); // Move the useNavigate call here inside the hook
    return useQuery<PlanningRappel>({
        queryKey: ['overDueRappels', page, startingDate, endingDate,selectedCreator],
        queryFn: () => fetchOverdueRappels(state.databaseName, page, startingDate, endingDate,selectedCreator, navigate), // Pass navigate to the fetchCarModels function
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}



export interface DossierStats {
    result: DossierStat[];
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}

const useDossierStats = (status: string, page: number = 1) => {
    const navigate = useNavigate();

    return useQuery<DossierStats>({
        queryKey: ['dossierStats', status, page],
        queryFn: () => fetchDossierStats(state.databaseName, status, page, navigate),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};

export default useDossierStats;




//-- Taux de conversion
export interface CreatorStats {
    creator: string;
    totalDevis: number;
    rappelsCount: number;
    enCoursCount: number;
    reserveCount: number;
    hdsiCount: number;
    factureCount: number;
    livreCount: number;
    annuleCount: number;
    tauxConversion: string;
}

export interface ConversionStatsResult {
    creators: CreatorStats[];
    totals:CreatorStats;
    totalCreators: number;
}

export interface ConversionStats {
    result: ConversionStatsResult;
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}

export const useConversionStats = (page: number = 1, startingDate: Date, endingDate: Date) => {
    const navigate = useNavigate();
    
    return useQuery<ConversionStats>({
        queryKey: ['conversionStats', page, startingDate, endingDate],
        queryFn: () => fetchConversionStats(state.databaseName, page, startingDate, endingDate, navigate),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};