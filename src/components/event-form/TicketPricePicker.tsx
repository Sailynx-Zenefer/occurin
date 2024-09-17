import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { Divider, SegmentedButtons, Text, TextInput } from "react-native-paper";

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

interface TicketPricePickerProps {
  control: Control<RHFormValues, any>;
  errors: FieldErrors<RHFormValues>;
}

const TicketPricePicker = ({ control, errors }: TicketPricePickerProps) => {
  return (
    <>
      <Controller
        control={control}
        rules={{ maxLength: 100 }}
        render={({ field: { onChange, value } }) => (
          <>
            <Divider style={{ marginVertical: 10 }} />
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
      <Divider style={{ marginVertical: 20 }} />
      <Text>Ticket Price</Text>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <>
            {/* <TextInput
          style={styles.textInput}
          onChangeText={(priceText) => {
            console.log(priceText);
            if (priceText.length > 0) {
              const foundNumber = priceText.match(/\d+/g).join("");
              console.log("found", foundNumber);
              if (foundNumber.length > 0) {
                const display = formatNumber(+foundNumber, {
                  separator: "",
                  prefix: "£ ",
                  precision: 2,
                  delimiter: "",
                  signPosition: "beforePrefix",
                });
                console.log("displ", display);
                onChange?.({
                  numerical: onChange?.(parseInt(foundNumber, 100)),
                  display: display,
                });
              }
            }
          }}
          value={display}
        /> */}
            <CurrencyInput
              value={value}
              onChangeValue={onChange}
              renderTextInput={({ onChangeText, value }) => {
                return (
                  <TextInput
                    onChangeText={onChangeText}
                    value={value}
                    placeholder="£ 0.00"
                  />
                );
              }}
              prefix="£ "
              delimiter="."
              separator=","
              precision={2}
            />
          </>
        )}
        name="ticketPrice"
      />
      {errors.ticketPrice && (
        <Text style={styles.errorText}>Please enter a ticket price</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    color: "red",
    marginVertical: 5,
  },
});

export default TicketPricePicker;
