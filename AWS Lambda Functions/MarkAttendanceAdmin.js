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
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        }
      }
      
    var requestBody = JSON.parse(event.body);
    
    const access_code = requestBody.access_code;
    const username = requestBody.username;
    const admin = event['requestContext']['authorizer']['claims']['cognito:username'];
    await db.connect();
    const result = await db.query(
        `INSERT INTO "Attendance" ("AccessCode", "MarkedBy", "IPAddress", "DeviceIdentifier")
            SELECT $1, $2::character varying, $3::character varying, $4::character varying
            WHERE NOT EXISTS (
            SELECT 1 FROM "Attendance" WHERE "AccessCode" = $1 AND "MarkedBy" = $2);`
        ,[access_code, username, admin, admin]
	 );
	 
	 
	
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        }
    };
    return response;
  } finally {
    await db.disconnect();
  }
};