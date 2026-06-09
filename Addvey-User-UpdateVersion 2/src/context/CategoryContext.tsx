import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "../api/getApi/getApi";
import { EndPoints } from "../services/EndPoints";

// Define Types (matching what was in CategoriesScreen)
export type SubCategory = {
    id: string;
    name: string;
    icon: any;
    image?: string;
};

export type Category = {
    id: string;
    name: string;
    icon: any;
    image?: string;
    subCategories?: SubCategory[];
};

type CategoryContextType = {
    categories: Category[];
    loading: boolean;
    refetch: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Initial loading true

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("authToken");
            const res = await getApi(EndPoints.getCategories, undefined, token || "", undefined,'catContext'); // undefined for setLoading as we manage it locally
            if (res?.success) {
                setCategories(Array.isArray(res?.data) ? res.data : []);
            } else {
                // Handle error or empty state if needed
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, loading, refetch: fetchCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used within a CategoryProvider");
    }
    return context;
};
