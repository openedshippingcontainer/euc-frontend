import moment from "moment";

// TODO: Remove this once server side is fixed
export const FillFakeUser = (
  array: unknown,
  member_name = "user"
): void => {
  // Populate single object
  if (!Array.isArray(array)) {
    const object = array as Record<string, unknown>;
    if (object[member_name])
      return;

    object[member_name] = {
      id: -1,
      avatar: null,
      clazz: 0,
      className: "Arhiva",
      username: "Arhiva"
    };

    return;
  }

  // Populate array
  for (let i = 0; i < array.length; ++i)
    FillFakeUser(array[i], member_name);
}

export const GetFormattedDate = (input_time: moment.MomentInput): string => {
  const time = moment(input_time);
  return (
    `${time.format("dddd, Do MMMM YYYY")} (${time.fromNow()})`
  );
}

export const GetFormattedTime = (input_time: moment.MomentInput): string => {
  const time = moment(input_time);
  return (
    `${time.fromNow()} (${time.format("LLLL")})`
  );
}