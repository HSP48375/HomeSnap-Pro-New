
import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, fontSizes } from '../../theme/AppTheme';

interface GradientTextProps extends TextProps {
  text: string;
  gradientType?: 'primary' | 'accent';
  style?: TextStyle;
}

const GradientText: React.FC<GradientTextProps> = ({
  text,
  gradientType = 'primary',
  style,
  ...props
}) => {
  return (
    <MaskedView
      maskElement={
        <Text
          style={[styles.text, style]}
          {...props}
        >
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={gradientType === 'primary' ? gradients.primary : gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          style={[styles.text, style, { opacity: 0 }]}
          {...props}
        >
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
});

export default GradientText;
