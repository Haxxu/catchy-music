require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

const database = require('./config/database');
const routes = require('./routes');

database.connect();

app.use(cors());
app.use(express.json());

// Routes init
routes(app);

async function test() {
    // const { Library } = require('./app/models/Library');
    // const { User } = require('./app/models/User');

    // const follow = await Follow.findOne({ _id: '63296e80e483993094f1551c' }).populate('followings').exec();

    console.log('\n\n\n-------------------------------------------');
    // console.log(follow);
    // const albums = await Album.find().populate('tracks');
    // console.log(albums);
    console.log('\n\n\n-------------------------------------------');
}

test();

app.listen(port, console.log(`Listening on port ${port}`));
