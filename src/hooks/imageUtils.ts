import { supabaseClient } from "@/config/supabase-client";
import * as ImagePicker from "expo-image-picker";

export async function downloadImage(
  path: string | null,
  setImgUrl: React.Dispatch<React.SetStateAction<string>>,
  sbBucket: string,
) {
  try {
    const { data, error } = await supabaseClient.storage
      .from(sbBucket)
      .download(path);
    if (error) {
      throw error;
    }
    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      setImgUrl(fr.result as string);
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
) {
  try {
    setUploading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
      allowsMultipleSelection: false, // Can only select one image
      allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
      quality: 1,
      exif: false, // We don't want nor need that data.
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }

    const image = result.assets[0];

    if (!image.uri) {
      throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
    }
    const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());

    const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${Date.now()}.${fileExt}`;
    const { data, error: uploadError } = await supabaseClient.storage
      .from(sbBucket)
      .upload(path, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });

    if (uploadError) {
      throw uploadError;
    }

    onUpload(data.path);
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
