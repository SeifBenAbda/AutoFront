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
    const { control, setValue, getValues } = form;
    const [selectedArticles, setSelectedArticles] = useState<{ article: Article, quantity: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Update the form with the current selected articles
        selectedArticles.forEach((item, index) => {
            setValue(`${formId}[${index}].ItemId`, item.article.libell);
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
        setValue(`${formId}[${index}].Quantity`, quantity); // Update form value
    };

    return (
        <Form {...form} className="flex-1">
            <div className="pl-3  font-oswald text-lg mb-2  text-white flex flex-row justify-between items-center">
                <div>Articles</div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className=" bg-greenZero text-greenFour rounded-md hover:bg-greenZero text-lg"
                >
                    +
                </Button>
            </div>
            <div className="w-full">


                <ArticleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelectArticle={handleSelectArticle}
                />

                {selectedArticles.length > 0 && selectedArticles.map((item, index) => (
                    <div key={index} className='border border-greenZero rounded-xl bg-greenZero mb-2'>
                        <FormCardContent form={form} className="text-greenFour mt-2 text-start pr-1" label={`Article N° ${index+1}`} name={`${formId}[${index}].ItemId`}>
                            <div className="flex flex-row items-center justify-between space-x-2">
                                <Controller
                                    name={`${formId}[${index}].ItemId`}
                                    control={control}
                                    render={({ field }) => (
                                        <div className='text-greenFour font-oswald'>{item.article.libell}</div>
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
                                            className='w-[20%] bg-greenZero border border-greenFour'
                                        />
                                    )}
                                />
                            </div>
                        </FormCardContent>



                    </div>
                ))}
            </div>
        </Form>
    );
};

export default ArticleFormSection;
