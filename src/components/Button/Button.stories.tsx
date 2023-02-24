import React, { MouseEvent } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Button, ColorSchemeType } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Rybachok/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;
const onClick = (event: MouseEvent, btnName?: string) => {
  console.log("Клик в сториз", event.target, btnName);
};
export const ButtonBondi = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ButtonBondi.args = {
  colorScheme: "bondi",
  label: "Расчитать",
  name: "bondi-text",
  onClick,
};

export const ButtonCross = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ButtonCross.args = {
  colorScheme: "bondi",
  type: "cross",
  name: "bondi-cross",
  onClick,
};

export const ButtonHellip = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ButtonHellip.args = {
  colorScheme: "bondi",
  type: "hellip",
  name: "bondi-hellip",
  onClick,
};

export const ButtonDoubleCross = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ButtonDoubleCross.args = {
  colorScheme: "bondi",
  type: "doubleCross",
  name: "bondi-dblCross",
  onClick,
};
