import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Surface,
  Text,
  TextInput,
  Divider,
  Card,
} from "react-native-paper";
import type React from "../../node_modules/@types/react";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { useAlerts } from "react-native-paper-alerts";
import { supabaseClient } from "../config/supabase-client";
import { useAuth } from "../hooks/Auth";
import DateTimePicker from "./event-form/DateTimePicker";
import TicketPricePicker from "./event-form/TicketPricePicker";
import LocationPicker from "./event-form/LocationPicker";
import { downloadImage, uploadImage } from "@/hooks/imageUtils";
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

export default function EventCreator() {
  const [loading, setLoading] = useState(true);
  const [imgUploading, setImgUploading] = useState(false);

  const { user } = useAuth();
  const alerts = useAlerts();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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
    alerts.alert("Event Created!");
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
        ticket_price: Number(RHForm.ticketPrice),
        creator_id: user.id,
      };

      let { error } = await supabaseClient.from("events").insert(SBform);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alerts.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (eventImageUrl)
      downloadImage(eventImageUrl, setEventImageUrl, "event_imgs",);
  }, [eventImageUrl]);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card style={styles.eventCreator}>
        <Card.Title title={"Create a new event "} />
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
        <LocationPicker setValue={setValue} control={control} errors={errors} />
        <Divider />
        <TicketPricePicker control={control} errors={errors} />
        <Divider />

        <Divider />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              {eventImageUrl ? (
                <Image
                  source={{ uri: eventImageUrl }}
                  accessibilityLabel={"Event Image Preview"}
                  style={[{ height: 200, width: 200 }, styles.eventImg, styles.image]}
                />
              ) : (
                <View style={[{ height: 200, width: 200 }, styles.eventImg, styles.noImage]} />
              )}
              <View>
                <Button
                  onPress={() =>{
                    uploadImage(setEventImageUrl, setImgUploading, "event_imgs", (path)=>{
                      setValue("imgUrl", path);
                    })
                  }}
                  disabled={imgUploading}
                >
                  {imgUploading ? "Uploading ..." : "Choose an image..."}
                </Button>
              </View>
            </View>
          )}
          name="imgUrl"
        />
        {errors.imgUrl && (
          <Text style={styles.errorText}>{"This is required."}</Text>
        )}

        <DateTimePicker
          getValues={getValues}
          setValue={setValue}
          control={control}
          errors={errors}
        />
        <Divider />
        <Surface style={styles.bottomButtons}>
          <Button
            uppercase={false}
            mode="outlined"
            onPress={handleSubmit(onSubmit)}
          >
          <Text> {loading ? "Create Event" : "Create Event"}</Text> 
          </Button>
          <Text>{loading ? "Creating..." : ""}</Text>
        </Surface>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eventImg: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
    margin:10,
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
    margin:10,
    },
  noImage: {
    margin:10,
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
  bottomButtons: {
    margin:10,
    display: "flex",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    paddingHorizontal: 20,
  },
  scrollView: {
    margin:10,
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
  },
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
    paddingBottom:50,
    marginHorizontal:"auto",
    marginTop:30,
    marginBottom:50,
  },
  textInput: {

    margin:10,
    // backgroundColor: "white",
    // borderStyle: "solid",
    // borderColor: "grey",
    // borderWidth: 1,
    // padding: 10,
    // marginVertical: 5,
  },
  errorText: {
    margin:10,
    color: "red",
    marginVertical: 5,
  },
});
