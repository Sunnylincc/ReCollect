"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider@1.2.3";
import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        style={{
          position: 'relative',
          height: '0.75rem',
          width: '100%',
          flexGrow: 1,
          overflow: 'hidden',
          borderRadius: '9999px',
          backgroundColor: '#d3e5f1',
        }}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          style={{
            position: 'absolute',
            height: '100%',
            borderRadius: '9999px',
            background: 'linear-gradient(90deg, #003194 0%, #0a46c4 100%)',
          }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          style={{
            display: 'block',
            height: '2rem',
            width: '2rem',
            flexShrink: 0,
            borderRadius: '9999px',
            backgroundColor: '#003194',
            border: '3px solid #ffffff',
            boxShadow: '0 4px 10px rgba(0,49,148,0.3)',
            cursor: 'pointer',
            outline: 'none',
          }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
