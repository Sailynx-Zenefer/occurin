import { useCallback, useState } from "react";
import { Control, Controller, FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

interface TimePickerOutput {
  hours: number;
  minutes: number;
}

type OptionType = {
  label: string;
  value: number;
  description: string;
};

type RHFLocation = {
  name: string;
  lat: number;
  long: number;
  address: string;
  _option: OptionType;
};

interface RHFormValues {
  eventName: string;
  eventDescription: string;
  eventBeginDate: Date;
  eventFinishDate: Date;
  imgUrl: string;
  inPerson: boolean;
  location: RHFLocation;
  ticketed: boolean;
  ticketPrice: number;
}

interface DateTimePickerProps {
  getValues : UseFormGetValues<RHFormValues>
  setValue : UseFormSetValue<RHFormValues>
  control : Control<RHFormValues, any>
  errors : FieldErrors<RHFormValues>
}

const DateTimePicker = ({getValues, setValue,control,errors} : DateTimePickerProps) => {

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const [visibleBegin, setVisibleBegin] = useState(false);
  const [visibleFinish, setVisibleFinish] = useState(false);

  const onDismissBegin = useCallback(() => {
    setVisibleBegin(false);
  }, [setVisibleBegin]);

  const onDismissFinish = useCallback(() => {
    setVisibleFinish(false);
  }, [setVisibleFinish]);

  const timePickOnConfirm =
    (fieldName: string) =>
    ({ hours, minutes }: TimePickerOutput) => {
      if (fieldName === "eventBeginDate") {
        setVisibleBegin(false);
        const newDate = getValues("eventBeginDate") as Date;
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setValue("eventBeginDate", newDate);
      } else {
        setVisibleFinish(false);
        const newDate = getValues("eventFinishDate") as Date;
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setValue("eventFinishDate", newDate);
      }
    };

  const datePickOnChange =
    (fieldName: keyof RHFormValues) => (newDate: Date | undefined) => {
      if (newDate) {
        const newMonthYear = getValues(fieldName) as Date;
        newMonthYear.setFullYear(newDate.getFullYear());
        newMonthYear.setMonth(newDate.getMonth(), newDate.getDate());
        setValue("eventFinishDate", newDate);
      }
    };

  return (
    <Surface style={styles.datePickers} elevation={1}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <>
            <Surface elevation={2}>
              <Text>Event Start:</Text>
              <Button
                onPress={() => setVisibleBegin(true)}
                uppercase={false}
                mode="outlined"
              >
                {formatTime(field.value)}
              </Button>
            </Surface>
            <TimePickerModal
              visible={visibleBegin}
              onDismiss={onDismissBegin}
              onConfirm={timePickOnConfirm("eventBeginDate")}
            />
            <DatePickerInput
              mode="outlined"
              locale="en-GB"
              label=""
              value={field.value}
              onChange={datePickOnChange("eventBeginDate")}
              inputMode="start"
            />
          </>
        )}
        name="eventBeginDate"
      />
      {errors.eventBeginDate && (
        <Text style={styles.errorText}>Please select an event start date.</Text>
      )}

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <View>
            <Text>Event end:</Text>
            <Button
              onPress={() => setVisibleFinish(true)}
              uppercase={false}
              mode="outlined"
            >
              {formatTime(field.value)}
            </Button>
            <TimePickerModal
              visible={visibleFinish}
              onDismiss={onDismissFinish}
              onConfirm={timePickOnConfirm("eventFinishDate")}
            />
            <DatePickerInput
              mode="outlined"
              locale="en-GB"
              label=""
              value={field.value}
              onChange={datePickOnChange("eventFinishDate")}
              inputMode="start"
            />
          </View>
        )}
        name="eventFinishDate"
      />

      {errors.eventFinishDate && (
        <Text style={styles.errorText}>Please select an event start date.</Text>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  datePickers: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius: 2,
    // padding: 5,
  },
  errorText: {
    color: "red",
    marginVertical: 5,
  },
});


export default DateTimePicker;