// hooks/useMapCategory.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { getApi } from '../../api/getApi/getApi';
import { EndPoints } from '../../services/EndPoints';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubCategory {
    id: string;
    title: string;
    name?: string;
    icon: string;
    image?: string;
    headingId?: number | null;
    heading?: {
        id: number;
        name: string;
    };
}

export interface Category {
    id: string;
    title: string;
    name?: string;
    icon: string;
    image?: string;
    subcategories: SubCategory[];
    groupedSubcategories?: {
        [headingName: string]: SubCategory[];
    };
}

export const useCategories = (categoryId?: string) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategoryId, setActiveCategoryId] = useState<string>('');
    const [activeSubcategoryId, setActiveSubcategoryId] = useState<string>('');
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
    const [subSubcategoriesLoading, setSubSubcategoriesLoading] = useState(false);

    // Load subcategories when categoryId changes
    useEffect(() => {
        if (categoryId) {
            loadSubcategories(categoryId);
        } else {
            // Reset state if no categoryId is provided (or handled differently based on requirement)
            setLoading(false);
            setSubcategoriesLoading(false);
        }
    }, [categoryId]);

    // Group subcategories by heading
    const groupSubcategoriesByHeading = (subcategories: SubCategory[]) => {
        const grouped: { [headingName: string]: SubCategory[] } = {};

        subcategories.forEach(subcategory => {
            const headingName = subcategory.heading?.name || 'Other Categories';

            if (!grouped[headingName]) {
                grouped[headingName] = [];
            }

            grouped[headingName].push(subcategory);
        });

        return grouped;
    };

    const loadSubcategories = async (parentCategoryId: string) => {
        try {
            setSubcategoriesLoading(true);
            setError(null);

            const token = await AsyncStorage.getItem('authToken');
            const endpoint = `/${EndPoints.getSubCategories}${parentCategoryId}`;

            const dd = await getApi(endpoint, setLoading, token);
            const data = dd?.data?.data;

            // Transform API response to match our Category structure
            const transformedCategories: Category[] = Array.isArray(data) ? data.map((item: any) => ({
                id: item.id?.toString() || Math.random().toString(),
                title: item.name || item.title || 'Untitled',
                name: item.name,
                icon: item.image || item.icon,
                image: item.image,
                subcategories: [] // Will be loaded when category is activated
            })) : [];

            setCategories(transformedCategories);

            // Set first category as active if available
            if (transformedCategories.length > 0) {
                setActiveCategoryId(transformedCategories[0].id);
                // Automatically load sub-subcategories for the first category
                loadSubSubcategoriesForCategory(transformedCategories[0].id);
            }
        } catch (err) {
            setError('Failed to load categories');
            console.error('Error loading categories:', err);
        } finally {
            setSubcategoriesLoading(false);
            setLoading(false);
        }
    };

    const loadSubSubcategoriesForCategory = async (categoryId: string) => {
        try {
            setSubSubcategoriesLoading(true);

            const token = await AsyncStorage.getItem('authToken');
            const endpoint = `${EndPoints.getSuperSubCategories}${categoryId}`;

            const dd = await getApi(endpoint, setLoading, token);
            const data = dd?.data?.data;

            // Transform sub-subcategories data
            const subSubcategories: SubCategory[] = Array.isArray(data) ? data.map((item: any) => ({
                id: item.id?.toString() || Math.random().toString(),
                title: item.name || item.title || 'Untitled',
                name: item.name,
                icon: item.image || item.icon,
                image: item.image,
                headingId: item.headingId,
                heading: item.heading
            })) : [];

            // Group subcategories by heading
            const groupedSubcategories = groupSubcategoriesByHeading(subSubcategories);

            // Update categories with sub-subcategories
            setCategories(prev => prev.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        subcategories: subSubcategories,
                        groupedSubcategories: groupedSubcategories
                    }
                    : cat
            ));

            return subSubcategories;
        } catch (err) {
            console.error('Error loading sub-subcategories:', err);
            setError('Failed to load items');
            return [];
        } finally {
            setSubSubcategoriesLoading(false);
        }
    };

    const changeActiveCategory = async (categoryId: string) => {
        setActiveCategoryId(categoryId);
        setActiveSubcategoryId('');

        const category = categories.find(cat => cat.id === categoryId);

        // Load sub-subcategories if not already loaded
        if (category && (!category.subcategories || category.subcategories.length === 0)) {
            await loadSubSubcategoriesForCategory(categoryId);
        }
    };

    const handleSubcategoryPress = async (subcategory: SubCategory) => {
        setActiveSubcategoryId(subcategory.id);
        return subcategory;
    };

    const retry = () => {
        if (categoryId) {
            loadSubcategories(categoryId);
        }
    };

    return {
        categories,
        loading,
        error,
        activeCategoryId,
        activeSubcategoryId,
        subcategoriesLoading,
        subSubcategoriesLoading,
        changeActiveCategory,
        handleSubcategoryPress,
        retry,
    };
};