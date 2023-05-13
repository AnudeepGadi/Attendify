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
            "Access-Control-Allow-Methods": "DELETE,OPTIONS"
        }
      }
      
    var requestBody = JSON.parse(event.body);
    
    const ID = event.queryStringParameters.id;
    await db.connect();
    const result = await db.query(
        `DELETE FROM "Attendance" WHERE "ID" = $1;`
        ,[ID]
	 );
	 
	 
	
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE,OPTIONS"
        }
    };
    return response;
  } finally {
    await db.disconnect();
  }
};