import db_methods from "/opt/nodejs/db.mjs";

export const handler = async (event, context) => {
  const db = db_methods();
  try {
    
    let isAdmin = event['requestContext']['authorizer']['claims']['cognito:groups'] === "AttendifyAdmin"
    
    if (!isAdmin)
      return {headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,OPTIONS"
        },
        statusCode:403

      }
    
    var requestBody = JSON.parse(event.body);
    const access_code_id = requestBody.access_code_id;

    var access_code_switch;
    if (requestBody.switch === "ON") access_code_switch = "true";
    else if (requestBody.switch === "OFF") access_code_switch = "false";
    else
      return {
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,OPTIONS"
        },
        statusCode: 400,
        body: JSON.stringify({
          message: "switch value must be ON or OFF",
        }),
      };

    await db.connect();
    var query = `UPDATE "AccessCodes"
	    SET "Accepting"= '${access_code_switch}', "ModifiedAt"= now()
	    WHERE "ID" = ${access_code_id};`;

    const result = await db.query(query);

    const response = {
      headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,OPTIONS"
        },
      statusCode: 200
    };
    return response;
  } finally {
    await db.disconnect();
  }
};
