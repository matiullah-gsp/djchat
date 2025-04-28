import { useState, useCallback } from "react";
import { BASE_URL } from "../config";
import { useAxiosWithInterceptor } from "../helper/jwt-interceptor";
import { AxiosError } from "axios";

// Generic type for the data
interface UseCrudProps<T> {
  apiPath: string;
  initialData?: T;
}

function useCrud<T>({ apiPath, initialData }: UseCrudProps<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  //   const [data, setData] = useState<T | undefined>(initialData);
  const axios = useAxiosWithInterceptor();

  const url = `${BASE_URL}/${apiPath}`;

  // Memoize functions to prevent unnecessary re-renders
  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        setError(error.response?.data);
      }
    }
  }, [axios, url]);

  const create = useCallback(
    async <D>(data: D) => {
      try {
        setLoading(true);
        const response = await axios.post(url, data);
        setLoading(false);
        return response.data;
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          setError(error.response?.data);
        }
      }
    },
    [axios, url]
  );

  const read = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/${id}`);
        setLoading(false);
        return response.data;
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          setError(error.response?.data);
        }
      }
    },
    [axios, url]
  );

  const update = useCallback(
    async <D>(id: string, data: D) => {
      try {
        setLoading(true);
        const response = await axios.put(`${url}/${id}`, data);
        setLoading(false);
        return response.data;
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          setError(error.response?.data);
        }
      }
    },
    [axios, url]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await axios.delete(`${url}/${id}`);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error instanceof AxiosError) {
          setError(error.response?.data);
        }
      }
    },
    [axios, url]
  );

  return {
    getAll,
    create,
    read,
    update,
    remove,
    loading,
    error,
    // data,
    // setData,
  };
}

export default useCrud;
