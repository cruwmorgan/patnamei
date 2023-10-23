import mongoose from 'mongoose';
const Schema = mongoose.Schema;
mongoose.set("strictQuery", false);
// mongoose.Schema.Types.String.checkRequired(v => v != null);


// const MONGO_USERNAME = 'park';
// const MONGO_PASSWORD = 'apps';
// const DB_HOST = process.env.DB_HOST || 'localhost';
// const DB_PORT = process.env.DB_PORT || 27017;
// const DB_DATABASE = process.env.DB_DATABASE || 'cubex';
// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=admin`;
const url = "mongodb+srv://park:apps@cluster0.jtaodlw.mongodb.net/";
class DBClient {
  constructor() {
    mongoose.connect(url, (error, client) => {
      if (error) {
        console.log(error.message);
        this.db = false;
        return;
      }

      this.myschema = new Schema({
          fullname: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          uname: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          email: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          password: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          },
          {
            timestamps: true,
          }
        );

      this.mailschema = new Schema({
          fullname: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          uname: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          email: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          password: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          },
          {
            timestamps: true,
          }
        );

      this.mailer = new mongoose.model("mail", this.mailschema);

      this.Register = new mongoose.model("gramsi", this.myschema);
      this.client = mongoose.connection.getClient();
      this.db = this.client.db();
      this.users = this.db.collection('gramsis');
      this.mails = this.db.collection('mails');
    });
  }

  isAlive() {
    if (this.db) return true;
    return false;
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbMails() {
    return this.mails.countDocuments();
  }
}
const dbClient = new DBClient();
export default dbClient;