import React, { useState, useEffect, useReducer } from 'react';

function dataFetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, isError: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
}

export interface IUseQuery<T> {
  isLoading: boolean;
  isError: boolean;
  data: T;
  setParams: React.Dispatch<any>;
  setData: (data: T) => void;
  refetch: () => void;
}

export default function useQuery<T = any>(
  service: Function,
  initialData?: T,
  initialParams?: any,
): IUseQuery<T> {
  const [params, setParams] = useState(initialParams);
  const [refetchFlag, setRefetchFlag] = useState<boolean>(false);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await service(params);

        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [params, refetchFlag]);

  const setData = data => dispatch({ type: 'FETCH_SUCCESS', payload: data });

  const refetch = () => setRefetchFlag(!refetchFlag);

  return { ...state, setParams, setData, refetch };
}
