const db = require("../config/db/db");
const { userRoele } = require("../utils/constant");
const { generateAccessToken } = require("../utils/token");

// const getAllStudent = (req, res, next) => {
//   try {
//     const students = [
//       {
//         id: 1,
//         name: "Alex",
//       },
//       {
//         id: 2,
//         name: "Starc",
//       },
//       {
//         id: 3,
//         name: "Harry",
//       },
//     ];
//     // const students = [];
//     if (students.length == 0) {
//       throw new Error("Data Not Found For Student Resource.");
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "Student Details.",
//         data: students,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const getAllStudent = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * from students");
    if (rows.length === 0) {
      return res.status(404).json({ message: "student not found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching Student", error.message);
    res.status(500).json({ message: "server error" });
  }
};

const getStudentById = async (req, res, next) => {
  const studentsId = req.params.id;

  if (studentsId == "" || studentsId == undefined || studentsId == null) {
    return res.status(404).json({ message: "student Id is required." });
  }

  try {
    const [rows] = await db.query("SELECT * from students WHERE id =?", [
      studentsId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "student not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching Student", error.message);
    res.status(500).json({ message: "server error" });
  }
};

const 
createStudent = async (req, res, next) => {
  try {
    //name , email, phone , dob, course
    const { name, email, phone, dob, course, password } = req.body;
    if (!name || !email || !phone || !dob || !course) {
      return res.status(400).json({ message: "all field must be required" });
    }
    const [isStudentsExists] = await db.query(
      "SELECT * from students WHERE email =? OR phone =?",
      [email, phone]
    );
    const [isUserloginExists] = await db.query(
      "SELECT * from userlogin WHERE email =? OR phone =?",
      [email, phone]
    );
    if (isStudentsExists.length > 0 || isUserloginExists.length > 0) {
      return res.status(409).json({ message: "student already exist" });
    }

    const [StudentsResult] = await db.query(
      "INSERT INTO students (name, email, phone, dob, course) VALUES (?,?,?,?,?)",
      [name, email, phone, dob, course]
    );

    const [userlogin] = await db.query(
      `INSERT INTO userlogin (master_id,email,phone,password,role) VALUES(?,?,?,?,?)`,
      [StudentsResult.insertId, email, phone, password, userRoele]
    );
    res.status(201).json({
      success: true,
      message: "student created succesfully",
    });
  } catch (error) {
    console.error("ERROR", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateStudent = async (req, res, next) => {
  try {
    console.log("Entered updateStudent");

    const { id } = req.params;
    const { name, email, phone, course } = req.body;
    console.log("ID:", id, "Body", req.body);

    if (!name || !email || !phone || !course) {
      return res.status(400).json({
        success: true,
        message: "all field must be required ",
      });
    }
    const [result] = await db.query(
      "UPDATE students SET name=?, email =?, phone =?, course =? WHERE id =?",
      [name, email, phone, course, id]
    );
  } catch (error) {
    console.error("ERROR", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const deleteStudentById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: true,
      message: "Student Id required",
    });
  }
  try {
    const [row] = await db.query("SELECT * from students WHERE id =?", [id]);
    if (row.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const [result] = await db.query("DELETE FROM students WHERE id =?", [id]);
    return res.status(200).json({
      success: true,
      message: `Students with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting students", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllStudent,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudentById,
};
