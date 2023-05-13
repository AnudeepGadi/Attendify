import db_methods from '/opt/nodejs/db.mjs';

export const handler = async (event, context) => {
  const db = db_methods() 
  try {
    
    let isAdmin = event['requestContext']['authorizer']['claims']['cognito:groups'] === "AttendifyAdmin"
    
    if (!isAdmin)
      return {statusCode:403,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        }
      }
    
    const username = event['requestContext']['authorizer']['claims']['cognito:username'];
    
    await db.connect();
    const result = await db.query(
        `SELECT * from classattendanceoverview();`
	 );
	 
	const number_of_students = await db.query(`select count("ID") as count from "Users";`)
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify({
          attendanceList : result.rows,
          number_of_students : number_of_students.rows[0].count
        })
    };
    return response;
  } finally {
    await db.disconnect();
  }
};