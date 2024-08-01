import { useState, useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Button, Surface, Text, TextInput, Divider } from "react-native-paper";
import { SegmentedButtons } from "react-native-paper";
import type React from "../../node_modules/@types/react";
import {
  DatePickerInput,
  TimePickerModal,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
import { useAlerts } from "react-native-paper-alerts";
import { supabaseClient } from "../config/supabase-client";
import { useAuth } from "../hooks/Auth";
import NativePaperMapboxSearch from "./NativePaperMapboxSearch";
registerTranslation("en-GB", enGB);

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

type RHFLocation = {
  name: string;
  lat: number;
  long: number;
  address: string;
  _option: OptionType;
};

type OptionType = {
  label: string;
  value: number;
  description: string;
};
interface FormValues {
  title: string;
  description: string;
  img_url: string;
  in_person: boolean;
  begin_time: string;
  finish_time: string;
  location_name: string;
  location_lat: number;
  location_long: number;
  ticketed: boolean;
  ticket_price: number;
  creator_id: string;
}

interface TimePickerOutput {
  hours: number;
  minutes: number;
}

export default function EventCreator() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const alerts = useAlerts();

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<RHFormValues>({
    mode: "onBlur",
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventBeginDate: new Date(),
      eventFinishDate: new Date(),
      imgUrl: "",
      inPerson: true,
      location: {
        name: "",
        lat: 0,
        long: 0,
        address: "",
        _option: {
          label: "",
          value: 0,
          description: "",
        },
      },
      ticketed: false,
      ticketPrice: 0,
    },
  });

  const onSubmit = async (RHForm: RHFormValues) => {
    alerts.alert("Form completed", JSON.stringify(RHForm));
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");

      const SBform: FormValues = {
        title: RHForm.eventName,
        description: RHForm.eventDescription,
        img_url: RHForm.imgUrl,
        in_person: RHForm.inPerson,
        begin_time: RHForm.eventBeginDate.toISOString(),
        finish_time: RHForm.eventFinishDate.toISOString(),
        location_name: RHForm.location.name,
        location_lat: RHForm.location.lat,
        location_long: RHForm.location.long,
        ticketed: RHForm.ticketed,
        ticket_price: RHForm.ticketPrice,
        creator_id: user.id,
      };

      let { error } = await supabaseClient.from("profiles").insert(SBform);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        alerts.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const mapBoxToken = process.env.EXPO_PUBLIC_MAPBOX_OCCURIN_TOKEN;


  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    )
    return () => subscription.unsubscribe()
  }, [watch])



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
      <Divider />
      <Controller
        control={control}
        rules={{ maxLength: 100 }}
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Does your event take place in person or is it online?</Text>
            <SegmentedButtons
              value={String(value)}
              onValueChange={(newValue) =>
                onChange(newValue === "true" ? true : false)
              }
              buttons={[
                {
                  value: "true",
                  label: "In Person",
                },
                {
                  value: "false",
                  label: "Online",
                },
              ]}
            />
          </>
        )}
        name="inPerson"
      />
      <Divider />
      <Controller
        control={control}
        rules={{ maxLength: 100 }}
        render={({
          field: {
            onChange,
            value: {
              _option,
              _option: { label },
            },
          },
        }) => (
          <View>
            <Text>Where does your event take place?</Text>

            {mapBoxToken ? (
              <NativePaperMapboxSearch
                accessToken={mapBoxToken}
                options={{
                  language: "en",
                  country: "GB",
                }}
                onChangeTextAC={(searchText) => {
                  if (searchText) {
                    try {
                      setValue("location._option.label", searchText);
                    } catch (error) {
                      console.error("setValue error:", error);
                    }
                  }
                }}
                onRetrieveSBRR={({
                  features,
                  features: [name_preferred, place_formatted, coordinates],
                }) => {
                  if (features) {
                    try {
                      if (name_preferred)
                        setValue("location.name", `${name_preferred}`);
                      if (place_formatted)
                        setValue("location.address", `${place_formatted}`);
                      if (coordinates)
                      setValue("location.long", coordinates[0] || 0);
                      setValue("location.lat", coordinates[1] || 0);

                    } catch (error) {
                      console.error("setValue error:", error);
                    }
                  }
                }}
                optionTextValue={_option}
                placeholder={"Search for locations"}
              />
            ) : (
              <Text>Mapbox token not provided</Text>
            )}
          </View>
        )}
        name="location"
      />
      {errors.location && (
        <Text style={styles.errorText}>Please select a location?</Text>
      )}
      <Divider />
      <Controller
        control={control}
        rules={{ maxLength: 100 }}
        render={({ field: { onChange, value } }) => (
          <>
            <Text>Is your event ticketed?</Text>
            <SegmentedButtons
              value={String(value)}
              onValueChange={(newValue) =>
                onChange(newValue === "true" ? true : false)
              }
              buttons={[
                {
                  value: "true",
                  label: "Ticketed",
                },
                {
                  value: "false",
                  label: "Not Ticketed",
                },
              ]}
            />
          </>
        )}
        name="ticketed"
      />
      <Text>Upload an image here</Text>
      <Surface style={styles.datePickers} elevation={1}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <View>
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
    borderRadius: 2,
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
