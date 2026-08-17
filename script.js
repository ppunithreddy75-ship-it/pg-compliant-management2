const API_URL = "http://localhost:3000/api/complaints";

const form = document.getElementById("complaintForm");
const complaintList = document.getElementById("complaintList");
const message = document.getElementById("message");
const search = document.getElementById("search");


// ===============================
// LOAD COMPLAINTS
// ===============================

async function loadComplaints() {

    try {

        const response = await fetch(API_URL);

        const complaints = await response.json();

        displayComplaints(complaints);

    } catch (error) {

        complaintList.innerHTML =
            "<p>Unable to load complaints.</p>";

    }
}


// ===============================
// DISPLAY COMPLAINTS
// ===============================

function displayComplaints(complaints) {

    complaintList.innerHTML = "";

    if (complaints.length === 0) {

        complaintList.innerHTML =
            "<p>No complaints found.</p>";

        return;
    }


    complaints.forEach(complaint => {

        let statusClass = "";

        if (complaint.status === "Pending") {
            statusClass = "pending";
        }
        else if (complaint.status === "In Progress") {
            statusClass = "progress";
        }
        else {
            statusClass = "resolved";
        }


        const card = document.createElement("div");

        card.className = "complaint-card";

        card.innerHTML = `

            <h3>
                Complaint #${complaint.id}
            </h3>

            <p>
                <strong>Name:</strong>
                ${complaint.residentName}
            </p>

            <p>
                <strong>Room:</strong>
                ${complaint.roomNumber}
            </p>

            <p>
                <strong>Contact:</strong>
                ${complaint.contact}
            </p>

            <p>
                <strong>Category:</strong>
                ${complaint.category}
            </p>

            <p>
                <strong>Description:</strong>
                ${complaint.description}
            </p>

            <p>
                <strong>Priority:</strong>
                ${complaint.priority}
            </p>

            <p>
                <strong>Date:</strong>
                ${complaint.date}
            </p>

            <p>
                <strong>Status:</strong>

                <span class="status ${statusClass}">
                    ${complaint.status}
                </span>

            </p>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editComplaint(${complaint.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteComplaint(${complaint.id})"
                >
                    Delete
                </button>

            </div>
        `;


        complaintList.appendChild(card);

    });
}


// ===============================
// SUBMIT COMPLAINT
// ===============================

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const residentName =
        document.getElementById("residentName").value.trim();

    const roomNumber =
        document.getElementById("roomNumber").value.trim();

    const contact =
        document.getElementById("contact").value.trim();

    const category =
        document.getElementById("category").value;

    const priority =
        document.getElementById("priority").value;

    const description =
        document.getElementById("description").value.trim();


    if (
        !residentName ||
        !roomNumber ||
        !contact ||
        !category ||
        !priority ||
        !description
    ) {

        showMessage(
            "Please fill all fields.",
            "red"
        );

        return;
    }


    if (!/^[0-9]{10}$/.test(contact)) {

        showMessage(
            "Enter a valid 10 digit contact number.",
            "red"
        );

        return;
    }


    const complaint = {

        residentName,
        roomNumber,
        contact,
        category,
        priority,
        description

    };


    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(complaint)

        });


        const data = await response.json();


        if (!response.ok) {

            showMessage(
                data.message,
                "red"
            );

            return;
        }


        showMessage(
            "Complaint submitted successfully!",
            "green"
        );


        form.reset();

        loadComplaints();


    } catch (error) {

        showMessage(
            "Server error. Please try again.",
            "red"
        );

    }

});


// ===============================
// DELETE COMPLAINT
// ===============================

async function deleteComplaint(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this complaint?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert("Complaint deleted successfully.");

        loadComplaints();


    } catch (error) {

        alert("Unable to delete complaint.");

    }
}


// ===============================
// EDIT COMPLAINT
// ===============================

async function editComplaint(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);

        const complaint =
            await response.json();


        if (!response.ok) {

            alert(complaint.message);

            return;
        }


        const residentName =
            prompt(
                "Enter Resident Name:",
                complaint.residentName
            );


        if (residentName === null) return;


        const roomNumber =
            prompt(
                "Enter Room Number:",
                complaint.roomNumber
            );


        if (roomNumber === null) return;


        const contact =
            prompt(
                "Enter Contact Number:",
                complaint.contact
            );


        if (contact === null) return;


        const description =
            prompt(
                "Enter Description:",
                complaint.description
            );


        if (description === null) return;


        const status =
            prompt(
                "Enter Status (Pending / In Progress / Resolved):",
                complaint.status
            );


        if (status === null) return;


        const updatedComplaint = {

            residentName,
            roomNumber,
            contact,

            category:
                complaint.category,

            description,

            priority:
                complaint.priority,

            status

        };


        const updateResponse =
            await fetch(`${API_URL}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(updatedComplaint)

            });


        const data =
            await updateResponse.json();


        if (!updateResponse.ok) {

            alert(data.message);

            return;
        }


        alert("Complaint updated successfully.");

        loadComplaints();


    } catch (error) {

        alert("Unable to update complaint.");

    }
}


// ===============================
// SEARCH
// ===============================

search.addEventListener("input", async function () {

    const searchText =
        search.value.toLowerCase();


    try {

        const response =
            await fetch(API_URL);

        const complaints =
            await response.json();


        const filtered =
            complaints.filter(complaint =>

                complaint.residentName
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.status
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.roomNumber
                    .toLowerCase()
                    .includes(searchText)

            );


        displayComplaints(filtered);


    } catch (error) {

        console.log(error);

    }

});


// ===============================
// MESSAGE
// ===============================

function showMessage(text, color) {

    message.textContent = text;

    message.style.color = color;

    setTimeout(() => {

        message.textContent = "";

    }, 3000);

}


// Load data when page opens

loadComplaints();