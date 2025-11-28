import React, { useEffect } from "react";
import { Dimensions, Modal, Pressable, View, ViewStyle, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  containerStyle?: ViewStyle;
  disableClose?: boolean;
  isModal?: boolean;
  minHeight?: number;
  maxHeight?: number;
  handleBarColor?: string;
  handleBarColorActive?: string;
  onHeightChange?: (height: number) => void;
  topView?: React.ReactNode;
  backgroundColor?: string;
  borderRadius?: number;
  backdropColor?: string;
  showBackdrop?: boolean;
}

const defaultStyles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#CCCCCC",
  },
  mb10: {
    marginBottom: 10,
  },
});

export const CustomBottomSheet = ({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.72,
  containerStyle,
  disableClose = false,
  isModal = true,
  minHeight = 0,
  maxHeight = SCREEN_HEIGHT * 0.8,
  handleBarColor,
  handleBarColorActive,
  onHeightChange,
  topView,
  backgroundColor = "#FFFFFF",
  borderRadius = 20,
  backdropColor = "rgba(0, 0, 0, 0.5)",
  showBackdrop = true,
}: CustomBottomSheetProps) => {
  const animatedHeight = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Update the visibility when `visible` changes
  useEffect(() => {
    if (visible) {
      animatedHeight.value = withSpring(height, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      animatedHeight.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [visible, height]);

  // Use derived value to watch height changes and call onHeightChange
  useDerivedValue(() => {
    if (onHeightChange) {
      runOnJS(onHeightChange)(animatedHeight.value);
    }
  });

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startHeight: number }
  >({
    onStart: (_, ctx) => {
      ctx.startHeight = animatedHeight.value;
      isDragging.value = true;
    },
    onActive: (event, ctx) => {
      if (disableClose) return;

      let newHeight = ctx.startHeight - event.translationY;
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      animatedHeight.value = newHeight;
    },
    onEnd: () => {
      isDragging.value = false;
      if (disableClose) {
        animatedHeight.value = withSpring(height, {
          damping: 15,
          stiffness: 100,
        });
        return;
      }

      if (animatedHeight.value >= maxHeight) {
        animatedHeight.value = withSpring(maxHeight, {
          damping: 15,
          stiffness: 100,
        });
      } else if (animatedHeight.value <= minHeight) {
        animatedHeight.value = withSpring(minHeight, {
          damping: 15,
          stiffness: 100,
        });
      } else if (animatedHeight.value < height - 80) {
        animatedHeight.value = withTiming(
          0,
          {
            duration: 300,
            easing: Easing.out(Easing.quad),
          },
          (finished) => {
            if (finished) {
              runOnJS(onClose)();
            }
          }
        );
      } else {
        animatedHeight.value = withSpring(height, {
          damping: 15,
          stiffness: 100,
        });
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const handleBarStyle = useAnimatedStyle(() => ({
    backgroundColor: isDragging.value
      ? handleBarColorActive || handleBarColor || "#666666"
      : handleBarColor || "#CCCCCC",
    transform: [{ scale: isDragging.value ? 1.1 : 1 }],
  }));

  const handleBackdropPress = () => {
    if (!disableClose) {
      animatedHeight.value = withTiming(
        0,
        {
          duration: 300,
          easing: Easing.out(Easing.quad),
        },
        (finished) => {
          if (finished) {
            runOnJS(onClose)();
          }
        }
      );
    }
  };

  if (isModal) {
    return (
      <Modal visible={visible} transparent animationType="none">
        {showBackdrop && (
          <Pressable
            style={[defaultStyles.backdrop, { backgroundColor: backdropColor }]}
            onPress={handleBackdropPress}
          />
        )}
        <Animated.View
          style={[
            defaultStyles.sheet,
            defaultStyles.sheetContent,
            sheetStyle,
            {
              backgroundColor,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            },
            containerStyle,
          ]}
        >
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View>
              <Animated.View
                style={[
                  defaultStyles.handleBar,
                  !disableClose && handleBarStyle,
                ]}
              />
            </Animated.View>
          </PanGestureHandler>

          {children}
        </Animated.View>
      </Modal>
    );
  } else {
    return (
      <Animated.View
        style={[
          defaultStyles.sheet,
          sheetStyle,
          {
            backgroundColor,
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          },
        ]}
      >
        {topView && topView}
        <View style={defaultStyles.mb10} />
        <View style={[defaultStyles.sheetContent, containerStyle]}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View>
              <Animated.View
                style={[defaultStyles.handleBar, handleBarStyle]}
              />
            </Animated.View>
          </PanGestureHandler>

          {children}
        </View>
      </Animated.View>
    );
  }
};

export default CustomBottomSheet;
