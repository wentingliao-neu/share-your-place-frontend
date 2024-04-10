import { useCallback, useState, useEffect } from "react";

let logoutTimer;
export const useAuth = () => {
   const [token, setToken] = useState(null);
   const [userId, setUserId] = useState(null);
   const [expirationDate, setExpirationDate] = useState();
   const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpireDate =
         expirationDate || new Date(new Date().getTime() + 3600000);
      setExpirationDate(tokenExpireDate);
      localStorage.setItem(
         "userData",
         JSON.stringify({
            userId: uid,
            token: token,
            expiration: tokenExpireDate.toISOString(),
         })
      );
   }, []);
   const logout = useCallback(() => {
      setToken(null);
      setExpirationDate(null);
      setUserId(null);
      localStorage.removeItem("userData");
   }, []);

   useEffect(() => {
      if (token && expirationDate) {
         const remainingTime = expirationDate.getTime() - new Date().getTime();
         logoutTimer = setTimeout(logout, remainingTime);
      } else {
         clearTimeout(logoutTimer);
      }
   }, [token, logout, expirationDate]);

   useEffect(() => {
      const data = JSON.parse(localStorage.getItem("userData"));
      if (data && data.token && new Date(data.expiration) > new Date()) {
         login(data.userId, data.token, new Date(data.expiration));
      }
   }, [login]);
   return { token, login, logout, userId };
};
