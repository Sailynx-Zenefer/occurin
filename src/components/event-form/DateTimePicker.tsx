import { useCallback, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Divider, Surface, Text } from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

interface TimePickerOutput {
  hours: number;
  minutes: number;
}

type OptionType = {
  label: string;
  value: number;
  description: string;
  key:string
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
  getValues: UseFormGetValues<RHFormValues>;
  setValue: UseFormSetValue<RHFormValues>;
  control: Control<RHFormValues, any>;
  errors: FieldErrors<RHFormValues>;
}

const DateTimePicker = ({
  getValues,
  setValue,
  control,
  errors,
}: DateTimePickerProps) => {
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
        const newDateBegin = getValues("eventBeginDate") as Date;
        const dateFinish = getValues("eventFinishDate") as Date;
        newDateBegin.setHours(hours);
        newDateBegin.setMinutes(minutes);
        if(newDateBegin > dateFinish){
          setValue("eventFinishDate", newDateBegin)
        }
        setValue("eventBeginDate", newDateBegin);
      } else {
        setVisibleFinish(false);
        const dateBegin = getValues("eventBeginDate") as Date;
        const newDateFinish = getValues("eventFinishDate") as Date;
        newDateFinish.setHours(hours);
        newDateFinish.setMinutes(minutes);
        if(dateBegin > newDateFinish){
          setValue("eventBeginDate", newDateFinish)
        }
        setValue("eventFinishDate", newDateFinish);
      }
    };
    const datePickOnChangeBegin =
    (newDate: Date | undefined) => {
      if (newDate) {
        const newMonthYearBegin = getValues("eventBeginDate") as Date;
        const newMonthYearFinish = getValues("eventFinishDate") as Date;
        if (newMonthYearBegin > newMonthYearFinish){
          newMonthYearFinish.setFullYear(newDate.getFullYear());
          newMonthYearFinish.setMonth(newDate.getMonth(), newDate.getDate());
          setValue("eventFinishDate", newDate);
        }
        newMonthYearBegin.setFullYear(newDate.getFullYear());
        newMonthYearBegin.setMonth(newDate.getMonth(), newDate.getDate());
        setValue("eventBeginDate", newDate);
      }
    };

    const datePickOnChangeFinish =
    (newDate: Date | undefined) => {
      if (newDate) {
        const newMonthYearBegin = getValues("eventBeginDate") as Date;
        const newMonthYearFinish = getValues("eventFinishDate") as Date;
        if (newMonthYearBegin >= newMonthYearFinish){
          newMonthYearBegin.setFullYear(newDate.getFullYear());
          newMonthYearBegin.setMonth(newDate.getMonth(), newDate.getDate());
          setValue("eventBeginDate", newDate);
        }
        newMonthYearFinish.setFullYear(newDate.getFullYear());
        newMonthYearFinish.setMonth(newDate.getMonth(), newDate.getDate());
        setValue("eventFinishDate", newDate);
      }
    };


  return (
    <Surface style={styles.datePickers} elevation={3}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <>
            <View style={styles.labelButton}>
              <Text style={styles.inputLabel}>Event Start:</Text>
              <Button
                style={styles.buttonStyle}
                onPress={() => setVisibleBegin(true)}
                uppercase={false}
                mode="outlined"
              >
                {formatTime(field.value)}
              </Button>
            </View>
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
              onChange={(newDate)=>{
                field.onChange(newDate)
                datePickOnChangeBegin(newDate)
              }}
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
          <>
          <View style={styles.labelButton}>
            <Text style={styles.inputLabel}>Event end:</Text>
            <Button
              style={styles.buttonStyle}
              onPress={() => setVisibleFinish(true)}
              uppercase={false}
              mode="outlined"
            >
              {formatTime(field.value)}
            </Button>
            </View>
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
              onChange={(newDate)=>{
                field.onChange(newDate)
                datePickOnChangeFinish(newDate)
              }}
              inputMode="start"
            />
          </>
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
  inputLabel: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  buttonStyle: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  labelButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  datePickers: {
    margin: 5,
    padding: 20,
    borderRadius: 10,
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    marginVertical: 5,
    marginHorizontal: "auto",
  },
});

export default DateTimePicker;
