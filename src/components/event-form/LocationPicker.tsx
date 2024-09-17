import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { StyleSheet, View } from "react-native";
import {
  Divider,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import NativePaperMapboxSearch from "./NativePaperMapboxSearch";

type OptionType = {
  label: string;
  value: number;
  description: string;
  key: string;
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

interface LocationPickerProps {
  control: Control<RHFormValues, any>;
  errors: FieldErrors<RHFormValues>;
  setValue: UseFormSetValue<RHFormValues>;
}

const LocationPicker = ({ control, errors, setValue }: LocationPickerProps) => {
  // const mapBoxToken = process.env.EXPO_PUBLIC_MAPBOX_OCCURIN_TOKEN;
  const mapBoxToken = null; //enable this to stop mapbox
  const theme = useTheme()
  return (
    <>
      <Controller
        control={control}
        rules={{ maxLength: 100 }}
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={[styles.inputLabel,{marginVertical:10}]}>Does your event take place in person or is it online?</Text>
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
      <Divider style={{marginTop:20}}/>
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
          <View >
            <Text style={[styles.inputLabel,{marginVertical:10}]}>Where does your event take place?</Text>

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
                      console.error("setValue location._option.label error:", error);
                    }
                  }
                }}
                onRetrieveSBRR={({
                  features : featArray,
                }) => {
                  
                  if (featArray.length > 0) {
                    const features = featArray[0]
                    console.log(features)
                    try {
                      if (features.properties.name_preferred)
                        setValue("location.name", `${JSON.stringify(features.properties.name_preferred)}`);
                      if (features.properties.full_address)
                        setValue("location.address", `${JSON.stringify(features.properties.place_formatted)}`);
                      if (features.properties.coordinates)
                        setValue("location.long", features.properties.coordinates[0] || 0);
                        setValue("location.lat", features.properties.coordinates[1] || 0);
                    } catch (error) {
                      console.error("setValue error:", error);
                    }
                  }
                }}
                optionTextValue={_option}
                placeholder={"Search for locations"}
              />
            ) : (
              <Surface elevation={3} style={styles.manualInput}>
                <Text style={{
                  flexDirection:"row",
                  padding:5,
                  alignItems:"flex-start",
                  justifyContent:"flex-start",
                  textAlign:"justify",
                  color:theme.colors.error,
                  borderWidth:1,
                  borderColor:theme.colors.error}}>
                  {`Mapbox Search is disabled in this version for stability purposes.\n`}
                  {`Please enter location manually:`}
                </Text>
                <View>
                  <Text style={styles.inputLabel}>Location Name:</Text>
                  <TextInput onChange={(name)=>{
                    setValue("location.name", `${name}`);
                  }}/>
                </View>
                <View>
                  <Text>Location Address:</Text>
                  <TextInput onChange={(address)=>{
                    setValue("location.address", `${address}`);
                  }}/>
                </View>
                <View>
                  <Text>Location Longitude:</Text>
                  <TextInput onChange={(long)=>{
                    setValue("location.long", +`${long}`);
                  }}/>
                </View>
                <View>
                  <Text>Location Latitude:</Text>
                  <TextInput onChange={(lat)=>{
                    setValue("location.lat", +`${lat}`);
                  }}/>
                </View>
              </Surface>
            )}
          </View>
        )}
        name="location"
      />
      {errors.location && (
        <Text style={styles.errorText}>Please select a location?</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputLabel:{
    margin:5
  },
  manualInput:{
    padding :10,
    marginBottom:20,
  },
  datePickers: {
    margin: 10,
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius: 2,
    // padding: 5,
  },
  errorText: {
    margin: 10,
    color: "red",
    marginVertical: 5,
  },
});

export default LocationPicker;
