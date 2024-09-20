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
        <Form {...form} className="relative flex flex-col">
            
        </Form>



    );
};

export default ArticleFormSection;
