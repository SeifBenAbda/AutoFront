import PlanningRappelComponent from '../components/organisms/DashboardDetails/PlanningRappel';
import CarRequestStats from '../components/organisms/DashboardDetails/CarRequestStats';
import DocumentMissingStats from '../components/organisms/DashboardDetails/documentMissing';
import DossierStats from '../components/organisms/DashboardDetails/globalStats';
import React from 'react';
import OverDueRappels from '../components/organisms/DashboardDetails/OverDueRappels';


const DashboardPage: React.FC = () => {
    return (
        <div className="flex flex-col space-y-2">
            <DocumentMissingStats />
            <div className='flex flex-row space-x-2'>
                <PlanningRappelComponent />
                <OverDueRappels />
            </div>
            <div className='flex flex-row space-x-2'>
                <DossierStats />
                <CarRequestStats />
            </div>
        </div>
    );
};

export default DashboardPage;
