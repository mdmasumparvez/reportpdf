const express = require('express');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Import axios
const cors = require('cors');
const { json } = require('stream/consumers');
const app = express();
const port = 5000;

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));// Enable CORS
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // Add this to parse JSON bodies

app.get('/', (req, res) => {
    console.log(req.body);
    res.send("listening post");
});
app.get('/test', (req, res) => {
    console.log(req.body);
    res.send("Hi how are you?");
});

app.post('/new', async (req,res)=>{
    //console.log(req.body);
    // You can now use the 'data' object to populate your HTML template dynamically.
    let rows = '';
    let Obj = {};
    // For demonstration, let's just create a simple HTML with the data.
    const getexercise = (val) => {
        if (val?.done) {
            return `<i class="fa-solid fa-check"></i>`;
        } else {
            return '<i class="fa-solid fa-xmark"></i>';
        }
    }
    const getnewsreading = (val) => {
        if (val?.read) {
            return `<i class="fa-solid fa-check"></i>`;
        } else {
            return '<i class="fa-solid fa-xmark"></i>';
        }
    }
    {
        for (let i = 0; i < 31; i++) {
            Obj[i + 1] = {};
            
        }
    }
    {
            if (req.body && req.body?.details) {
                let array = req.body?.details;
                //console.log(array);
                for (let y = 0; y < array.length; y++) {
                    const element = array[y];
                    Obj[+element?.date] = element;
                }
            }
    }
    {
        if (req.body && req.body?.details) {
            for (const x in Obj) {
                const e = Obj[x];
                //console.log("Element" + e?.date);
                if (e?.date) {
                   // console.log("Element inside if: " + Obj[e?.date] ? true : false);
                     rows += `
                            <tr>
                                <td>${(+e?.date) ? e?.date : ''}</td>
                                <td>${(+e?.odhoinSuraNumbers) ? e?.odhoinSuraNumbers : ''}</td>
                                <td>${(+e?.totalQuranAyat) ? e?.totalQuranAyat : ''}</td>
                                <td>${(+e?.totalHadithCount) ? e?.totalHadithCount : ''}</td>
                                <td>${(+e?.totalIslamicBookPages) ? e?.totalIslamicBookPages : ''}</td>
                                <td>${(+e?.totalNonIslamicBookPages) ? e?.totalNonIslamicBookPages : ''}</td>
                                <td>${e?.formattedBookReadingTime}</td>
                                <td>${(+e?.totalClassTotal) ? e?.totalClassTotal : ''}</td>
                                <td>${(+e?.totalClassPresent) ? e?.totalClassPresent : ''}</td>
                                <td>${(+e?.salatJamat) ? e?.salatJamat : ''}</td>
                                <td>${(+e?.salatKaza) ? e?.salatKaza : ''}</td>
                                <td>${(+e?.meetingSodosso) ? e?.meetingSodosso : ''}</td>
                                <td>${(+e?.meetingSathi) ? e?.meetingSathi : ''}</td>
                                <td>${(+e?.meetingKormi) ? e?.meetingKormi : ''}</td>
                                <td>${(+e?.meetingSomorthok) ? e?.meetingSomorthok : ''}</td>
                                <td>${(+e?.meetingBondhu) ? e?.meetingBondhu : ''}</td>
                                <td>${(+e?.meetingMedhabiChatro) ? e?.meetingMedhabiChatro : ''}</td>
                                <td>${(+e?.meetingSuvakankhi) ? e?.meetingSuvakankhi : ''}</td>
                                <td>${(+e?.meetingMuharoma) ? e?.meetingMuharoma : ''}</td>
                                <td>${(+e?.sahitto) ? e?.sahitto : ''}</td>
                                <td>${(+e?.megazine) ? e?.megazine : ''}</td>
                                <td>${(+e?.stiker) ? e?.stiker : ''}</td>
                                <td>${(+e?.upohar) ? e?.upohar : ''}</td>
                                <td>${e?.formattedDawatiKajTime}</td>
                                <td>${e?.formattedOnnannoKajTime }</td>
                                <td>${getnewsreading(e?.newsReading)}</td>
                                <td>${getexercise(e?.exercise)}</td>
                                <td>${getexercise(e?.selfPurify)}</td>
                            </tr>
                           
                            `;
                        
                    }
                    else {
                        rows += `
                            <tr>
                                <td>${x}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            `;
                     
                    }
               
            }
        }
        
    }
    const getdottedline = (d)=>{
        if (d) {
            return `<span class="input-area"> ( ${d} ) </span>`
        }
        else{
            return `............`
        }
    }
    let total = req.body?.totals || {};
    let Css = `
        * {
            font-style: normal !important;
            font-weight: 400 !important;
        }
        .page {
            background: white;
            width: 210mm;
            height: 297mm;
            padding: 5mm 5mm;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
        }
        .headh {
            font-size: 22px;
        }

        p {
            line-height: 1.6;
        }
        @media print {
            body {
                 background-color: white;
            }
            .page {
                box-shadow: none;
                margin: 0;
                padding-top: 20px;
            }
        }
        @page {
            size: A4;
            margin: 0mm 5mm;
        }
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .report-table th, .report-table td {
            border: 1px solid #000;
            padding: 4px 1px;
            text-align: left;
            font-size: 10px; /*Adjust font size to fit */
        }
        .report-table td {
            border: 1px solid #000;
            padding: 4px 1px;
            text-align: center;
            font-size: 12px; /*Adjust font size to fit */
        }
        .report-table th i {
            font-size: 8px;
        }
        .report-table th {
            background-color: #f2f2f2;
            /*writing-mode: vertical-rl;*/
            text-orientation: mixed;
        }

        .header {
            text-align: center;
            margin-bottom: 10   px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0;
            font-weight: bold;
        }
        .header p {
            margin: 0;
            font-size: 16px;
        }
        .info-bar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 12px;
        }
        .dot-leader::after {
            content: "....................................................................................................................................................................................";
            float: right;
            width: 0;
            white-space: nowrap;
            overflow: hidden;
        }
        .field {
            display: flex;
            align-items: baseline;
        }
        .field span {
            flex-shrink: 0;
            margin-right: 5px;
        }
        .field .input-area {
            flex-grow: 1;
            border-bottom: 1px dotted #000;
            text-align: right;
        }
        .input-area {
            border-bottom: 1px dotted #000;
            text-align: right;
            font-weight: bolder;
        }
        .masiktabel {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        .masiktabel th, td {
            border: 1px solid #000;
            padding: 2px;
            text-align: left;
            font-size: 12px;
        }
        .tc {
            text-align: center;
            padding-left: 5px;
            padding-right: 5px;
        }
        .masiktabel th {
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-top: 15px;
            margin-bottom: 5px;
            border-bottom: 0px solid #000;
            padding-bottom: 5px;
        }
        
        .bibidh {
            width: 100%;
            text-align: justify;
            font-size: 12px;
        }
        .no-border-table, .no-border-table td {
            border: none;
        }
        .signature-area {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 12px;
        }
        .signature-nonbox {
            text-align: right;
            width: 120px
            border-top: 1px dotted #000;
            margin-top: 0px;
            margin-right: 20px;
            padding-top: 5px;
        }
        .signature-box {
            text-align: left;
            width: 500px;
            height: 180px;
            border: 1px solid #000;
            border-radius: 2px;
            padding-top: 5px;
        }
        .inputspace {
            margin: 0 5px;
        }
    </style>
    `;

    let html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${req.body?.title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    ${Css}
</head>
<body>
    <div class="body-content">
    <div class="page">
        <div class="header">
            <p style="text-align: center; font-weight: bold;"> بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيمِ  </p>
            <h1 class="headh" style="text-align: center;">${req.body?.title}</h1>
            <p class="headp" style="text-align: center;">${req.body?.userName}</p>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 10px;">
                <span id="month-year">${req.body?.monthName + " - " + req.body?.year}</span>
                <span id="date-time">${req.body?.printDateTime}</span>
            </div>
        </div>
            <table class="report-table">
            <thead>
                <tr>
                    <th>তারিখ</th>
                    <th colspan="2">কুরআন অধ্যয়ন <br /> *সূরা <br />  *আয়াত</th>
                    <th>হাদিস অধ্যয়ন <br /> *সংখ্যা</th>
                    <th colspan="2">সাহিত্য অধ্যয়ন <br /> *ইসলামী <br />  *অন্যান্য</th>
                    <th>পাঠ্যপুস্তক অধ্যয়ন <br /> *ঘণ্টা</th>
                    <th colspan="2">ক্লাস <br /> *সংখ্যা <br /> *উপস্থিত</th>
                    <th colspan="2">নামাজ <br /> *জামায়াত <br /> *কাজা</th>
                    <th colspan="4">যোগাযোগ <br /> *সদস্য <br /> *সাথী <br /> *কর্মী <br /> *সমর্থক</th>
                    <th colspan="4">যোগাযোগ <br /> *বন্ধু <br /> *মেধাবী ছাত্র <br /> *শুভাকাঙ্ক্ষী  <br /> *মুহাররমা</th>
                    <th colspan="4">বিতরণ <br /> *সাহিত্য <br /> *ম্যাগাজিন <br /> *স্টিকার/কার্ড <br /> *উপহার</th>
                    <th colspan="2">*দাওয়াতি কাজ <br /> *অন্যান্য সাঃ কাজ</th>
                    <th colspan="3">*পত্রিকা পাঠ <br /> *শরীর চর্চা <br /> *আত্ম-সমালোচনা</th>
                </tr>
                </thead>
                <tbody>
                ${rows}
                 <tr>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0:00</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0:00</td>
                                <td>0:00</td>
                                <td>0</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                <tr style="font-weight: bolder">
                   <td>Total</td>
                   <td>${total?.odhoinQuranDays}</td>
                   <td>${total?.quranOdhoin}</td>
                   <td>${total?.hadithRecite}</td>
                   <td>${total?.islamicBookPages}</td>
                   <td>${total?.nonIslamicBookPages }</td>
                   <td>${(total?.bookReadingTime === "") }</td>
                   <td>${total?.classTotal }</td>
                   <td>${total?.classPresent }</td>
                   <td>${total?.salatJamat }</td>
                   <td>${total?.salatKaza}</td>
                   <td>${total?.meetingSodosso }</td>
                   <td>${total?.meetingSathi }</td>
                   <td>${total?.meetingKormi }</td>
                   <td>${total?.meetingSomorthok }</td>
                   <td>${total?.meetingBondhu }</td>
                   <td>${total?.meetingMedhabiChatro}</td>
                   <td>${total?.meetingSuvakankhi }</td>
                   <td>${total?.meetingMuharoma }</td>
                   <td>${total?.sahitto }</td>
                   <td>${total?.megazine }</td>
                   <td>${total?.stiker }</td>
                   <td>${total?.upohar }</td>
                   <td>${total?.dawatiKajTime}</td>
                   <td>${total?.onnannoKajTime }</td>
                   <td>${total?.newsReadingDays}</td>
                   <td>${total?.exerciseDays }</td>
                   <td>${total?.selfPurifyDays}</td>
               </tr>
            </tbody>
            
           </table>
        </div>
        </div>


<div class="body-content">
    <div class="page">
        <div class="header">
            <span>ِبْسِم ٱِهّٰلل ٱلَّرْحٰمِن ٱلَّرِحيِم</span>
            <h1>একনজরে মাসিক রিপোর্ট</h1>
            <p class="headp" style="text-align: center;">${req.body?.userName}</p>
        </div>

        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 10px;">
                <span id="month-year">${req.body?.monthName + " - " + req.body?.year}</span>
                <span id="date-time">${req.body?.printDateTime}</span>
        </div>

        <table class="masiktabel">
            <tr>
                <th style="width: 50%;">কুরআন অধ্যয়ন</th>
                <th style="width: 50%;">হাদিস অধ্যয়ন</th>
            </tr>
            <tr>
                <td>• মোট দিন: ${getdottedline(total?.odhoinQuranDays)} • গড় আয়াত: ${getdottedline((+total?.quranOdhoin / +total?.odhoinQuranDays).toFixed(2))}</td>
                <td>• মোট দিন: ${getdottedline(total?.reciteHadithDays)} • গড় হাদিস: ${getdottedline((+total?.hadithRecite / +total?.reciteHadithDays).toFixed(2))}</td>
            </tr>
            <tr>
                <td>• সূরার নাম: ${getdottedline(total?.totalOdhoinSuraNumbers)} • দারস প্রস্তুত: ${getdottedline()}</td>
                <td>• গ্রন্থ/বিষয়: ${getdottedline(total?.totalHadithBooks)} • দারস প্রস্তুত: ${getdottedline()}</td>
            </tr>
            <tr>
                <td>• মুখস্থ: আয়াত: ${getdottedline()} ; অর্থসহ সূরা: ${getdottedline()}</td>
                <td>• মুখস্থ: ${getdottedline()} বিষয়: ${getdottedline()}</td>
            </tr>
        </table>

        <table class="masiktabel">
            <tr>
                <th style="width: 50%;">সাহিত্য অধ্যয়ন</th>
                <th style="width: 50%;">পাঠ্যপুস্তক অধ্যয়ন</th>
            </tr>
            <tr>
                <td>• মোট পৃষ্ঠা: ${getdottedline(+total?.islamicBookPages + +total?.nonIslamicBookPages)} ইসলামী: ${getdottedline(total?.islamicBookPages)} অন্যান্য: ${getdottedline(total?.nonIslamicBookPages)}</td>
                <td>• মোট দিন: ${getdottedline(total?.bookReadingDays)} গড় ঘণ্টা: ${getdottedline(total?.averageBookReadingHours)}</td>
            </tr>
            <tr>
                <td>• বইয়ের নাম: ${getdottedline(total?.totalIslamicBooks + ", " + total?.totalNonIslamicBooks)}</td>
                <td>• ক্লাসে উপস্থিতি: মোট ক্লাস ${getdottedline(total?.classTotal)}• উপস্থিতি: ${getdottedline(total?.classPresent)}</td>
            </tr>
            <tr>
                <td>• বই নোট: ${getdottedline()} আলোচনা নোট: ${getdottedline()}</td>
                <td>• নামাজ: জামায়াত ${getdottedline(total?.salatJamat)} ওয়াক্ত:  গড় ${getdottedline()} <br/> • কাজা ${getdottedline(total?.salatKaza)} ওয়াক্ত</td>
            </tr>
        </table>
        
        <table class="masiktabel">
            <tr>
                <th style="width: 50%;">যোগাযোগ</th>
                <th style="width: 50%;">সাংগঠনিক দায়িত্বপালন</th>
            </tr>
             <tr>
                <td>সদস্য: ${getdottedline(total?.meetingSodosso)} সাথী: ${getdottedline(total?.meetingSathi)} কর্মী: ${getdottedline(total?.meetingKormi)}</td>
                <td>• দিন: ${getdottedline()} গড় ঘণ্টা: ${getdottedline()}</td>
            </tr>
             <tr>
                <td>সমর্থক: ${getdottedline(total?.meetingSomorthok)} বন্ধু: ${getdottedline(total?.meetingBondhu)} শুভাকাঙ্ক্ষী: ${getdottedline(total?.meetingSuvakankhi)}</td>
                <td>দাওয়াতি কাজ: ${getdottedline(total?.dawatiKajDays)} দিন;  গড় ঘণ্টা: ${getdottedline(total?.averageDawatiKajHours)} </td>
            </tr>
             <tr>
                <td>স্কুল ছাত্র: ${getdottedline()}; মেধাবী ছাত্র: ${getdottedline(total?.meetingMedhabiChatro)}; শিক্ষক: ${getdottedline()}</td>
                <td>অন্যান্য সাংগঠনিক কাজ: ${getdottedline(total?.onnannoKajDays)} দিন; গড় ঘণ্টা: ${getdottedline(total?.averageOnnannoKajHours)}</td>
            </tr>
             <tr>
                <td>মুহাররমা: ${getdottedline(total?.meetingMuharoma)};  ভিআইপি: ${getdottedline()}</td>
                <td></td>
            </tr>
        </table>

        <div class="section-title">বিতরণ</div>
        <table class="masiktabel">
            <tr>
                <td >ইসলামী সাহিত্য</td>
                <td class="tc">${total?.sahitto}</td>
                <td>ছাত্রসংবাদ</td>
                <td class="tc">${total?.megazine}</td>
                <td>ক্লাস রুটিন</td>
                <td class="tc"></td>
            </tr>
            <tr>
                <td>কিশোর পত্রিকা</td>
                <td class="tc"></td>
                <td>ইংরেজি পত্রিকা</td>
                <td class="tc"></td>
                <td>স্টিকার/কার্ড</td>
                <td class="tc">${total?.stiker}</td>
            </tr>
            <tr>
                <td>Y.W.</td>
                <td class="tc"></td>
                <td>পরিচিতি</td>
                <td class="tc"></td>
                <td>উপহার/মেসেজ/ই-মেইল</td>
                <td class="tc">${total?.upohar}</td>
            </tr>
        </table>

        <div class="section-title">বৃদ্ধি</div>
        <table class="masiktabel">
            <tr>
                <td style="width: 25%;">সদস্য</td>
                <td class="tc" ></td>
                <td class="tc" style="width: 25%;"></td>
                <td style="width: 25%;">কর্মী</td>
                <td class="tc" ></td>
                <td class="tc" style="width: 25%;"></td>
            </tr>
            <tr>
                <td>সদস্যপ্রার্থী</td>
                <td class="tc"></td>
                <td class="tc"></td>
                <td>সমর্থক</td>
                <td class="tc"></td>
                <td class="tc"></td>
            </tr>
            <tr>
                <td>সাথী</td>
                <td class="tc"></td>
                <td class="tc"></td>
                <td>বন্ধু</td>
                <td class="tc"></td>
                <td class="tc"></td>
            </tr>
            <tr>
                <td>সাথীপ্রার্থী</td>
                <td class="tc"></td>
                <td class="tc"></td>
                <td>শুভাকাঙ্ক্ষী</td>
                <td class="tc"></td>
                <td class="tc"></td>
            </tr>
        </table>

        <div class="section-title">বায়তুলমাল</div>
        <table class="masiktabel">
            <tr>
                <td>পরিশোধের তারিখ: ${getdottedline()}</td>
                <td>ব্যক্তিগত বৃদ্ধি: ${getdottedline()} টাকা</td>
                <td>মোট বৃদ্ধি: ${getdottedline()} টাকা</td>
            </tr>
            <tr>
                <td>ছাত্রকল্যাণ: ${getdottedline()} টাকা</td>
                <td>টেবিল ব্যাংক: ${getdottedline()} টাকা</td>
                <td>কলসি/হাঁড়ি: ${getdottedline()} টি</td>
            </tr>
        </table>

        <div class="section-title ">বিবিধ</div>
        <div class="bibidh">
            <div>
                • আত্মসমালোচনা: ${getdottedline(total?.selfPurifyDays)} দিন;
                • শরীরচর্চা: ${getdottedline(total?.exerciseDays)} দিন;
                • পত্রিকা পাঠ: ${getdottedline(total?.newsReadingDays)} দিন
            </div><br/>
            <div>
                • আত্মীয়স্বজন (পুরুষ) যোগাযোগ: ${getdottedline()} জন;
                • গ্রুপ দাওয়াতি কাজ: ${getdottedline()} বার;
                • দাওয়াতি মেসেজ প্রেরণ: ${getdottedline()} টি
            </div><br/>
            <div>
                • দাওয়াতি ই-মেইল প্রেরণ: ${getdottedline()} টি
                • অমুসলিম বন্ধু যোগাযোগ: ${getdottedline()} জন
                • বন্ধু সংগঠনের সাথে যোগাযোগ: ${getdottedline()} জন
            </div><br/>
            <div>
                • দক্ষতা উন্নয়ন কার্যক্রম: কম্পিউটার শিক্ষা ${getdottedline()} দিন
                • ভাষা শিক্ষা ${getdottedline()} দিন
                • অন্যান্য: ${getdottedline()}
            </div><br/>
            <div>
                • নিজ উদ্যোগে দায়িত্বশীলকে রিপোর্ট দেখানো হয়েছে: ${getdottedline()} বার; তারিখ: ${getdottedline()}
            </div>
        </div>

        <div class="signature-area">
            <div class="signature-box">দায়িত্বশীলের পরামর্শ ও স্বাক্ষর</div>
            <div class="signature-nonbox">স্বাক্ষর ও তারিখ</div>
            </div>

    </div>
           
        </div>
    </body>
    </html>`;
    //res.send(html);
        const options = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        }
    };

    pdf.create(html, options).toStream((err, stream) => {
            if (err) return res.send(err);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=daily-report.pdf');
            stream.pipe(res);
        });

    })

app.listen(port, () => {
    console.log('Listening on port: http://localhost:' + port);
});