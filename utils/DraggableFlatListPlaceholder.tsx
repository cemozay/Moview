// Temporary placeholder for react-native-draggable-flatlist until we can use a development build
import React from "react";
import { FlatList } from "react-native";

// Simple wrapper that doesn't provide drag functionality but prevents crashes
export default function DraggableFlatList(props: any) {
  const { data, renderItem, keyExtractor, onDragEnd, ...otherProps } = props;

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => {
        // Wrap the render item to provide the expected interface
        const drag = () => {}; // No-op function
        const isActive = false;

        return renderItem({
          item,
          index,
          drag,
          isActive,
          getIndex: () => index,
        });
      }}
      keyExtractor={keyExtractor}
      {...otherProps}
    />
  );
}

// Export other components as no-ops
export const ScaleDecorator = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const ShadowDecorator = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;
export const OpacityDecorator = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;

export type RenderItemParams<T> = {
  item: T;
  index: number;
  drag: () => void;
  isActive: boolean;
  getIndex: () => number;
};
