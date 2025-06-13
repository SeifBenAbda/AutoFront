import PlanningRappelComponent from '../components/organisms/DashboardDetails/PlanningRappel';
import CarRequestStats from '../components/organisms/DashboardDetails/CarRequestStats';
import DocumentMissingStats from '../components/organisms/DashboardDetails/documentMissing';
import DossierStats from '../components/organisms/DashboardDetails/globalStats';
import React from 'react';
import ConversionStats from '../components/organisms/DashboardDetails/ConversionStats';


const DashboardPage: React.FC = () => {
    return (
        <div className="flex flex-col space-y-2">
            <DocumentMissingStats />
            <div className='flex flex-col min-[1680px]:flex-row min-[1680px]:space-x-2 min-[1680px]:space-y-0 space-y-2'>
                <ConversionStats />
                <PlanningRappelComponent />
            </div>
            <div className='flex flex-col min-[1680px]:flex-row min-[1680px]:space-x-2 min-[1680px]:space-y-0 space-y-2'>
                <DossierStats />
                <CarRequestStats />
            </div>
        </div>
    );
};

export default DashboardPage;
