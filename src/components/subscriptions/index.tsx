import { constants } from "@/commons/constants";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  PurchaseError,
  requestSubscription,
  useIAP,
  withIAPContext,
} from "react-native-iap";

const Subscriptions = () => {
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    finishTransaction,
  } = useIAP();
  const [ownedSubscriptions, setOwnedSubscriptions] = useState<string[]>([]);
  const handleGetSubscriptions = async () => {
    try {
      await getSubscriptions({ skus: constants.subscriptionSkus });
    } catch (error) {
      errorLog({ message: "handleGetSubscriptions", error });
    }
  };

  const handleBuySubscription = async (
    productId: string,
    offerToken?: string
  ) => {
    if (!offerToken) {
      console.warn(
        `There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${productId}`
      );
    }
    try {
      await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: productId, offerToken }],
        }),
      });
    } catch (error) {
      if (error instanceof PurchaseError) {
        errorLog({ message: `[${error.code}]: ${error.message}`, error });
      } else {
        errorLog({ message: "handleBuySubscription", error });
      }
    }
  };

  useEffect(() => {
    const checkCurrentPurchase = async () => {
      try {
        if (currentPurchase?.productId) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: true,
          });

          setOwnedSubscriptions((prev) => [
            ...prev,
            currentPurchase?.productId,
          ]);
        }
      } catch (error) {
        if (error instanceof PurchaseError) {
          errorLog({ message: `[${error.code}]: ${error.message}`, error });
        } else {
          errorLog({ message: "handleBuyProduct", error });
        }
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction]);
useEffect(()=>{
    console.log({subscriptions});
},[subscriptions]);
  return (
    <View>
      <View style={styles.container}>
        <Text>{JSON.stringify(subscriptions)}</Text>
      </View>

      <Button title="Get the subscriptions" onPress={handleGetSubscriptions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});

function errorLog(arg0: { message: string; error: unknown }) {
  console.log(arg0);
}
export default withIAPContext(Subscriptions);
