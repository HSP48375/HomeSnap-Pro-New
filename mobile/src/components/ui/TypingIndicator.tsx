import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

const TypingIndicatorPremium = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const createDotAnimation = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel([
      createDotAnimation(dot1, 0),
      createDotAnimation(dot2, 200),
      createDotAnimation(dot3, 400),
      glowAnimation,
    ]).start();

    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, [dot1, dot2, dot3, glowAnim]);

  const renderDot = (animatedValue: Animated.Value, key: string) => {
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });

    return (
      <Animated.View
        key={key}
        style={{
          transform: [{ translateY }, { scale }],
        }}
      >
        <View className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-1 shadow-lg" />
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={{ opacity: glowAnim }}
      className="bg-white/90 backdrop-blur-md rounded-full px-5 py-3 shadow-xl"
    >
      <View className="flex-row items-center">
        {renderDot(dot1, 'dot1')}
        {renderDot(dot2, 'dot2')}
        {renderDot(dot3, 'dot3')}
      </View>
    </Animated.View>
  );
};

export default TypingIndicatorPremium;
