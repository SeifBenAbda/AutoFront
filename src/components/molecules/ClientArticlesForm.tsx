import React, { useEffect, useState } from 'react';
import ArticleModal from '../atoms/ArticleModal';
import { Article } from '@/types/otherTypes';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../@/components/ui/form';
import FormCardContent from './FormCardContent';
import { Controller } from 'react-hook-form';
import { Button } from '../../@/components/ui/button';
import { Input } from '../../@/components/ui/input';

const ArticleFormSection: React.FC<any> = ({ form, formId }) => {
    const { control, setValue, formState: { errors } } = form;
    const [selectedArticles, setSelectedArticles] = useState<{ article: Article, quantity: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log("Assigning new Article ")
        selectedArticles.forEach((item, index) => {
            setValue(`${formId}[${index}].ItemId`, item.article.code);
            setValue(`${formId}[${index}].Quantity`, item.quantity);
        });
    }, [selectedArticles, formId, setValue]);

    const handleSelectArticle = (article: Article) => {
        setSelectedArticles((prev) => [...prev, { article, quantity: "1" }]);
        setIsModalOpen(false);
    };

    const handleQuantityChange = (index: number, quantity: string) => {
        const updatedArticles = [...selectedArticles];
        updatedArticles[index].quantity = quantity;
        setSelectedArticles(updatedArticles);
        setValue(`${formId}[${index}].Quantity`, quantity);
    };

    const handleDeleteArticle = (index: number) => {
        const updatedArticles = selectedArticles.filter((_, i) => i !== index);
        setSelectedArticles(updatedArticles);
        setValue(`${formId}[${index}].ItemId`, '');
        setValue(`${formId}[${index}].Quantity`, '');
    };

    // Determine the height based on errors
    const containerHeight = Object.keys(errors).length > 0 ? 'max-h-[90vh]' : 'max-h-[90vh]';

    return (
        <Form {...form} className="relative flex-1 max-h-[400px] overflow-y-auto">
            {/* Sticky header */}
            <div className="bg-darkGrey mb-2 w-[100%]">
                <div className="pl-3 font-oswald text-lg text-white flex flex-row justify-between items-center">
                    <div>Articles</div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-lightWhite text-darkGrey rounded-md hover:bg-lightWhite text-lg"
                    >
                        +
                    </Button>
                </div>
            </div>

            {/* Scrollable content */}
            <div className={`w-full mt-4 ${containerHeight} overflow-y-auto p-2`}>
                <ArticleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelectArticle={handleSelectArticle}
                    selectedArticles={selectedArticles}
                />

                {selectedArticles.length > 0 && selectedArticles.map((item, index) => (
                    <div key={index} className="border border-lightWhite rounded-xl bg-lightWhite mb-2">
                        <FormCardContent form={form} className="text-darkGrey mt-2 text-start pr-1" label={`Article N° ${index + 1}`} name={`${formId}[${index}].ItemId`}>
                            <div className="flex flex-row items-center justify-between space-x-2">
                                <Controller
                                    name={`${formId}[${index}].ItemId`}
                                    control={control}
                                    render={({ field }) => (
                                        <div className="text-darkGrey font-oswald w-[65%] text-start justify-start">{item.article.libell} <span className='ml-0'>({item.article.code})</span></div>
                                    )}
                                />
                                <Controller
                                    name={`${formId}[${index}].Quantity`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            {...field}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            className="w-[30%] bg-lightWhite border border-darkGrey"
                                        />
                                    )}
                                />
                            </div>

                        </FormCardContent>
                        <div className="flex justify-center mb-2">
                            <Button
                                onClick={() => handleDeleteArticle(index)}
                                className="bg-lightRed text-white rounded-md hover:bg-lightRed px-4 py-1 w-[80%]"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Form>
    );
};

export default ArticleFormSection;
