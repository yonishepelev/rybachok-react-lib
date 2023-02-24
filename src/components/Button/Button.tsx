import React, { Component, MouseEvent } from "react";
import css from "./button.module.css";
export type ColorSchemeType = "bondi" | "orange" | "gray";
export type ButtonType = "cross" | "doubleCross" | "hellip";

export interface ButtonProps {
  label?: string;
  colorScheme: ColorSchemeType;
  type?: ButtonType;
  name?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>, btnName?: string) => void;
}

export const Button = (props: ButtonProps) => {
  const { label, colorScheme, type, name, onClick } = props;
  let labelContent: string | React.ReactNode;
  const classes = [];
  classes.push(css.btn, css[colorScheme]);
  if (type === "cross") {
    classes.push(css.times);
    labelContent = "";
  } else if (type === "hellip") {
    classes.push(css.hellip);
    labelContent = "";
  } else if (type === "doubleCross") {
    classes.push(css.doubleCross);
    labelContent = "";
  } else {
    labelContent = label;
  }

  return (
    <button
      name={name}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (typeof onClick === "function") {
          onClick(event, name);
        }
      }}
      className={classes.join(" ")}
    >
      {labelContent}
    </button>
  );
};
