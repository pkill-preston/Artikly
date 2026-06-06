import { create } from "zustand";
import { persist } from "zustand/middleware";

type DailyStore = {
    completedWordId: string | null;
    completedCorrectly: boolean | null;
    expiresAt: number | null;

    markCompleted: (
        wordId: string,
        wasCorrect: boolean
    ) => void;

    isCompleted: (wordId: string) => boolean;
    reset: () => void;
};

function getNextMidnightTimestamp() {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return tomorrow.getTime();
}

export const useDailyStore = create<DailyStore>()(
    persist(
        (set, get) => ({
            completedWordId: null,
            completedCorrectly: null,
            expiresAt: null,

            markCompleted: (
                wordId: string,
                wasCorrect: boolean
            ) =>
                set({
                    completedWordId: wordId,
                    completedCorrectly: wasCorrect,
                    expiresAt: getNextMidnightTimestamp(),
                }),

            isCompleted: (wordId: string) => {
                const {
                    completedWordId,
                    expiresAt,
                } = get();

                if (
                    expiresAt &&
                    Date.now() >= expiresAt
                ) {
                    set({
                        completedWordId: null,
                        completedCorrectly: null,
                        expiresAt: null,
                    });

                    return false;
                }

                return completedWordId === wordId;
            },

            reset: () =>
                set({
                    completedWordId: null,
                    completedCorrectly: null,
                    expiresAt: null,
                }),
        }),
        {
            name: "daily-store",
        }
    )
);