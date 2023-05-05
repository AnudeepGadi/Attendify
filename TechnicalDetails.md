# Attendify Technical Details

**Attendify has 2 web applications:**
1. A web application for users(students) to mark their attendance.
2. A web application for admin(professor) to generate access codes and reports.

These web applications were developed using the latest **Angular 15**.

**Attendify is completely developed on AWS (Amazon Web Services).**

![CC_Project drawio (1)](https://user-images.githubusercontent.com/111954019/236363889-d8a3eab7-04b8-4863-b1e0-e21560a8389b.png)

<table>
    <thead>
        <tr>
            <th align="center">Srno</th>
            <th align="center">AWS Component</th>
            <th align="center">Usage</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="center">1</td>
            <td align="left">Cognito</td>
            <td align="left">User Authorization Authentication, Multi-Factor Authentication (MFA)</td>
        </tr>
        <tr>
            <td align="center">2</td>
            <td align="left">Lambda</td>
            <td align="left">Cloud functions written in NodeJS 18</td>
        </tr>
        <tr>
            <td align="center">3</td>
            <td align="left">API Gateway</td>
            <td align="left">For developing REST APIs which triggers respective Lambda functions</td>
        </tr>
        <tr>
            <td align="center">4</td>
            <td align="left">RDS</td>
            <td align="left">Postgres Database - tables, functions</td>
        </tr>
        <tr>
            <td align="center">5</td>
            <td align="left">Amplify</td>
            <td align="left">For deploying web applications</td>
        </tr>
    </tbody>
</table>
