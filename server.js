
const PORT = process.env.PORT || 3777;

const api = require('./api');
const { getLocalFile } = api.localFiles;
const { app, express, server } = api.express;
const routers = require('./routers');
const { /*rtmpAuthRouter,*/ arduinoSerialRouter, arduinoIOTRouter, commentsRouter, whatsappWebHookRouter } = routers;
const { wsServer1 } = require('./sockets');


const cors = require('cors');

const allowedOrigins = [
  'http://localhost:4001',
  'https://arthur-zarankin.com',
  'https://w3arthur.com',
  'https://arthurcam.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // לא לכלול בקשות ללא origin (כמו curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


//middleware:
app.use(require("cookie-parser")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//http:




app.use((req, res, next) => { req.globalUrl = req.url; next(); }); //fix global url path



app.use("/", express.static(getLocalFile()));  //global public folder
app.route("/").get(async (req, res) => res.status(200).sendFile(getLocalFile("index.html")));
app.route("/serial/").get(async (req, res) => res.status(200).sendFile(getLocalFile("serial.html")));
app.use("/serial/", express.static(getLocalFile()));


//app.route("/test").get(async (req, res) => { return res.status(200).sendFile(getLocalFile("test.html")) }); // not required
//app.use("/api/rtmp_auth", rtmpAuthRouter);    // using youtube instead nginx streaming

app.use("/api/arduinoSerial", arduinoSerialRouter); // not in use for now. + wsServer1 not needed

//await middleware
let getDate = () => { return Math.floor(Date.now() / 1000); };
let previousDate = 0;
const SECONDS_TO_DELAY = 3;    //delay 3 sec

app.use("/api/**", (req, res, next) => {
    let pDate = previousDate;
    previousDate = getDate();
    if (getDate() - pDate >= SECONDS_TO_DELAY) return next()
    else return res.status(400).json({ "arduino": false });
});

app.use("/api/arduinoIOT", arduinoIOTRouter);
app.use("/api/comments", commentsRouter);
app.use("/webhook", whatsappWebHookRouter);



app.route("*").all((req, res) => res.status(404).send("no fit request, fail " + req.path));

//websocket:

wsServer1(server, app, '/ws_arduino'); // not in use, used only for serial port  //ws explain examples https://stackoverflow.com/questions/22429744/how-to-setup-route-for-websocket-server-in-express


server.listen(PORT, () => console.log(`${(new Date().toISOString())} Server is listening on port ${PORT}, (Express)`));
