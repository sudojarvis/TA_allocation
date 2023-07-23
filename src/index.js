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
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const app = express();
const bodyParser = require('body-parser');
// const port = process.env.PORT;
const port = 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(publicDirectoryPath));
app.use(express.json());
const bcrypt = require('bcryptjs');


app.get("", (req, res) => {
	// console.log("HIIIII");
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

app.get("/deletecourse", (req, res) => {;
	// console.log("HIII")
	res.render("deletecourse");
});

app.get("/deleteta", (req, res) => {
	// console.log("qwewrere");
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
  
	  // Find and delete the existing TA record (if found)
	  const ta = await TA.findOneAndDelete({ rollNumber });

	  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  
	  const newTaEntry = {
		"rollNumber": rollNumber,
		"cgpa": req.body.cgpa,
		"pref1": req.body.pref1,
		"course_grade_pref_1": req.body.course_grade_pref_1,
		"pref2": req.body.pref2,
		"course_grade_pref_2": req.body.course_grade_pref_2,
		"pref3": req.body.pref3,
		"course_grade_pref_3": req.body.course_grade_pref_3,
		"password": hashedPassword,
	  }
  
	  // Create a new TA entry and save it to the database
	  const newTa = new TA(newTaEntry);
	  await newTa.save();
	  
	  res.status(201).send(newTa);
	} catch (e) {
	  console.log(e); // Output the error to the console for debugging
	  res.status(500).send("Internal Server Error");
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

});
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

// API for profdetails
app.post("/profdetails", async (req, res) => {
	try {
		const courseCode = req.body.courseCode;
		const newProfData = req.body; // Get the data from the request body

		// Hash the password before saving it in the database
		const hashedPassword = await bcrypt.hash(newProfData.password, 8);

		// Find the existing document based on courseCode and delete it
		await PROF.findOneAndDelete({ courseCode });

		// Create a new document with the updated data
		const profData = {
			"courseCode": courseCode,
			"courseName": newProfData.courseName,
			"instructorName": newProfData.instructorName,
			"ugPg": newProfData.ugPg,
			"electiveCore": newProfData.electiveCore,
			"needToAttend": newProfData.needToAttend,
			"nof": newProfData.nof,
			"courseGrade": newProfData.courseGrade,
			"theoryLab": newProfData.theoryLab,
			"taRollNumber1": newProfData.taRollNumber1,
			"taRollNumber2": newProfData.taRollNumber2,
			"taRollNumber3": newProfData.taRollNumber3,
			"password": hashedPassword,
		};

		const newProf = new PROF(profData);
		await newProf.save();

		res.status(201).send(newProf);
	} catch (e) {
		res.status(500).send(e);
	}
});



// app.post("/checkpasswordta", async (req, res) => {
// 	try {
// 		const id = req.body.id;
// 		const pass = req.body.password;
// 		const user = await ID_Ta.findOne({ id });
// 		const data = {
// 			check: "no"
// 		}
// 		if (user && user.password == pass) data.check = "yes";
// 		res.status(201).send(data);
// 	} catch (e) {
// 		res.status(500).send(e);
// 		// res.status(201).send(data);
// 	}
// });

// app.post("/checkpasswordprof", async (req, res) => {
// 	try {
// 		const id = req.body.id;
// 		const pass = req.body.password;
// 		const user = await ID_prof.findOne({ id });
// 		const data = {
// 			check: "no"
// 		}
// 		if (user && user.password == pass) data.check = "yes";
// 		res.status(201).send(data);
// 	} catch (e) {
// 		res.status(500).send(e);
// 		// res.status(201).send(data);
// 	}
// });

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
		obj1["courseName"] = prof[i].courseName;
		obj1["instructorName"] = prof[i].instructorName;
		obj1["ugPg"] = prof[i].ugPg;
		obj1["electiveCore"] = prof[i].electiveCore;
		obj1["needToAttend"] = prof[i].needToAttend;
		obj1["noOfStudents"] = prof[i].nof;
		obj1["theoryLab"] = prof[i].theoryLab;
		obj1["courseGrade"] = prof[i].courseGrade;
		// obj1["cgpa"] = prof[i].cgpa;
		obj1["taRollNumber1"] = prof[i].taRollNumber1;
		obj1["taRollNumber2"] = prof[i].taRollNumber2;
		obj1["taRollNumber3"] = prof[i].taRollNumber3;
		coursedetail.push(obj1);
	}

	var tadetail = [];
	for (var i = 0; i < ta.length; i++) {
		var obj = {};
		obj["rollNumber"] = ta[i].rollNumber;
		obj["cgpa"] = ta[i].cgpa;
		obj["pref1"] = ta[i].pref1;
		obj["course_grade_pref1"] = ta[i].course_grade_pref_1;
		obj["pref2"] = ta[i].pref2;
		obj["course_grade_pref2"] = ta[i].course_grade_pref_2;
		obj["pref3"] = ta[i].pref3;
		obj["course_grade_pref3"] = ta[i].course_grade_pref_3;
		tadetail.push(obj);
	}
	// console.log(coursedetail);
	// console.log(tadetail);
	res.send({ coursedetail, tadetail });
	
});

