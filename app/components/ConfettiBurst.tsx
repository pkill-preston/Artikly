import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CONFETTI_COLORS = [
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#34C759",
    "#0A84FF",
    "#AF52DE",
    "#FF2D55",
];

const PIECES_PER_SIDE = 18;
const RISE_DURATION = 400;
const FALL_DURATION = 550;

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export type ConfettiControllerRef = {
    triggerConfetti: () => void;
};

type Burst = {
    id: number;
};

type PieceProps = {
    side: "left" | "right";
    delay: number;
    color: string;
};

const MAX_CONFETTI_WIDTH = 1024;

const CONFETTI_AREA_WIDTH = Math.min(
    SCREEN_WIDTH,
    MAX_CONFETTI_WIDTH
);

const CONFETTI_OFFSET_X =
    (SCREEN_WIDTH - CONFETTI_AREA_WIDTH) / 2;

function ConfettiPiece({ side, delay, color }: PieceProps) {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const startX =
        side === "left"
            ? CONFETTI_OFFSET_X + 24
            : CONFETTI_OFFSET_X + CONFETTI_AREA_WIDTH - 24;

    const horizontalSpread =
        side === "left"
            ? random(60, 180)
            : random(-180, -60);

    const peakHeight = random(-260, -420);

    useEffect(() => {
        const rise = Animated.parallel([
            Animated.timing(translateX, {
                toValue: horizontalSpread,
                duration: RISE_DURATION,
                delay,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),

            Animated.timing(translateY, {
                toValue: peakHeight,
                duration: RISE_DURATION,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),

            Animated.timing(rotate, {
                toValue: random(120, 300),
                duration: RISE_DURATION,
                delay,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]);

        const fall = Animated.parallel([
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT * 0.4,
                duration: FALL_DURATION,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),

            Animated.timing(opacity, {
                toValue: 0,
                duration: FALL_DURATION,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),

            Animated.timing(rotate, {
                toValue: random(420, 720),
                duration: FALL_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]);

        Animated.sequence([rise, fall]).start();
    });

    const rotateInterpolate = rotate.interpolate({
        inputRange: [0, 720],
        outputRange: ["0deg", "720deg"],
    });

    return (
        <Animated.View
            style={[
                styles.confetti,
                {
                    backgroundColor: color,
                    left: startX,
                    bottom: 0,
                    opacity,

                    transform: [
                        { translateX },
                        { translateY },
                        { rotate: rotateInterpolate },
                    ],
                },
            ]}
        />
    );
}

type BurstProps = {
    id: number;
    onComplete: (id: number) => void;
};

function ConfettiBurst({ id, onComplete }: BurstProps) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onComplete(id);
        }, RISE_DURATION + FALL_DURATION + 300);

        return () => clearTimeout(timeout);
    });

    type PieceData = {
        id: number;
        side: "left" | "right";
        delay: number;
        color: string;
    };

    const pieces = useMemo<PieceData[]>(() => {
        return Array.from({
            length: PIECES_PER_SIDE * 2,
        }).map((_, index) => ({
            id: index,
            side: index % 2 === 0 ? "left" : "right",
            delay: random(0, 80),
            color:
                CONFETTI_COLORS[
                    Math.floor(
                        Math.random() * CONFETTI_COLORS.length
                    )
                    ],
        }));
    }, []);

    return (
        <View
            pointerEvents="none"
            style={[
                StyleSheet.absoluteFill,
                {
                    zIndex: 9999,
                    elevation: 9999,
                },
            ]}
        >
            {pieces.map((piece) => (
                <ConfettiPiece
                    key={`${id}-${piece.id}`}
                    side={piece.side}
                    delay={piece.delay}
                    color={piece.color}
                />
            ))}
        </View>
    );
}

const ConfettiController = forwardRef<ConfettiControllerRef>(
    function ConfettiController(_, ref){
        const [bursts, setBursts] = useState<Burst[]>([]);

        const triggerConfetti = () => {
            const id = Date.now() + Math.random();

            setBursts((prev) => [
                ...prev,
                { id },
            ]);
        };

        const removeBurst = (id: number) => {
            setBursts((prev) =>
                prev.filter((b) => b.id !== id)
            );
        };

        useImperativeHandle(ref, () => ({
            triggerConfetti,
        }));

        return (
            <>
                {bursts.map((burst) => (
                    <ConfettiBurst
                        key={burst.id}
                        id={burst.id}
                        onComplete={removeBurst}
                    />
                ))}
            </>
        );
    }
);

export default ConfettiController;

const styles = StyleSheet.create({
    confetti: {
        position: "absolute",
        width: 8,
        height: 14,
        borderRadius: 2,
        zIndex: 9999,
        elevation: 9999,
    },
});