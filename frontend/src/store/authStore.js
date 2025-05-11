import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  token: localStorage.getItem("token") || null,
  setUser: (user) => {
    set({ user });
    localStorage.setItem("userInfo", JSON.stringify(user));
  },
  setToken: (token) => {
    set({ token });
    localStorage.setItem("token", token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
