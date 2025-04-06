import CarRequestStats from '../components/organisms/DashboardDetails/CarRequestStats';
import DocumentMissingStats from '../components/organisms/DashboardDetails/documentMissing';
import DossierStats from '../components/organisms/DashboardDetails/globalStats';
import React from 'react';


const DashboardPage: React.FC = () => {
    return (
        <div className="flex flex-col items-start min-[1230px]:flex-row min-[1230px]:space-x-2 min-[1230px]:space-y-0 space-y-2">
            <DocumentMissingStats/>
            <div className='flex flex-col space-y-2'>
            <DossierStats />
            <CarRequestStats selectedCars={["Hyundai Grand i10 GLS","Hyundai i20 GLS","Hyundai Venue TURBO","Hyundai Tucson TG"]} />
            </div>
        </div>
    );
};

export default DashboardPage;
