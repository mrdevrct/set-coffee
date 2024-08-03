const { cookies } = require("next/headers");
const { verifyAccessToken } = require("./auth");
import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import BanModel from "@/models/Ban";
import { roles } from "./constans";

const authUser = async () => {
  connectToDB();
  const token = cookies().get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload.email });

      if (user) {
        const isBanned = await BanModel.findOne({
          $or: [{ email: user.email }, { phone: user.phone }],
        });

        if (isBanned) {
          return null;
        }
      }
    }
  }

  return user;
};

const authAdmin = async () => {
  connectToDB();
  const token = cookies().get("token");
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token.value);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload.email });

      if (user) {
        const isBanned = await BanModel.findOne({
          $or: [{ email: user.email }, { phone: user.phone }],
        });

        if (isBanned) {
          return null;
        } else {
          if (user.role === "ADMIN") {
            return user;
          } else {
            return null;
          }
        }
      } else {
        return null;
      }
    }
  } else {
    return null;
  }

  return user;
};

export { authUser, authAdmin };
