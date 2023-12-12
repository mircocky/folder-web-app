// pushNotifications.js
const webPush = require('web-push');

const publicVapidKey = 'BACVDg1IY5L2sGus64krTUOGMIqv3ljPqgzupCaxyhGU2x3b_rNcPPCTOqwxaAazHltJKmvi9eJRKhs_y0DKdjg';
const privateVapidKey = 'Kihg5uhl9ra805cZ6qlWffmqxEueI139ECcOesg7ghE';

webPush.setVapidDetails(
  'mailto:stevekim@pnlglobal.com.au',
  publicVapidKey,
  privateVapidKey
);

module.exports = webPush;
