"use client";

import {UploadButton} from "~/lib/utils/uploadthing";

export default function Button() {
  return <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {

          // Do something with the response
          console.info("upload completed", res)
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}

        className="ut-button:bg-primary ut-button:text-primary-foreground"
      />
}
