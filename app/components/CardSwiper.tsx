import React, {useRef, useMemo} from "react";
import {View, Text, StyleSheet, Dimensions} from "react-native";
import Swiper from 'react-native-deck-swiper'
import {useAppStore} from "@/app/store/useAppStore";
import ConfettiController, {
    ConfettiControllerRef,
} from "@/app/components/ConfettiBurst";

export type Genre = "maskulin" | "feminin" | "neutrum";

type CardProps = {
    words: WordEntry[];
    onSwipe: () => void;
    currentIndex: number;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface WordEntry {
    id: string;
    lemma: string;
    forms: string[];
    genres: Genre[];
    english: string[];
}

interface ProcessedCard extends WordEntry {
    selectedForm: string;
    selectedGenre: Genre;
}

export default function SwipeCard({words, currentIndex, setIsOpen}: CardProps) {
    const appStore = useAppStore();

    const screenHeight = Dimensions.get("window").height;

    function swipe(
        swipeGenre: Genre,
        cardGenre: Genre
    ) {
        if (swipeGenre !== cardGenre) {
            appStore.wrong();
            return false;
        }

        appStore.correct();

        confettiRef.current?.triggerConfetti();

        return true;
    }

    const swiperRef = useRef<Swiper<ProcessedCard>>(null)
    const processedCards = useMemo<ProcessedCard[]>(() => {
        const parsePgArray = (value: string | string[]): string[] =>
            Array.isArray(value)
                ? value
                : value
                    .replace(/^{|}$/g, "")
                    .split(",")
                    .map((item) => item.trim());
        if (!Array.isArray(words)) {
            words = [words];
        }

        return words.map((card) => {
            const forms = parsePgArray(card.forms);
            const genres = parsePgArray(card.genres) as Genre[];
            const english = parsePgArray(card.english);

            const selectedIndex =
                forms.length > 1
                    ? Math.floor(Math.random() * forms.length)
                    : 0;

            return {
                id: card.id,
                lemma: card.lemma,
                forms,
                genres,
                english,
                selectedForm: forms[selectedIndex] ?? "",
                selectedGenre:
                    genres[selectedIndex] ??
                    genres[0],
            };
        });
    }, [words]);

    const confettiRef =
        useRef<ConfettiControllerRef>(null);

    return (
        <View testID="hereboy" style={[styles.container, {height: screenHeight- 80}]}>
            <Swiper
                ref={swiperRef}
                cards={processedCards}
                cardIndex={currentIndex}
                disableBottomSwipe
                onSwipedLeft={(cardIndex: number) => {
                    const card = processedCards[cardIndex];
                    swipe("feminin", card.selectedGenre);
                }}
                onSwipedRight={(cardIndex: number) => {
                    const card = processedCards[cardIndex];
                    swipe("maskulin", card.selectedGenre);
                }}
                onSwipedTop={(cardIndex: number) => {
                    const card = processedCards[cardIndex];
                    swipe("neutrum", card.selectedGenre);
                }}
                onSwipedAll={() => {
                    setTimeout(()=>{
                        setIsOpen(true)
                    },600)
                }}
                cardVerticalMargin={80}
                renderCard={(card: ProcessedCard) => (
                    <View style={styles.cardContainer}>
                        <View style={styles.cardContent}>
                            <Text style={styles.lemma}>{card.selectedForm}</Text>
                            <View style={styles.englishContainer}>
                                {card.english.map((translation, i) => (
                                    <Text key={i} style={styles.english}>
                                        • {translation}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
                stackSize={3}
                backgroundColor={"#ffffff"}
                stackSeparation={15}
                overlayLabels={{
                    left: {
                        element: <View style={{
                            position: 'absolute',
                            top: '0%',
                            left: '50%',
                            transform: [{translateX: "-50%"},],
                            width: 340,
                            height: 420,
                            padding: 32,
                            borderRadius: 12,
                            backgroundColor: "rgba(255,192,203,0.8)",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-end"
                        }}>
                            <Text style={{
                                fontSize: 96,
                                fontWeight: "bold",
                                color: "#ffffff",
                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                textShadowOffset: {width: 2, height: 2},
                                textShadowRadius: 1
                            }}>Die</Text>
                        </View>,
                    },
                    right: {
                        element: <View style={{
                            position: 'absolute',
                            top: '0%',
                            left: '50%',
                            transform: [{translateX: "-50%"},],
                            width: 340,
                            height: 420,
                            padding: 32,
                            borderRadius: 12,
                            backgroundColor: "rgba(135,206,250,0.8)",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start"
                        }}>
                            <Text style={{
                                fontSize: 96,
                                fontWeight: "bold",
                                color: "#ffffff",
                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                textShadowOffset: {width: 2, height: 2},
                                textShadowRadius: 1
                            }}>Der</Text>
                        </View>,
                    },
                    top: {
                        element: <View style={{
                            position: 'absolute',
                            top: '0%',
                            left: '50%',
                            transform: [{translateX: "-50%"},],
                            width: 340,
                            height: 420,
                            padding: 32,
                            borderRadius: 12,
                            backgroundColor: "rgba(232,232,232,0.8)",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                        }}>
                            <Text style={{
                                fontSize: 96,
                                fontWeight: "bold",
                                color: "#ffffff",
                                textShadowColor: 'rgba(0, 0, 0, 0.85)',
                                textShadowOffset: {width: 2, height: 2},
                                textShadowRadius: 1
                            }}>Das</Text>
                        </View>,
                    }
                }}
                containerStyle={{
                    maxWidth: Dimensions.get('window').width,
                    backgroundColor: 'transparent',
                }}
                horizontalThreshold={80}
                verticalThreshold={80}
                animateOverlayLabelsOpacity
                animateCardOpacity
                swipeBackCard
            >
            </Swiper>
            <View style={[styles.confettiContainer, {height: screenHeight - 80}]}>
                <ConfettiController ref={confettiRef}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        justifyContent: 'center',
        alignItems: 'center',
        position: "relative"
    },
    confettiContainer: {
        width: "100%",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 99999,
    },
    confetti: {
        maxWidth: 1024
    },
    card: {
        flex: 1,
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 12,
        justifyContent: 'center',
        backgroundColor: 'white',
        position: "relative"
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    done: {
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        backgroundColor: 'transparent'
    },
    cardContainer: {
        width: 340,
        height: 420,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.18,
        shadowRadius: 18,

        elevation: 12,
        position: "relative",
        overflow: "hidden",
        alignSelf: 'center',
    },
    cardContent: {
        userSelect: "none",
        flex: 1,
        padding: 32,
        justifyContent: "center",
        alignItems: "center"
    },
    lemma: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: "#1a1a1a",
        marginBottom: 18
    },
    forms: {
        fontSize: 20,
        color: "#555",
        textAlign: "center",
        marginBottom: 32
    },
    englishContainer: {
        marginTop: 12
    },
    english: {
        fontSize: 18,
        color: "#333",
        marginVertical: 4
    },
});