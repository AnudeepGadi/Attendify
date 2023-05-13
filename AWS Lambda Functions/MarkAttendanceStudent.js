import db_methods from '/opt/nodejs/db.mjs';

export const handler = async (event, context) => {
  const db = db_methods() 
  try {
    
    var requestBody = JSON.parse(event.body);
    
    const access_code = requestBody.access_code;
    const deviceIdentifier = requestBody.deviceIdentifier;
    const ipaddress = event.requestContext.identity.sourceIp;
    const username = event['requestContext']['authorizer']['claims']['cognito:username'];
    
    await db.connect();
    const result = await db.query(
        `SELECT public."MarkAttendance"(
	        '${access_code}', 
	        '${username}', 
	        '${ipaddress}', 
	        '${deviceIdentifier}') as CODE;`
	 );
	 
	 
	 const message = result.rows[0].code === -1 ? "Access Code is not open" : result.rows[0].code === 0 ? "Attendance already marked" : "Attendance marked";     
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        body: JSON.stringify({
          code : result.rows[0].code,
          message : message
        })
    };
    return response;
  } finally {
    await db.disconnect();
  }
};