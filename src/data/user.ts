import db from "@/lib/db";

export async function getUserByEmail(email: string) {
  // TODO: handle case sensitivity for emails and usernames
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string | undefined) {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        name: username,
      },
    });
    return user;
  } catch {
    return null;
  }
}
