import * as _ from 'lodash';
import { Expo, ExpoPushErrorReceipt, ExpoPushMessage, ExpoPushReceipt, ExpoPushReceiptId, ExpoPushSuccessReceipt, ExpoPushSuccessTicket, ExpoPushTicket } from 'expo-server-sdk';
import logger from '../config/winston';

const expo = new Expo();

export type ExpoGiPushMessage = ExpoPushMessage;
export async function sendPushNotifications(message: Partial<ExpoPushMessage>, somePushTokens: string[]): Promise<ExpoPushReceipt[]> {
  if (somePushTokens.every(pushToken => Expo.isExpoPushToken(pushToken))) {
    throw new Error('There are invalid tokens');
  }
  const messages: ExpoPushMessage[] = somePushTokens.map(pushToken => ({
    ...message,
    to: pushToken,
  }));

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      logger.debug(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      logger.error(error);
    }
  }

  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.
  const receiptIds = (tickets as ExpoPushSuccessTicket[])
    .filter(ticket => ticket.id)
    .map(ticket => ticket.id);

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  const allReceipts: ExpoPushReceipt[] = []
  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      logger.debug(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      const receiptValues = _.values(receipts);
      allReceipts.push(...receiptValues);
      for (const receipt of receiptValues) {
        const { status } = receipt as ExpoPushSuccessReceipt;
        const { message, details } = receipt as ExpoPushErrorReceipt;
        if (status === 'ok') {
          continue;
        } else if (status === 'error') {
          logger.error(
            `There was an error sending a notification: ${message}`
          );
          const detailsError = (details as { error: string })?.error;
          if (detailsError) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            logger.error(`The error code is ${detailsError}`);
          }
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }
  return allReceipts;
}
