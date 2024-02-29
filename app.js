const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const {
  getSalesPeople,
  getSalesPersonById,
  addSalesPerson,
  deleteSalesPerson,
  updateSalesPerson,
} = require("./database");

const app = express();
app.use(express.json()); // for parsing application/json

// Set up EJS engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// Set the views directory path
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("<h1> HII <h1/>");
});

// Route to get all salespeople
app.get("/salesPerson", async (req, res) => {
  try {
    const salesPeople = await getSalesPeople();
    res.render("SalesPerson/index", { salesPeople: salesPeople });
  } catch (error) {
    console.error("Error fetching salespeople:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get a salesperson by ID
app.get("/salesPerson/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const salesPerson = await getSalesPersonById(id);
    if (!salesPerson) {
      return res.status(404).json({ error: "Salesperson not found" });
    } else {
      res.render("SalesPerson/viewSalesPerson", { salesPerson: salesPerson }); // Pass salesperson details as a local variable
    }
  } catch (error) {
    console.error("Error fetching salesperson details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to render the form for adding a new salesperson
app.get("/newSalesPerson", (req, res) => {
  res.render("SalesPerson/new");
});

// Route to add a salesperson
app.post("/addSalesPerson", async (req, res) => {
  try {
    const { S_NUM, S_NAME, CITY, COMM } = req.body;
    const newSalesperson = await addSalesPerson(S_NUM, S_NAME, CITY, COMM);
    res.redirect("/salesPerson");
  } catch (error) {
    console.error("Error adding salesPerson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/deleteSalesPerson/:id", async (req, res) => {
  // Retrieve salesperson ID from URL params
  const id = req.params.id;
  try {
    await deleteSalesPerson(id);
    res.redirect("/salesPerson");
  } catch (error) {
    console.error("Error deleting salesperson:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/editSalesPerson/:id", async (req, res) => {
  const salesPerson = await getSalesPersonById(req.params.id);

  if (salesPerson) {
    res.render("SalesPerson/edit", { salesPerson: salesPerson });
  } else {
    res.send("Not found")
  }
});

app.post("/editSalesPerson/:id", async (req, res) => {
  try {
    const { S_NUM, S_NAME, CITY, COMM } = req.body;
    const salesPerson = await updateSalesPerson(S_NUM, S_NAME, CITY, COMM);
    res.redirect(`/salesPerson/${salesPerson.S_NUM}`);
  } catch (error) {
    console.error("Error adding salesPerson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3003, () => {
  console.log("Server is running on port :- localhost:3003");
});