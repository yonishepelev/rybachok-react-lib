import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { DatePicker } from "./DatePicker";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Rybachok/DatePicker",
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DatePicker> = (args) => (
  <DatePicker {...args} />
);

export const datePicker = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
datePicker.args = {
  date: new Date(),
  setDate: function (newDate) {
    console.log("Это колбек сториз", newDate.toString());
  },
};
