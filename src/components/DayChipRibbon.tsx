import { Colors } from "@/constants/colors";
import { BlurView } from "expo-blur";
import { StyleSheet, useColorScheme } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

interface DayChipProps {
  day: string;
}

const DayChip = ({ day }: DayChipProps) => {
  const theme = useTheme()
  const styles = StyleSheet.create({
    chip: {
      backgroundColor: `${dayColors[day]}`,
      padding: "auto",
      margin: 3,
      width: "13%",
      alignItems: "stretch",
    },
    text: {
      color:theme.colors.onPrimary,
      alignItems: "stretch",
      padding: "auto",
      margin: "auto",
    },
  });

  return (
    <Chip style={styles.chip}>
      <Text style={styles.text}>{day}</Text>
    </Chip>
  );
};

const DayChipRibbon = () => {
  const colorScheme = useColorScheme();
  const tint =
    colorScheme === "dark" ? "systemMaterialDark" : "systemMaterialLight";

  return (

      <BlurView style={styles.blurStyle} intensity={38} tint={tint}>
        <DayChip day={"Mon"} />
        <DayChip day={"Tue"} />
        <DayChip day={"Wed"} />
        <DayChip day={"Thu"} />
        <DayChip day={"Fri"} />
        <DayChip day={"Sat"} />
        <DayChip day={"Sun"} />
      </BlurView>
  );
};

const dayColors = {
  Mon: Colors.dark.red,
  Tue: Colors.dark.orange,
  Wed: Colors.dark.yellow,
  Thu: Colors.dark.green,
  Fri: Colors.dark.blue,
  Sat: Colors.dark.indigo,
  Sun: Colors.dark.violet,
};

const dayTextColors = {
  mon: "red",
  tue: "orange",
  wed: "yellow",
  thu: "green",
  fri: "blue",
  sat: "indigo",
  sun: "violet",
};

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 5,
    marginHorizontal: 2,
    fontSize: 12,
    marginBottom: 5,
  },
  blurStyle: {
    zIndex: 100,
    margin: 0,
    position: "absolute",
    left: 0,
    right: 0,
    paddingVertical: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default DayChipRibbon;
