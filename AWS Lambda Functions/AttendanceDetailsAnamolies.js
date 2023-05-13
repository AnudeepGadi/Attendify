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
    const ID = event.queryStringParameters.id;
    
    await db.connect();
    const anomolies = await db.query(
        `SELECT  row_number() over() as rno,* from get_attendance_details(${ID});`
	 );
	 
	const results = await db.query(`SELECT row_number() over() as rno, * from get_attendance(${ID});`)
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify({
          attendanceSummary : results.rows,
          anomolies : anomolies.rows
        })
    };
    return response;
  } finally {
    await db.disconnect();
  }
};