import db_methods from '/opt/nodejs/db.mjs';

export const handler = async (event, context) => {
  const db = db_methods() 
  try {
    let isAdmin = event['requestContext']['authorizer']['claims']['cognito:groups'] === "AttendifyAdmin"
    
    if (!isAdmin)
      return {statusCode:403}
      
    let access_code = Math.random().toString().slice(2,10);
    let username = event['requestContext']['authorizer']['claims']['cognito:username'];
    
    await db.connect();
    const result = await db.query(
    `INSERT INTO public."AccessCodes"(
	    "AccessCode", "CreatedBy")
	    VALUES ('${access_code}', '${username}') RETURNING "ID";`
	    );
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        body: JSON.stringify({
          access_code_id :  result.rows[0].ID,
          access_code : access_code
        })
    };
    return response;
  } finally {
    await db.disconnect();
  }
};