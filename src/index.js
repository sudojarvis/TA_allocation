const path = require("path");
const express = require("express");
const hbs = require("hbs");
const TA = require("./models/TA");
const PROF = require("./models/Prof");
const res = require("express/lib/response");
const async = require("hbs/lib/async");
require("./db/mongoose");
const allotment = require("./utils/allotment");
const ID_Ta = require("./models/ID_Ta");
const ID_prof = require("./models/ID_prof");
const ID_admin = require("./models/ID_admin");
const auth = require('../src/middleware/auth');

const app = express();
// const port = process.env.PORT;
const port = 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.json());


app.get("", (req, res) => {
	res.render("index");
});

app.get("/admin", (req, res) => {
	res.render("admin");
});


app.get("/addUser", (req, res) => {
	res.render('addUser')
});



app.get("/ta", (req, res) => {
	res.render("tadetails");
});

app.get("/faculty", (req, res) => {
	res.render("faculty");
});

app.get("/course", (req, res) => {
	res.render("addcourse");
});

app.get("/deletecourse", (req, res) => {
	res.render("deletecourse");
});

app.get("/deleteta", (req, res) => {
	res.render("deleteta");
});

app.get("/sign-admin", (req, res) => {
	res.render("sign-admin");
});
app.get("/tapage", (req, res) => {
	res.render("tapage");
});
app.get("/profpage", (req, res) => {
	res.render("profpage");
});

app.get("/dropdata", (req, res) => {
	res.render("dropdata");
});



// API for tadetails
app.post("/tadetails", async (req, res) => {
	try {
		const rollNumber = req.body.rollNumber;
		const ta = await TA.findOneAndDelete({ rollNumber });
		console.log(ta);
		const newTa = new TA(req.body);
		// console.log(newTa);
		await newTa.save();
		res.status(201).send(newTa);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post("/adduser", async (req, res) => {
	console.log("called");
	try {
		const newuser = new ID(req.body);
		console.log("ds");
		console.log(req.body);
		await newuser.save();
		res.status(201).send(newuser);
	} catch(e) {
		res.status(500).send(e);
	}
})

app.post("/allowedta", async (req, res) => {
	try {
		const neta = new ID(req.body);
		await neta.save();
		res.status(201).send(neta);
	} catch (e) {
		res.status(500).send(e);
	}
});

// API for profdetails
app.post("/profdetails", async (req, res) => {
	try {
		// console.log(req.body);
		const courseCode = req.body.courseCode;
		const prof = await PROF.findOneAndDelete({ courseCode });
		const newProf = new PROF(req.body);
		console.log(newProf);
		await newProf.save();
		res.status(201).send(newProf);
	} catch (e) {
		res.status(500).send(e);
	}
});


app.post("/checkpasswordta", async (req, res) => {
	try {
		const id = req.body.id;
		const pass = req.body.password;
		const user = await ID_Ta.findOne({ id });
		const data = {
			check: "no"
		}
		if (user && user.password == pass) data.check = "yes";
		res.status(201).send(data);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post("/checkpasswordprof", async (req, res) => {
	try {
		const id = req.body.id;
		const pass = req.body.password;
		const user = await ID_prof.findOne({ id });
		const data = {
			check: "no"
		}
		if (user && user.password == pass) data.check = "yes";
		res.status(201).send(data);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.post("/checkpasswordadmin", async (req, res) => {
	try {
		const id = req.body.id;
		const pass = req.body.password;
		const user = await ID_admin.findOne({ id });
		const data = {
			check: "no"
		}
		if (user && user.password == pass)  {
			await PROF.remove({});
			await TA.remove({});
		}
		res.status(201).send(data);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get("/showdata", async (req, res) => {
	const prof = await PROF.find();
	const ta = await TA.find();

	var coursedetail = [];
	for (var i = 0; i < prof.length; i++) {
		var obj1 = {};
		obj1["courseCode"] = prof[i].courseCode;
		obj1["ugPg"] = prof[i].ugPg;
		obj1["electiveCore"] = prof[i].electiveCore;
		obj1["needToAttend"] = prof[i].needToAttend;
		obj1["noOfStudents"] = prof[i].nof;
		obj1["theoryLab"] = prof[i].theoryLab;
		obj1["taRollNumber1"] = prof[i].taRollNumber1;
		obj1["taRollNumber2"] = prof[i].taRollNumber2;
		obj1["taRollNumber3"] = prof[i].taRollNumber3;
		coursedetail.push(obj1);
	}

	var tadetail = [];
	for (var i = 0; i < ta.length; i++) {
		var obj = {};
		obj["rollNumber"] = ta[i].rollNumber;
		obj["pref1"] = ta[i].pref1;
		obj["pref2"] = ta[i].pref2;
		obj["pref3"] = ta[i].pref3;
		tadetail.push(obj);
	}

	res.send({ coursedetail, tadetail });
});

// app.get("/deletedata", async (req, res) => {
// 	await PROF.remove({});
// 	await TA.remove({});
// 	res.send("Dropped");
// });

app.get("/result", async (req, res) => {
	const prof = await PROF.find();
	const ta = await TA.find();
	// res.send(match)
	res.json(allotment(prof, ta));
});

app.get("/api", async (req, res) => {
	res.json({
		hello: ["chris", "ben"],
	});
});

app.post("/deletecourse1", async (req, res) => {
	console.log("starting");
	try {
		const courseCode = req.body.courseCode;
		console.log(courseCode);
		await PROF.findOneAndDelete({ courseCode });
		res.send(201);
	} catch (e) {
		console.log("catch");
		res.send(501);
	}
});
app.post("/deleteta1", async (req, res) => {
	console.log("starting");
	try {
		const rollNumber = req.body.rollNumber;
		console.log(rollNumber);
		await TA.findOneAndDelete({ rollNumber });
		res.send(201);
	} catch (e) {
		console.log("catch");
		res.send(501);
	}
});

app.listen(port, () => {
	console.log(`app is up on port ${port}!`);
});
