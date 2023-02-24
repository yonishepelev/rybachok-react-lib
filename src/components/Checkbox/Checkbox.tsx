import React, { ChangeEvent } from "react";
import css from "./Checkbox.module.css";
export interface CheckboxProps {
  initialValue: boolean;
  onChange?: (event: ChangeEvent<Element>, newValue: boolean) => void;
  label: string | React.ReactElement | undefined;
}

export const Checkbox = (props: CheckboxProps) => {
  const { initialValue, onChange, label } = props;

  return (
    <label className={css.container}>
      <input
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
