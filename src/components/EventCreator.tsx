import { View, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, Surface, Text, TextInput, Divider } from "react-native-paper";
import {
  DatePickerInput,
  TimePickerModal,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
import React from "react";
registerTranslation("en-GB", enGB);

type FormValues = {
  eventName: string;
  eventDescription: string;
  eventBeginDate: Date;
  eventFinishDate: Date;
};

interface TimePickerOutput {
  hours: number;
  minutes: number;
}

export default function EventCreator() {
  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const [visibleBegin, setVisibleBegin] = React.useState(false);
  const [visibleFinish, setVisibleFinish] = React.useState(false);

  const onDismissBegin = React.useCallback(() => {
    setVisibleBegin(false);
  }, [setVisibleBegin]);

  const onDismissFinish = React.useCallback(() => {
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
    (fieldName: keyof FormValues) => (newDate: Date | undefined) => {
      if (newDate) {
        const newMonthYear = getValues(fieldName) as Date;
        newMonthYear.setFullYear(newDate.getFullYear());
        newMonthYear.setMonth(newDate.getMonth(), newDate.getDate());
        setValue("eventFinishDate", newDate);
      }
    };

  React.useEffect(() => {
    console.log(getValues("eventBeginDate").toISOString());
    console.log(getValues("eventFinishDate").toISOString());
    console.log(
      getValues(),
      "begin-->",
      formatTime(getValues("eventBeginDate")),
      "finish-->",
      formatTime(getValues("eventFinishDate"))
    );
  }, []);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    setValue,
    getValues,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventBeginDate: new Date(),
      eventFinishDate: new Date(),
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted", data);
    Alert.alert("Form Submitted", JSON.stringify(data));
  };

  // React.useEffect(() => {
  //     const subscription = watch((value) => {
  //         console.log(value);
  //     });
  //     return () => subscription.unsubscribe();
  // }, [watch]);

  // const watchForm = watch();
  return (
    <View style={styles.eventCreator}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Give your event a name..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="eventName"
      />
      {errors.eventName && (
        <Text style={styles.errorText}>This is required.</Text>
      )}

      <Controller
        control={control}
        rules={{ maxLength: 100 }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder="Give your event a description..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="eventDescription"
      />
      <Divider/>
      <Surface style={styles.datePickers}
      elevation={1}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <View>
              <Surface  elevation={2}>
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
            </View>
          )}
          name="eventBeginDate"
        />
        {errors.eventBeginDate && (
          <Text style={styles.errorText}>
            Please select an event start date.
          </Text>
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
          <Text style={styles.errorText}>
            Please select an event start date.
          </Text>
        )}
      </Surface>

      <Button
        uppercase={false}
        mode="outlined"
        onPress={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCreator: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-around",
    // backgroundColor: "lightgrey",
    // borderStyle: "solid",
    // borderColor: "blue",
    // borderWidth: 5,
    padding: 10,
    paddingLeft: 30,
  },
  datePickers: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius:2,
    // padding: 5,
  },
  textInput: {
    // backgroundColor: "white",
    // borderStyle: "solid",
    // borderColor: "grey",
    // borderWidth: 1,
    // padding: 10,
    // marginVertical: 5,
  },
  errorText: {
    color: "red",
    marginVertical: 5,
  },
});