app.get("/result", async (req, res) => {
	try {
	  const prof = await PROF.find();
	  const ta = await TA.find();
  
	  const result = allotment(prof, ta);
  
	  const data = result;
  
	  const workbook = new ExcelJS.Workbook();
	  const worksheet = workbook.addWorksheet('Sheet1');
  
	  // Set headers
	  worksheet.getCell(1, 1).value = 'course Code';
	//   worksheet.getCell(1, 2).value = 'ExpertTa';
	  worksheet.getCell(1, 2).value = 'Course Name';
	  worksheet.getCell(1, 3).value = 'Instructor Name';
	  worksheet.getCell(1, 4).value = 'Ta Alloted';

	  data.forEach((item, index) => {

		worksheet.getCell(index + 2, 1).value = item.courseCode;
		worksheet.getCell(index + 2, 2).value = item.courseName;
		worksheet.getCell(index + 2, 3).value = item.Instructor;
		// worksheet.getCell(index + 2, 4).value = item.expertTa;
		const values = item.expertTa.split(',');

		values.forEach((value, columnIndex) => {
			worksheet.getCell(index + 2, columnIndex + 4).value = value;
		});

	});

  
	// Split the values and assign them to separate columns
	//   data.forEach((item, index) => {
	// 	worksheet.getCell(index + 2, 1).value = item.courseCode;
  
	// 	const values = item.expertTa.split(',');
  
	// 	values.forEach((value, columnIndex) => {
	// 	  worksheet.getCell(index + 2, columnIndex + 2).value = value;
	// 	});
	//   });
  
	  // Save the workbook
	  await workbook.xlsx.writeFile('allotment.xlsx');
  
	  console.log('Excel file generated successfully.');
	//   console.log(result);
  
	  res.send({ message: 'Excel file generated successfully.', result: result });
	} catch (error) {
	  console.log('Error generating Excel file:', error);
	  res.status(500).send('Error generating Excel file');
	}
  });



app.get("/download-file", async (req, res) => {
	try {
	  const prof = await PROF.find();
	  const ta = await TA.find();
  
	  const result = allotment(prof, ta);
  
	  const data = result;
  
	  // Create a new workbook
	  const workbook = new ExcelJS.Workbook();
	  const worksheet = workbook.addWorksheet('Sheet1');
  


	worksheet.getCell(1, 1).value = 'course Code';
	//   worksheet.getCell(1, 2).value = 'ExpertTa';
	  worksheet.getCell(1, 2).value = 'Course Name';
	  worksheet.getCell(1, 3).value = 'Instructor Name';
	  worksheet.getCell(1, 4).value = 'Ta Alloted';

	  data.forEach((item, index) => {

		worksheet.getCell(index + 2, 1).value = item.courseCode;
		worksheet.getCell(index + 2, 2).value = item.courseName;
		worksheet.getCell(index + 2, 3).value = item.Instructor;
		// worksheet.getCell(index + 2, 4).value = item.expertTa;
		const values = item.expertTa.split(',');

		values.forEach((value, columnIndex) => {
			worksheet.getCell(index + 2, columnIndex + 4).value = value;
		});

	});
	
  
	  // Save the workbook
	  const filePath = './allotment.xlsx';
	  await workbook.xlsx.writeFile(filePath);
  
	  console.log('Excel file generated successfully.');
  
	  res.download(filePath, 'allotment.xlsx', (error) => {
		if (error) {
		  console.log('Error downloading file:', error);
		  res.status(500).send('Error downloading file');
		} else {
		  console.log('File downloaded successfully.');
		}
	  });
	} catch (error) {
	  console.log('Error generating Excel file:', error);
	  res.status(500).send('Error generating Excel file');
	}
  });
  


// app.get("/api", async (req, res) => {
// 	res.json({
// 		hello: ["chris", "ben"],
// 	});
// });

// const bcrypt = require('bcrypt'); // Make sure to srequire bcrypt

app.post("/deletecourse", async (req, res) => {
	try {
		const courseCode = req.body.id.toLowerCase();
		const password = req.body.password;
		const delProf = await PROF.findOne({ courseCode }); // Make sure to use await here
		if (!delProf) {
			// If the courseCode does not exist in the database
			return res.status(404).send("Course not found");
		}

		const check = await bcrypt.compare(password, delProf.password);
		if (check) {
			await PROF.findOneAndDelete({ courseCode });
			return res.redirect("/");
		} else {
			return res.render("deletecourse", { error: "Incorrect Password Entered or Course Code" });
		}
	} catch (e) {
		console.log(e); // Output the error to the console for debugging
		res.status(500).send("Internal Server Error");
	}
});

app.post("/deleteta", async (req, res) => {
	// console.log("starting");
	// console.log(req.body);
	try {
	//   const rollNumber = req.body.id.toLowerCase();
	  const rollNumber = req.body.id;
	  const password = req.body.password;

	  const delTa = await TA.findOne({ rollNumber }); // Make sure to use await here
	  if (!delTa) {
		// If the rollNumber does not exist in the database
		return res.render("deleteta", { error: "Incorrect Password or Roll Number" });
	  }

	  const check = await bcrypt.compare(password, delTa.password);
	  if (check) {
		await TA.findOneAndDelete({ rollNumber });
		return res.redirect("/");
	  }else {
		return res.render("deleteta", { error: "Incorrect Password or Roll Number" });
	  }
	//   console.log(rollNumber);
	//   console.log("try")
	//   await TA.findOneAndDelete({ rollNumber });
	//   res.redirect('/');
	} catch (error) {
	  console.log(error);
	  res.sendStatus(500); // Send 500 Internal Server Error status code
	}
});
  
app.listen(port, () => {
	console.log(`app is up on port ${port}!`);
});
