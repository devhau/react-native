import { Platform } from "react-native";

import { isAmazon } from "react-native-iap/src/internal";

const productSkus = Platform.select({
  ios: ["xyz.hau.devhau.month5"],

  android: [
    "android.test.purchased",
    "android.test.canceled",
    "android.test.refunded",
    "android.test.item_unavailable",
  ],

  default: [],
}) as string[];

const subscriptionSkus = Platform.select({
  ios: ["xyz.hau.devhau.month5"],
  android: isAmazon
    ? [
        "com.amazon.sample.iap.subscription.mymagazine.month",
        "com.amazon.sample.iap.subscription.mymagazine.quarter",
      ]
    : ["test.sub1"],
  default: [],
}) as string[];
const amazonBaseSku = "com.amazon.sample.iap.subscription.mymagazine";
export const constants = {
  productSkus,
  subscriptionSkus,
  amazonBaseSku,
};
