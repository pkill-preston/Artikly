import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface NavButtonProps {
    label: string;
    sublabel?: string;
    icon: React.ReactNode;
    iconBgColor?: string;
    onPress?: () => void;
    style?: ViewStyle;
    badge?: number | string;
    showChevron?: boolean;
}

export default function NavigationButton({
                                      label,
                                      sublabel,
                                      icon,
                                      iconBgColor = '#EBF3FF',
                                      onPress,
                                      style,
                                      badge,
                                      showChevron = true,
                                  }: NavButtonProps) {
    const scale = useSharedValue(1);
    const shadowOpacity = useSharedValue(0.1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        shadowOpacity: shadowOpacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        shadowOpacity.value = withTiming(0.04, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
        shadowOpacity.value = withTiming(0.1, { duration: 200 });
    };

    return (
        <AnimatedTouchable
            style={[styles.button, animatedStyle, style]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                {icon}
            </View>

            <View style={styles.labelContainer}>
                <Text style={styles.label} numberOfLines={1}>{label}</Text>
                {sublabel ? (
                    <Text style={styles.sublabel} numberOfLines={1}>{sublabel}</Text>
                ) : null}
            </View>

            <View style={styles.trailingContainer}>
                {badge !== undefined ? (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                ) : null}
                {showChevron ? (
                    <ChevronRight size={18} color="#C0C8D4" strokeWidth={2.5} />
                ) : null}
            </View>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        paddingVertical: 12,
        paddingHorizontal: 12,
        width: '100%',
        maxWidth: 1024,
        gap: 14,
        shadowColor: '#1A2B4A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(220, 228, 240, 0.6)',
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3A7BD5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    labelContainer: {
        flex: 1,
        gap: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A2B3C',
        letterSpacing: -0.2,
    },
    sublabel: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8A97A8',
        letterSpacing: -0.1,
    },
    trailingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badge: {
        backgroundColor: '#3A7BD5',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
});
