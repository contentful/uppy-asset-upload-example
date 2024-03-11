import { BasePlugin, type Uppy } from "@uppy/core";
import { createClient } from "contentful-management";

const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
const environmentId = import.meta.env.VITE_ENVIRONMENT_ID as string;
const spaceId = import.meta.env.VITE_SPACE_ID as string;

export class ContentfulUpload extends BasePlugin {
  private readonly client = createClient({
    accessToken,
  });

  constructor(uppy: Uppy) {
    super(uppy);
    this.id = "ContentfulUpload";
    this.type = "uploader";
  }

  async upload(fileIds: string[]) {
    const files = fileIds.map((fileId) => this.uppy.getFile(fileId));
    this.uppy.emit("upload-start", files);

    await Promise.all(
      files.map(async (file) => {
        const space = await this.client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);
        const asset = await environment.createAssetFromFiles({
          fields: {
            title: {
              "en-US": file.name,
            },
            description: {
              "en-US": file.name,
            },
            file: {
              "en-US": {
                contentType: file.type ?? "image/jpeg",
                fileName: file.name,
                file: file.data,
              },
            },
          },
        });

        await asset.processForAllLocales();

        this.uppy.emit("upload-success", file, {
          uploadURL: asset.fields.file["en-US"].url,
        });
      }),
    );
  }

  install() {
    this.uppy.addPreProcessor(this.upload.bind(this));
  }

  uninstall() {
    this.uppy.removePreProcessor(this.upload);
  }
}
