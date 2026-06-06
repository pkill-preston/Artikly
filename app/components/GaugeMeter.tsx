import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GaugeProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
    label?: string;
    colors?: {
        track?: string;
        gradient?: {
            start: string;
            end: string;
        };
    };
}

export function GaugeMeter({
                               value,
                               max = 100,
                               size = 200,
                               strokeWidth = 12,
                               showLabel = true,
                               label = '%',
                               colors = {
                                   track: '#e0e0e0',
                                   gradient: {
                                       start: '#ff9a56',
                                       end: '#ff6b35',
                                   },
                               },
                           }: GaugeProps) {
    const progress = useSharedValue(0);

    const clampedValue = Math.min(Math.max(value, 0), max);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    useEffect(() => {
        progress.value = 0;

        progress.value = withTiming(clampedValue, {
            duration: 1200,
        });
    }, [clampedValue]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset:
            circumference -
            (progress.value / max) * circumference,
    }));

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.gaugeContainer,
                    {
                        width: size,
                        height: size,
                    },
                ]}
            >
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <Stop
                                offset="0%"
                                stopColor={colors.gradient!.start}
                            />
                            <Stop
                                offset="100%"
                                stopColor={colors.gradient!.end}
                            />
                        </LinearGradient>
                    </Defs>

                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={colors.track}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    <AnimatedCircle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="url(#gaugeGradient)"
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={circumference}
                        animatedProps={animatedProps}
                        rotation="-90"
                        origin={`${center}, ${center}`}
                    />
                </Svg>

                {showLabel && (
                    <View style={styles.labelContainer}>
                        <Text style={styles.value}>
                            {Math.round(clampedValue)}
                        </Text>
                        <Text style={styles.label}>
                            {label}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gaugeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    labelContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    value: {
        fontSize: 48,
        fontWeight: '700',
        color: '#1a1a1a',
    },

    label: {
        fontSize: 36,
        fontWeight: '600',
        color: '#1a1a1a',
        marginLeft: 2,
    },
});