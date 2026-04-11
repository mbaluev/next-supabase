import { useCallback } from 'react';

export function useQueryString(searchParams: URLSearchParams) {
  const addParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  const removeParam = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );
  return { addParam, removeParam };
}
