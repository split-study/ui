import { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
type Props<T> = {
  queryFn: () => Promise<T>;
};

export const useQuery = <T>({ queryFn }: Props<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    errors?: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    const request = async () => {
      try {
        setIsLoading(true);

        const data = await queryFn();

        setData(data);
      } catch (err) {
        const axiosError = (err as AxiosError)?.response?.data as {
          message: string;
          errors?: Record<string, string>;
        };

        setError(axiosError ?? null);
      } finally {
        setIsLoading(false);
      }
    };

    request();
  }, []);

  return { data, isLoading, error };
};
