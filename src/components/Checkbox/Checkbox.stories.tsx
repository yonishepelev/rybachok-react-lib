import React, { MouseEvent } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Checkbox } from "./Checkbox";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Rybachok/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);
export const CheckboxDef = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CheckboxDef.args = {
  initialValue: true,
  onChange(event, newValue) {
    console.log(event, newValue);
  },
  label: "adsd",
};
