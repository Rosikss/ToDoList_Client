import dayjs from "dayjs";

export default function disabledDate(current: dayjs.Dayjs | null) {
  return current
    ? !current.isBetween(
        dayjs().startOf("week"),
        dayjs().endOf("week"),
        "day",
        "[]",
      )
    : false;
}
