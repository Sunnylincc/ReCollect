"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch@1.1.3";

function Switch(props: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
