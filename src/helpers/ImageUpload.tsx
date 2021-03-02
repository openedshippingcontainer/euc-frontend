import { toaster } from "baseui/toast";

const IMAGE_HOST_URL = "path-to-your-imghost-ending-with-a-slash/";

export async function UploadImage(
  image: ImagePreviewFile,
  force_state_update: () => void
) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", IMAGE_HOST_URL + "api/v1/images/add", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        image.progress = Math.round((event.loaded / event.total) * 100);
        console.log("progress ", image.progress);
        force_state_update();
      }
    }

    xhr.onload = function () {
      if (this.status === 201) {
        image.uploadUrl = IMAGE_HOST_URL + xhr.response.filename;
        image.isError = false;
        resolve(image.name);
      } else {
        image.uploadUrl = undefined;
        image.isError = true;
        reject();
      }
    }

    xhr.onerror = function () {
      reject();
    }

    const form_data = new FormData();
    form_data.append("image", image);

    xhr.send(form_data);
  });
}

const FallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      toaster.positive("Kopirano!", { autoHideDuration: 5000 });
    } else {
      toaster.negative("Greška pri kopiranju!", { autoHideDuration: 5000 });
    }
  } catch (err) {
    toaster.negative("Greška pri kopiranju!", { autoHideDuration: 5000 });
  }

  document.body.removeChild(textArea);
}

export const CopyTextToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    FallbackCopyTextToClipboard(text);
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      toaster.positive("Kopirano!", { autoHideDuration: 5000 });
    })
    .catch(() => {
      toaster.negative("Greška pri kopiranju!", { autoHideDuration: 5000 });
    });
}