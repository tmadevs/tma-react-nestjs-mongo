import React, { ComponentType, forwardRef, useCallback } from "react";
import {
  ImpactHapticFeedbackStyle,
  useHapticFeedback,
} from "@telegram-apps/sdk-react";

interface WithHapticFeedbackProps {
  onClick?: (event: React.MouseEvent<any, MouseEvent>) => void;
}

const withHapticFeedback = <P extends object>(
  WrappedComponent: ComponentType<P>,
  intensity: ImpactHapticFeedbackStyle
) => {
  const ComponentWithHapticFeedback = forwardRef<
    any,
    P & WithHapticFeedbackProps
  >((props, ref) => {
    const haptic = useHapticFeedback();

    const handleClick = useCallback(
      (event: React.MouseEvent<any, MouseEvent>) => {
        haptic.impactOccurred(intensity);
        if (props.onClick) {
          props.onClick(event);
        }
      },
      [props.onClick]
    );

    return (
      <WrappedComponent ref={ref} {...(props as P)} onClick={handleClick} />
    );
  });

  return ComponentWithHapticFeedback;
};

export default withHapticFeedback;
