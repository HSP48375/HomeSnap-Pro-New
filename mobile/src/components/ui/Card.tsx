
import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, glassmorphism, borderRadius, shadows } from '../../theme/AppTheme';

interface CardProps extends ViewProps {
  variant?: 'standard' | 'interactive';
  blurIntensity?: number;
  style?: ViewStyle;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'standard',
  blurIntensity = 70,
  style,
  children,
  ...props
}: CardProps) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'standard':
        return styles.standardCard;
      case 'interactive':
        return styles.interactiveCard;
      default:
        return styles.standardCard;
    }
  };

  return (
    <View style={[styles.container, getCardStyle(), style]} {...props}>
      <BlurView intensity={blurIntensity} tint="dark" style={styles.blurView}>
        <View style={styles.contentContainer}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    margin: 4,
 ...glassmorphism.container, // Apply glassmorphism container styles
  },
  blurView: {
    width: '100%',
    height: '100%',
    ...glassmorphism.blurView, // Apply glassmorphism blur styles
  },
  contentContainer: {
    padding: 16,
    width: '100%',
    height: '100%',
    // No specific glassmorphism styles needed for content container itself
  },
  standardCard: {
  },
  interactiveCard: {
    backgroundColor: glassmorphism.backgroundLight,
    borderWidth: 1,
    borderColor: 'rgba(0, 238, 255, 0.2)',
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default Card;
