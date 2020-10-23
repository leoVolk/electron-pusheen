const { ipcRenderer } = require("electron");
var { MailListener } = require("mail-listener5");
const storage = require("electron-json-storage");

var mailListener;
function init() {
  storage.get("emailSettings", function (error, data) {
    if (error) throw error;
    mailListener = new MailListener({
      username: data.email,
      password: data.password,
      host: data.host,
      port: data.port, // imap port
      tls: true,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 5000, // Default by node-imap,
      debug: console.log, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: { rejectUnauthorized: false },
      mailbox: "INBOX", // mailbox to monitor
      searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
      markSeen: true, // all fetched email willbe marked as seen and not fetched next time
      fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
      attachments: false, // download attachments as they are encountered to the project directory
      attachmentOptions: { directory: "attachments/" }, // specify a download directory for attachments
    });
    mailListener.start();

    // start listening

    // stop listening
    //mailListener.stop();

    mailListener.on("server:connected", function () {
      console.log("imapConnected");
    });

    mailListener.on("mailbox", function (mailbox) {
      console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
    });

    mailListener.on("server:disconnected", function () {
      console.log("imapDisconnected");
    });

    mailListener.on("error", function (err) {
      console.log(err);
    });

    mailListener.on("headers", function (headers, seqno) {
      // do something with mail headers
    });

    mailListener.on("body", function (body, seqno) {
      // do something with mail body
    });

    mailListener.on("attachment", function (attachment, path, seqno) {
      // do something with attachment
    });

    mailListener.on("mail", function (mail, seqno) {
      ipcRenderer.send("openMailWindow");
      // do something with the whole email as a single object
    });
  });
}

ipcRenderer.on("updateMailer", function () {
  if (mailListener) {
    mailListener.stop();
    init();
  }else{
    init();
  }
});

init();
