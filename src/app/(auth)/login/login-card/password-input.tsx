"use client";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/shadcn/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ComponentProps, useState } from "react";

interface Props extends ComponentProps<typeof InputGroupInput> {
  name?: string;
}

export default function PasswordInput({ name, ...props }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <InputGroupInput
        name={name ?? undefined}
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        {...props}
      />
      <InputGroupAddon align={"inline-end"}>
        <InputGroupButton className={"cursor-pointer"} onClick={() => setShowPassword((prev) => !prev)} tabIndex={-1}>
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
