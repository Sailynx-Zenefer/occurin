import { supabaseClient } from "@/config/supabase-client";
import * as ImagePicker from "expo-image-picker";

export async function downloadImage(
  path: string | null,
  setImgUri: React.Dispatch<React.SetStateAction<string>>,
  sbBucket: string
): Promise<void | Error> {
  if (!path) {
    return new Error("No path provided");
  }
  try {
    const { data, error } = await supabaseClient.storage
      .from(sbBucket)
      .download(path,);
    if (error) {
      throw error;
    }

    const fr = new FileReader();
    fr.readAsDataURL(data!);
    fr.onload = () => {
      if (fr.result) {
        setImgUri(fr.result as string);
      }
    };
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
  }
}

export async function uploadImage(
  onUpload: (filePath: string) => void,
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  sbBucket: string,
  setForm?: (filePath: string) => void,
) {
  try {
    setUploading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
      allowsMultipleSelection: false, // Can only select one image
      allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
      quality: 1,
    });
    console.log(result);

    if (!result.canceled || result.assets) {
      console.log(result);
      console.log(result.assets[0].uri);
      const fileName = `${Date.now()}.${result.assets[0].mimeType.slice(6)}`;
      const arraybuffer = await fetch(result.assets[0].uri).then((res) =>
        res.arrayBuffer(),
      );
      const { data, error: uploadError } = await supabaseClient.storage
        .from(sbBucket)
        .upload(fileName, arraybuffer, {
          contentType: result.assets[0].mimeType,
        });
      if (uploadError) {
        throw uploadError;
      }
      onUpload(data.path);
      setForm(data.path);
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      // alerts.alert(error.message)
    } else {
      throw error;
    }
  } finally {
    setUploading(false);
  }
}
