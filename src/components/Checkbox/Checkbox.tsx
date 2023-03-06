import React, { ChangeEvent } from "react";
import css from "./Checkbox.module.css";
export interface CheckboxProps {
  initialValue: boolean;
  onChange?: (event: ChangeEvent<Element>, newValue: boolean) => void;
  label: string | React.ReactElement | undefined;
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
        onChange={(event) => {
          if (typeof onChange === "function")
            onChange(event, event.target.checked);
        }}
        type="checkbox"
      />
      <span className={css.checkmark}></span>
      {label && <span className={css.labelSpan}>{label}</span>}
    </label>
  );
};
