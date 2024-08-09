import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Divider, SegmentedButtons, Surface, Text} from "react-native-paper";
import NativePaperMapboxSearch from "./NativePaperMapboxSearch";

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

interface LocationPickerProps {
  control: Control<RHFormValues, any>;
  errors: FieldErrors<RHFormValues>;
  setValue : UseFormSetValue<RHFormValues>
}

const LocationPicker = ({ control, errors, setValue}: LocationPickerProps) => {
  const mapBoxToken = process.env.EXPO_PUBLIC_MAPBOX_OCCURIN_TOKEN;
  return (
    <>
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
          <Surface>
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
          </Surface>
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
  datePickers: {
    margin:10,
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderRadius: 2,
    // padding: 5,
  },
  errorText: {
    margin:10,
    color: "red",
    marginVertical: 5,
  },
});

export default LocationPicker;
