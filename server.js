const express = require("express");

const app = express();


app.use(express.json());

const PORT = 3000;

let complaints = [
    {
        id: 1,
        residentName: "Rahul",
        roomNumber: "101",
        contact: "9876543210",
        category: "Electricity",
        description: "Fan is not working",
        priority: "Medium",
        status: "Pending",
        date: "2026-08-16"
    }
];

let nextId = 2;



app.get("/api/complaints", (req, res) => {

    res.status(200).json(complaints);

});



app.get("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(
        c => c.id === id
    );

    if (!complaint) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }

    res.status(200).json(complaint);

});


app.post("/api/complaints", (req, res) => {

    const {
        residentName,
        roomNumber,
        contact,
        category,
        description,
        priority
    } = req.body;


    
    if (
        !residentName ||
        !roomNumber ||
        !contact ||
        !category ||
        !description ||
        !priority
    ) {

        return res.status(400).json({
            message: "Please fill all fields"
        });

    }


    if (!/^[0-9]{10}$/.test(contact)) {

        return res.status(400).json({
            message: "Contact number must be 10 digits"
        });

    }


    const newComplaint = {

        id: nextId++,

        residentName,

        roomNumber,

        contact,

        category,

        description,

        priority,

        status: "Pending",

        date: new Date()
            .toISOString()
            .split("T")[0]

    };


    complaints.push(newComplaint);


    res.status(201).json({

        message: "Complaint created successfully",

        complaint: newComplaint

    });

});



app.put("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const complaint = complaints.find(
        c => c.id === id
    );


    if (!complaint) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }


    const {
        residentName,
        roomNumber,
        contact,
        category,
        description,
        priority,
        status
    } = req.body;


    if (
        !residentName ||
        !roomNumber ||
        !contact ||
        !category ||
        !description ||
        !priority ||
        !status
    ) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }


    if (!/^[0-9]{10}$/.test(contact)) {

        return res.status(400).json({
            message: "Invalid contact number"
        });

    }


    complaint.residentName = residentName;

    complaint.roomNumber = roomNumber;

    complaint.contact = contact;

    complaint.category = category;

    complaint.description = description;

    complaint.priority = priority;

    complaint.status = status;


    res.status(200).json({

        message: "Complaint updated successfully",

        complaint: complaint

    });

});




app.delete("/api/complaints/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = complaints.findIndex(
        c => c.id === id
    );


    if (index === -1) {

        return res.status(404).json({
            message: "Complaint not found"
        });

    }


    complaints.splice(index, 1);


    res.status(200).json({

        message: "Complaint deleted successfully"

    });

});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:4000`
    );

});