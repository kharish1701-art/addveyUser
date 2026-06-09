import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleFavorite, handleUnFavorite, apiHelper } from '../api/getApi/getApi';
import { EndPoints } from '../services/EndPoints';

interface FavoritesContextType {
    favoriteIds: Set<string>;
    toggleFavorite: (id: string, productId?: string) => Promise<boolean>;
    isFavorite: (id: string) => boolean;
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) return;

            const res = await apiHelper(EndPoints.getFavorite, {
                method: 'GET',
                token,
            });

            if (res?.success && res?.data?.data) {
                // Extract product IDs from the favorites list
                // Structure seems to be array of objects where each might have 'product' object or be the product itself
                // Based on AddCardPreview.tsx: item.id || item.product?.id
                const ids = new Set<string>();
                res.data.data.forEach((item: any) => {
                    const id = item.product?.id || item.productId || item.id;
                    if (id) ids.add(id.toString());
                });
                setFavoriteIds(ids);
                console.log('Context: Favorites loaded', ids.size);
            }
        } catch (error) {
            console.error('Context: Error fetching favorites:', error);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const isFavorite = useCallback((id: string) => {
        return favoriteIds.has(id.toString());
    }, [favoriteIds]);

    const toggleFavorite = useCallback(async (id: string, productId?: string) => {
        const idStr = id.toString();
        const isCurrentlyFavorite = favoriteIds.has(idStr);

        // Optimistic update
        setFavoriteIds(prev => {
            const next = new Set(prev);
            if (isCurrentlyFavorite) {
                next.delete(idStr);
            } else {
                next.add(idStr);
            }
            return next;
        });

        try {
            let success = false;
            if (isCurrentlyFavorite) {
                // Remove from favorites
                // API expects array of IDs ? Check handleUnFavorite signature
                // handleUnFavorite takes id or array of ids
                // note: handleUnFavorite in getApi.tsx uses 'remove-from-favorites' endpoint

                // IMPORTANT: For un-favorite, sometimes we need the favId vs productId.
                // However, looking at getApi.tsx: handleUnFavorite([item.id]) or [item.productId]
                // It seems to send 'productIds' in body. 
                // Let's assume sending the product ID is correct as per generic usage.

                success = await handleUnFavorite([id]);
            } else {
                // Add to favorites
                success = await handleFavorite(id);
            }

            if (!success) {
                // Revert on failure
                setFavoriteIds(prev => {
                    const next = new Set(prev);
                    if (isCurrentlyFavorite) {
                        next.add(idStr);
                    } else {
                        next.delete(idStr);
                    }
                    return next;
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error('Context: Error toggling favorite:', error);
            // Revert on error
            setFavoriteIds(prev => {
                const next = new Set(prev);
                if (isCurrentlyFavorite) {
                    next.add(idStr);
                } else {
                    next.delete(idStr);
                }
                return next;
            });
            return false;
        }
    }, [favoriteIds]);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, refreshFavorites: fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
