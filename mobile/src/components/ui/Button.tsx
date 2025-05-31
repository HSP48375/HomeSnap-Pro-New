
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  title,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  className,
  ...props
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'outline' ? '#E93B81' : '#FFFFFF'} />; // Using neon magenta for outline variant
    }

    return (
      <>
        {icon && iconPosition === 'left' && <>{icon}</>}
        <Text style={[getTextStyle(), getTextSizeStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && <>{icon}</>}
      </>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
 className={`rounded-md overflow-hidden ${getSizeClass()} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={[
          styles.button,
          getSizeStyle(),
          fullWidth && styles.fullWidth,
          style,
        ]}
        disabled={loading || props.disabled}
        {...props}
      >
        <LinearGradient
          colors={gradients.button}
 start={{ x: 0, y: 0.5 }} // Adjust gradient start/end for a potentially better look
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBackground, getSizeStyle()]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
 className={`rounded-md overflow-hidden ${getButtonClass()} ${getSizeClass()} ${fullWidth ? 'w-full' : ''} ${
 className
      }`}
 style={[
 styles.button,
 // Styles from getButtonStyle and getSizeStyle will be replaced by Tailwind classes
        style,
      ]}
      disabled={loading || props.disabled}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Helper to get Tailwind classes for button variant
const getButtonClass = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-neon-magenta shadow-neon-magenta hover:shadow-neon-magenta-glow focus:shadow-neon-magenta-glow';
    case 'secondary':
      return 'bg-dark-gray border border-electric-blue';
    case 'outline':
      return 'bg-transparent border border-light-gray text-light-gray';
    default:
      return 'bg-neon-magenta shadow-neon-magenta hover:shadow-neon-magenta-glow focus:shadow-neon-magenta-glow';
  }
};

// Helper to get Tailwind classes for button size
const getSizeClass = (size: ButtonProps['size']) => {
  switch (size) {
    case 'small':
      return 'py-2 px-4 text-sm min-h-[32px]';
    case 'medium':
      return 'py-3 px-6 text-base min-h-[44px]';
    case 'large':
      return 'py-4 px-8 text-lg min-h-[56px]';
    default:
      return 'py-3 px-6 text-base min-h-[44px]';
  }
};

// Helper to get Tailwind classes for text color based on variant
const getTextClass = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'text-white font-semibold';
    case 'secondary':
      return 'text-neon-magenta font-medium';
    case 'outline':
      return 'text-light-gray font-medium';
    default:
      return 'text-white font-semibold';
  }
};

const gradients = {
  button: ['#E93B81', '#FF8A00'], // Neon magenta to vibrant orange gradient
};

// Placeholder for theme colors, replace with actual Tailwind color names if available
const colors = { primary: '#E93B81', foreground: '#A0A0A0' };

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    // Removed fixed width and height, using padding and minHeight from getSizeClass
    // Removed shadow styles, using Tailwind shadow classes
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Keep this for icon and text alignment
  },
});

export default Button;
