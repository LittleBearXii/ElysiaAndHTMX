import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const validateSubmit = {
    body: t.Object({
        name: t.String(),
        email: t.String(),
        subject: t.Optional(t.String()),
        message: t.String()
    }),
};

const app = new Elysia()
.get('/', () => (
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.js" integrity="sha384-oeUn82QNXPuVkGCkcrInrS1twIxKhkZiFfr2TdiuObZ3n3yIeMiqcRzkIcguaof1" crossorigin="anonymous"></script>
      <title>Contact Me</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        form {
          max-width: 500px;
          margin: 0 auto;
        }
        input, textarea {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
        <h2>Contact Me</h2>
        <form
            id="formSubmit"
            hx-post="/submit"
            hx-trigger="submit"
            hx-swap="innerHTML"
        >
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required />

        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label for="subject">Subject</label>
        <input type="text" id="subject" name="subject" />

        <label for="message">Message</label>
        <textarea id="message" name="message" rows="6" required></textarea>

        <button type="submit">Send</button>
        </form>

        <button 
            hx-get="/listTable"
            hx-target="#table"
            hx-swap="innerHTML">
            GetList
        </button>
        
        <div id="table">
        </div>
    </body>
    </html>`
))
.get('/listTable', async () => {
    const userSubmit = await db.user.findMany();
    console.log(userSubmit);

    const table = userSubmit.map((user) => `<tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.subject}</td>
            <td>${user.message}</td>
            <td>${user.createdAt}</td>
        </tr>`)

    console.log('table => ', table);

    return `<table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>${table}</tbody>
    </table>`;
})
.post('/submit', async ({ body }) => {
    // Save the data to the database
    await db.user.create({
        data: {
            name: body.name,
            email: body.email,
            subject: body.subject,
            message: body.message,
        },
    })
    // Return a success message

    const userSubmit = await db.user.findMany();
    console.log(userSubmit);

    const subMitSuccess = userSubmit.map((user) => { 
        `<h1>Form submitted successfully!</h1>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Subject: ${user.subject}</p>
        <p>Message: ${user.message}</p>
        <p>Time: ${user.createdAt}</p>
        <a href="/">Go back</a>`
    })

    return subMitSuccess;
}, validateSubmit)

export default app