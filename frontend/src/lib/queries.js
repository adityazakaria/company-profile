import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { companyApi, productApi, newsApi } from './api';

export const useCompany = () =>
  useQuery({ queryKey: ['company'], queryFn: companyApi.get, select: (r) => r.data, staleTime: 5 * 60_000 });

export const useProducts = (params) =>
  useQuery({ queryKey: ['products', params], queryFn: () => productApi.list(params), placeholderData: keepPreviousData });

export const useProductCategories = () =>
  useQuery({ queryKey: ['product-categories'], queryFn: productApi.categories, select: (r) => r.data, staleTime: 5 * 60_000 });

export const useProduct = (slug) =>
  useQuery({ queryKey: ['product', slug], queryFn: () => productApi.get(slug), select: (r) => r.data });

export const useNews = (params) =>
  useQuery({ queryKey: ['news', params], queryFn: () => newsApi.list(params), placeholderData: keepPreviousData });

export const useNewsCategories = () =>
  useQuery({ queryKey: ['news-categories'], queryFn: newsApi.categories, select: (r) => r.data, staleTime: 5 * 60_000 });

export const useNewsItem = (slug) =>
  useQuery({ queryKey: ['news-item', slug], queryFn: () => newsApi.get(slug), select: (r) => r.data });
