import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const passwordStore = (set => ({
    passwords : "",
    addPasswords : (password) => set(state => ({passwords : password}))

}))

export const usePasswordStore = create(
    devtools(
        persist(passwordStore, {
            name: "password",
        })
    )
);
