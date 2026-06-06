import { create } from "zustand";

type AppState = {
    streak: number;
    guesses: number;
    correctGuesses: number;
    totalGuesses: number;
    wrongGuesses: number;

    correct: () => void;
    wrong: () => void;
    reset: () => void;
};

export const useAppStore = create<AppState>((set) => ({
    streak: 0,
    guesses: 0,
    totalGuesses: 0,
    correctGuesses: 0,
    wrongGuesses: 0,

    correct: () =>
        set((state) => ({
            streak: state.streak + 1,
            guesses: state.guesses + 1,
            correctGuesses: state.correctGuesses + 1,
        })),

    wrong: () =>
        set((state) => ({
            streak: 0,
            guesses: state.guesses + 1,
            wrongGuesses: state.wrongGuesses + 1,
        })),

    reset: () =>
        set((state)=>({
            streak: 0,
            guesses: 0,
            totalGuesses: 0,
            correctGuesses: 0,
            wrongGuesses: 0,
        }))
}));