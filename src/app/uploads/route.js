import path from "node:path";
import {
  readFile,
} from "node:fs/promises";

import {
  getUploadRoot,
} from "@/lib/uploads";

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

export async function GET(
  request,
  { params }
) {
  try {
    const { path: segments } =
      await params;

    if (
      !Array.isArray(segments) ||
      segments.length === 0
    ) {
      return new Response(
        "Not found",
        {
          status: 404,
        }
      );
    }

    const root =
      getUploadRoot();

    const filePath =
      path.resolve(
        root,
        ...segments
      );

    const allowedRoot =
      root.endsWith(path.sep)
        ? root
        : root + path.sep;

    if (
      filePath !== root &&
      !filePath.startsWith(
        allowedRoot
      )
    ) {
      return new Response(
        "Forbidden",
        {
          status: 403,
        }
      );
    }

    const extension =
      path
        .extname(filePath)
        .toLowerCase();

    const contentType =
      CONTENT_TYPES[extension];

    if (!contentType) {
      return new Response(
        "Unsupported file type",
        {
          status: 415,
        }
      );
    }

    const file =
      await readFile(filePath);

    return new Response(file, {
      headers: {
        "Content-Type":
          contentType,

        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if (
      error.code === "ENOENT"
    ) {
      return new Response(
        "Not found",
        {
          status: 404,
        }
      );
    }

    console.error(
      "Upload file read failed:",
      error
    );

    return new Response(
      "Server error",
      {
        status: 500,
      }
    );
  }
}