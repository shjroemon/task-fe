import moment from "moment";

export const getAntdFormInputRules = [
  {
    required: true,
    message: "Required",
  },
];

export const getDateFormat = (date) => {
  return moment(date).format("MMMM Do YYYY, h:mm A");
};
export const getTimelineFormat = (timeline) => {
  return timeline ? moment(timeline).format("YYYY-MM-DD HH:mm:ss") : "N/A";
};
