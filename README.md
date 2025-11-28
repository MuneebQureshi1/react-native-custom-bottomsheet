# react-native-custom-bottomsheet

A customizable bottom sheet component for React Native with smooth animations, gesture handling, and flexible configuration options. Built with `react-native-reanimated` and `react-native-gesture-handler` for optimal performance.

## Installation

```bash
npm install react-native-custom-bottomsheet
```

or

```bash
yarn add react-native-custom-bottomsheet
```

### Required Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

**Important:** After installing `react-native-gesture-handler`, make sure to follow the [setup instructions](https://docs.swmansion.com/react-native-gesture-handler/docs/installation) for your platform.

## Usage

### Basic Example

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { CustomBottomSheet } from 'react-native-custom-bottomsheet';

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Bottom Sheet" onPress={() => setVisible(true)} />
      
      <CustomBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        height={400}
      >
        <View style={{ padding: 20 }}>
          <Text>Your content here</Text>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default App;
```

### Advanced Example with Custom Configuration

```tsx
import React, { useState } from 'react';
import { View, Text, Button, Dimensions } from 'react-native';
import { CustomBottomSheet } from 'react-native-custom-bottomsheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const App = () => {
  const [visible, setVisible] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(0);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open Bottom Sheet" onPress={() => setVisible(true)} />
      
      <CustomBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        height={SCREEN_HEIGHT * 0.72}
        minHeight={200}
        maxHeight={SCREEN_HEIGHT * 0.9}
        disableClose={false}
        isModal={true}
        handleBarColor="#666666"
        handleBarColorActive="#333333"
        backgroundColor="#FFFFFF"
        borderRadius={20}
        backdropColor="rgba(0, 0, 0, 0.5)"
        showBackdrop={true}
        onHeightChange={(height) => setCurrentHeight(height)}
        containerStyle={{ padding: 16 }}
      >
        <View style={{ padding: 20 }}>
          <Text>Current Height: {currentHeight.toFixed(0)}</Text>
          <Text>Your content here</Text>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default App;
```

### Non-Modal Example (Embedded in View)

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { CustomBottomSheet } from 'react-native-custom-bottomsheet';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 200, backgroundColor: '#f0f0f0' }}>
        <Text>Content above bottom sheet</Text>
      </View>
      
      <CustomBottomSheet
        visible={true}
        onClose={() => {}}
        isModal={false}
        height={300}
        topView={<View><Text>Top View Content</Text></View>}
      >
        <View style={{ padding: 20 }}>
          <Text>Bottom sheet content</Text>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | **Required** | Controls the visibility of the bottom sheet |
| `onClose` | `() => void` | **Required** | Callback function called when the sheet is closed |
| `children` | `React.ReactNode` | **Required** | Content to display inside the bottom sheet |
| `height` | `number` | `SCREEN_HEIGHT * 0.72` | Initial height of the bottom sheet in pixels |
| `minHeight` | `number` | `0` | Minimum height the sheet can be dragged to |
| `maxHeight` | `number` | `SCREEN_HEIGHT * 0.8` | Maximum height the sheet can be dragged to |
| `disableClose` | `boolean` | `false` | If `true`, prevents closing the sheet via gestures or backdrop |
| `isModal` | `boolean` | `true` | If `true`, renders as a Modal with backdrop. If `false`, renders inline |
| `containerStyle` | `ViewStyle` | `undefined` | Additional styles for the content container |
| `backgroundColor` | `string` | `'#FFFFFF'` | Background color of the bottom sheet |
| `borderRadius` | `number` | `20` | Border radius for the top corners of the sheet |
| `backdropColor` | `string` | `'rgba(0, 0, 0, 0.5)'` | Color of the backdrop overlay (only when `isModal={true}`) |
| `showBackdrop` | `boolean` | `true` | Whether to show the backdrop overlay (only when `isModal={true}`) |
| `handleBarColor` | `string` | `'#CCCCCC'` | Color of the drag handle bar |
| `handleBarColorActive` | `string` | `handleBarColor` | Color of the drag handle bar when actively dragging |
| `onHeightChange` | `(height: number) => void` | `undefined` | Callback function called when the sheet height changes during drag |
| `topView` | `React.ReactNode` | `undefined` | Custom view to render above the sheet content (only when `isModal={false}`) |

## Features

- ✅ Smooth spring animations using `react-native-reanimated`
- ✅ Gesture-based dragging with `react-native-gesture-handler`
- ✅ Configurable min/max height constraints
- ✅ Optional backdrop with customizable color
- ✅ Modal and non-modal modes
- ✅ Disable close functionality
- ✅ Height change callbacks
- ✅ Customizable handle bar with active state
- ✅ TypeScript support

## License

MIT
