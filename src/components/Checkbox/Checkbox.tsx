import React, { ChangeEvent } from "react";
import css from "./Checkbox.module.css";
export interface CheckboxProps {
  initialValue?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>, newValue: boolean) => void;
  label?: string | React.ReactElement | undefined;
  value?: boolean;
}

export const Checkbox = (props: CheckboxProps) => {
  const { initialValue, onChange, label, value } = props;
  let arg: { checked?: boolean } = {};
  if (typeof value !== "undefined") {
    arg.checked = value;
  }
  return (
    <label className={css.container}>
      <input
        {...arg}
        defaultChecked={initialValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (typeof onChange === "function")
            onChange(event, event.currentTarget.checked);
        }}
        type="checkbox"
      />
      <span className={css.checkmark}></span>
      {label && <span className={css.labelSpan}>{label}</span>}
    </label>
  );
};
