const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

const getSalesPeople = async () => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM sales_people");
    return rows;
  } catch (error) {
    console.error("Error fetching salespeople:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};
exports.getSalesPeople = getSalesPeople;

const getSalesPersonById = async (id) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT * FROM sales_people WHERE S_NUM = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching salesperson:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};
exports.getSalesPersonById = getSalesPersonById;

const addSalesPerson = async (S_NUM, S_NAME, CITY, COMM) => {
  try {
    await pool.query(
      "INSERT INTO sales_people (S_NUM, S_NAME, CITY, COMM) VALUES (?, ?, ?, ?)",
      [S_NUM, S_NAME, CITY, COMM]
    );
    return getSalesPersonById(S_NUM);
  } catch (error) {
    console.error("Error adding salesperson:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};
exports.addSalesPerson = addSalesPerson;

const deleteSalesPerson = async (S_NUM) => {
  try {
    // Corrected SQL query to delete a salesperson by S_NUM
    const [result] = await pool.query(
      "DELETE FROM sales_people WHERE S_NUM = ?",
      [S_NUM]
    );
    return result; // Return the result of the deletion operation
  } catch (error) {
    console.error("Error deleting salesperson:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};

exports.deleteSalesPerson = deleteSalesPerson;

const updateSalesPerson = async (S_NUM, S_NAME, CITY, COMM) => {
  try {
    // Execute the SQL query to update a salesperson
    const [result] = await pool.query(
      "UPDATE sales_people SET S_NAME = ?, CITY = ?, COMM = ? WHERE S_NUM = ?",
      [S_NAME, CITY, COMM, S_NUM]
    );
    // Check if any rows were affected by the update operation
    if (result.affectedRows === 0) {
      throw new Error("Salesperson not found");
    }
    // Return the updated salesperson
    return getSalesPersonById(S_NUM);
  } catch (error) {
    console.error("Error updating salesperson:", error);
    throw error;
  }
};

exports.updateSalesPerson = updateSalesPerson;
