import { getCloudinary } from "@/lib/cloudinary";
import { getCurrentAdmin } from "@/lib/auth/admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function uploadBuffer(buffer) {
  return new Promise(
    (resolve, reject) => {
      const stream =
        getCloudinary().uploader.upload_stream(
          {
            folder:
              "romesh-portfolio/profile",

            resource_type: "image",

            unique_filename: true,

            overwrite: false,

            transformation: [
              {
                width: 1200,
                height: 1200,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },

          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

      stream.end(buffer);
    }
  );
}

export async function POST(request) {
  const admin =
    await getCurrentAdmin();

  if (!admin) {
    return Response.json(
      {
        ok: false,
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          ok: false,
          message:
            "Image is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      return Response.json(
        {
          ok: false,
          message:
            "Only JPG, PNG, WebP and AVIF are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return Response.json(
        {
          ok: false,
          message:
            "Image must be smaller than 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const result =
      await uploadBuffer(buffer);

    return Response.json({
      ok: true,

      image: {
        url: result.secure_url,
        publicId:
          result.public_id,
      },
    });
  } catch (error) {
    console.error(
      "Profile image upload failed:",
      error
    );

    return Response.json(
      {
        ok: false,
        message:
          "Unable to upload image.",
      },
      {
        status: 500,
      }
    );
  }
}