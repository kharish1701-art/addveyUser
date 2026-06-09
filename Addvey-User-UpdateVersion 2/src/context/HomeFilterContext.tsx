import React, { createContext, useContext, useState, ReactNode } from "react";
import { FilterState } from "../Components/HomeType/FilterModal";

interface FilterParams {
    category: string;
    listType: string;
    distance: string;
    recent: string;
    language: string;
    search: string;
    quickResponse: string;
}

interface HomeFilterContextType {
    selected: string | null;
    setSelected: (id: string | null) => void;
    showListTypeModal: boolean;
    setShowListTypeModal: (show: boolean) => void;
    showDistanceModal: boolean;
    setShowDistanceModal: (show: boolean) => void;
    showFilterModal: boolean;
    setShowFilterModal: (show: boolean) => void;
    showLanguageModal: boolean;
    setShowLanguageModal: (show: boolean) => void;
    filterParams: FilterParams;
    setFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>;
    currentFilters: FilterState;
    setCurrentFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    activeFilterCount: number;
    setActiveFilterCount: React.Dispatch<React.SetStateAction<number>>;
    showCategoryModal: boolean;
    setShowCategoryModal: (show: boolean) => void;
}

const HomeFilterContext = createContext<HomeFilterContextType | undefined>(
    undefined
);

export const HomeFilterProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [showListTypeModal, setShowListTypeModal] = useState(false);
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [filterParams, setFilterParams] = useState<FilterParams>({
        category: "",
        listType: "",
        distance: "",
        recent: "",
        language: "",
        search: "",
        quickResponse: "",
    });

    const [currentFilters, setCurrentFilters] = useState<FilterState>({
        category: [],
        vehicleType: [],
        budget: { min: 0, max: 30 },
        brands: [],
        years: [],
        transmission: [],
        fuel: [],
        others: [],
        attributes: {},
    });

    const [activeFilterCount, setActiveFilterCount] = useState(0);

    return (
        <HomeFilterContext.Provider
            value={{
                selected,
                setSelected,
                showListTypeModal,
                setShowListTypeModal,
                showDistanceModal,
                setShowDistanceModal,
                showFilterModal,
                setShowFilterModal,
                showLanguageModal,
                setShowLanguageModal,
                filterParams,
                setFilterParams,
                currentFilters,
                setCurrentFilters,
                activeFilterCount,
                setActiveFilterCount,
                showCategoryModal,
                setShowCategoryModal,
            }}
        >
            {children}
        </HomeFilterContext.Provider>
    );
};

export const useHomeFilter = () => {
    const context = useContext(HomeFilterContext);
    if (!context) {
        throw new Error("useHomeFilter must be used within a HomeFilterProvider");
    }
    return context;
};
