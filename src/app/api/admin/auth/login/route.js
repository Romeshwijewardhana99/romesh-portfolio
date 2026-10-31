import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Valid email address is required."),

  password: z
    .string()
    .min(1, "Password is required."),
});

export async function POST(request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          message: "Invalid login data.",
        },
        {
          status: 400,
        }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const admin = await prisma.adminUser.findUnique({
      where: {
        email,
      },
    });

    if (!admin || !admin.isActive) {
      return Response.json(
        {
          ok: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches = await bcrypt.compare(
      parsed.data.password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      return Response.json(
        {
          ok: false,
          message: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    await prisma.adminUser.update({
      where: {
        id: admin.id,
      },

      data: {
        lastLoginAt: new Date(),
      },
    });

    await createAdminSession(admin);

    return Response.json({
      ok: true,

      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login failed:", error);

    return Response.json(
      {
        ok: false,
        message: "Unable to login.",
      },
      {
        status: 500,
      }
    );
  }
}