const express = require('express');
const path = require('path');
const app = express();


require('dotenv').config()
const dbConfig = require('./config/dbConfig.js');



app.use(express.json());
const userRoute = require('./routes/userRoute.js')
app.use('/api/user', userRoute);
const adminRoute = require('./routes/adminRoute.js')
app.use('/api/admin', adminRoute);
const doctorRoute = require('./routes/doctorRoute.js')
app.use('/api/doctor', doctorRoute);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Node server started at port ${port}`));




