import DevisForm from "../components/organisms/DevisForm";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../@/components/ui/card";

const DevisPage: React.FC = () => {
    return (

        <Card className="p-2 m-2">
            <CardHeader>
                <CardTitle>Devis</CardTitle>
                <CardDescription>Devis pour voiture</CardDescription>
            </CardHeader>
            <CardContent>
                <DevisForm />
            </CardContent>
        </Card>


    );
};

export default DevisPage;
