const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

/*
  ใช้ไฟล์ใน public
*/
app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

/*
  PORT สำหรับ Render
*/
const PORT =
  process.env.PORT || 3000;

/*
  Google Sheet
*/
const SHEET_ID =
"1mGWbCXw20W81Xf3exwGvJ7bU6jpU-3NYLziMZ3kPGgA";

const API_KEY =
"AIzaSyCbgwSn_yJ8Y-z2fP528bF_5GjbTlYyUP4";

const RANGE =
encodeURIComponent(
  "การตอบแบบฟอร์ม 1"
);

/* =========================
        API DATA
========================= */

app.get(
  "/data",
  async function(req, res){

    try{

      const url =

        "https://sheets.googleapis.com/v4/spreadsheets/"
        + SHEET_ID
        + "/values/"
        + RANGE
        + "?key="
        + API_KEY;

      console.log(
        "Loading data..."
      );

      const response =
        await axios.get(url);

      const rows =
        response.data.values || [];

      if(rows.length === 0){

        return res.json({

          headers: [],
          data: []

        });

      }

      const headers =
        rows[0];

      const data =
        rows.slice(1);

      console.log(

        "Loaded "
        + data.length
        + " rows"

      );

      res.json({

        headers: headers,
        data: data

      });

    }

    catch(error){

      console.log("ERROR");

      console.log(

        error.response?.data
        || error.message

      );

      res.status(500).json({

        success:false,

        error:

          error.response?.data
          || error.message

      });

    }

  }
);

/* =========================
        HOME PAGE
========================= */

app.get(
  "/",
  function(req, res){

    res.sendFile(

      path.join(
        __dirname,
        "public",
        "index.html"
      )

    );

  }
);

/* =========================
        START SERVER
========================= */

app.listen(

  PORT,

  function(){

    console.log(

      "Server running on port "
      + PORT

    );

  }

);