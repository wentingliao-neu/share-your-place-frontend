import { useState, useCallback, useRef, useEffect } from "react";
export function useHttpClient() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   const activeHttpRequests = useRef([]);
   const sendRequest = useCallback(
      async (url, method = "GET", body = null, headers = {}) => {
         setIsLoading(true);
         const httpAbortCtrl = new AbortController();
         activeHttpRequests.current.push(httpAbortCtrl);

         try {
            const response = await fetch(url, {
               method,
               body,
               headers,
               signal: httpAbortCtrl.signal,
            });
            const data = await response.json();
            activeHttpRequests.current = activeHttpRequests.current.filter(
               (re) => re !== httpAbortCtrl
            );
            if (!response.ok) throw new Error(data.message);
            setIsLoading(false);
            return data;
         } catch (err) {
            if (err.message !== "The user aborted a request.") {
               setError(err.message);
               setIsLoading(false);
               throw error;
            }
         }
      },
      [error]
   );
   function clearError() {
      setError(null);
   }
   useEffect(() => {
      return () => {
         try {
            activeHttpRequests.current.forEach((abortCtrl) =>
               abortCtrl.abort()
            );
         } catch (err) {}
      };
   }, []);
   return { isLoading, error, sendRequest, clearError };
}
