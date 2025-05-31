
import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { colors, glassmorphism, fontSizes, borderRadius, spacing, neonGlow } from '../../theme/AppTheme';

interface TextInputProps extends RNTextInputProps {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[containerStyle, isFocused && styles.glowingBorder]}>
      <View style={[
        styles.container,
        // Remove native styles that will be replaced by Tailwind
        isFocused && styles.containerFocused,
        error && styles.containerError,
      ]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <RNTextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.electricBlue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            // onPress={onRightIconPress} // Use Tailwind classes for onPress
            // disabled={!onRightIconPress} // Use Tailwind classes for disabled
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // Use Tailwind classes for alignment
    alignItems: 'center',
    // Use Tailwind classes for background, border, and padding
    paddingHorizontal: spacing.md,
    height: 50,
  },
  // These styles will be replaced by Tailwind
  containerFocused: {
    borderColor: 'rgba(0, 238, 255, 0.5)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  glowingBorder: {
    borderRadius: borderRadius.md, // Maintain border radius from theme
    ...neonGlow.electricBlue, // Apply the glowing effect
    elevation: 5,
  },
  containerError: {
    borderColor: 'rgba(255, 61, 61, 0.5)',
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    height: '100%',
    paddingVertical: spacing.md,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  rightIconContainer: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});

export default TextInput;
