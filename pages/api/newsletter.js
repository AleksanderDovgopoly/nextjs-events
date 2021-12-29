import {connectDatabase, insertDocument} from "../../helpers/db-util";

async function handler(req, res) {
    if (req.method === 'POST') {
        const userEmail = req.body.email;

        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({message: 'Invalid email address.'});
        }

        let client;

        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(500).json({ message: 'Connection to DB failed!' });
            return;
        }

        try {
            await insertDocument(client, 'newsletter', {email: userEmail});
            client.close();
        } catch (error) {
            res.status(500).json({ message: 'Insert data to db error!' });
            return;
        }


        res.status(201).json({message: 'Signed up!'});
    }
}

export default handler;