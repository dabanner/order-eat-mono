declare module 'react-native-custom-switch-new' {
  import { ComponentType } from 'react';

  interface CustomSwitchProps {
    buttonColor?: string;
    switchBackgroundColor?: string;
    onSwitchBackgroundColor?: string;
    switchLeftText?: string;
    switchRightText?: string;
    onSwitch?: () => void;
    onSwitchReverse?: () => void;
    startOnLeft?: boolean;
    [key: string]: any; // This allows any other props to be passed
  }

  const CustomSwitch: ComponentType<CustomSwitchProps>;
  export default CustomSwitch;
}
