'use client';

import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import type { SortBy, StatusFilter } from '../types';

export function useDashboardFilters() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('dateDesc');
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  return { search, setSearch, statusFilter, setStatusFilter, sortBy, setSortBy, debouncedSearch };
}
