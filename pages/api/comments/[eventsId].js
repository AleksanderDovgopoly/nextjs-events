import {connectDatabase, getAllDocuments, insertDocument} from "../../../helpers/db-util";

async function handler (req, res) {
    const eventID = req.query.eventsId;

    let client;

    try {
        client = await connectDatabase();
    } catch (error) {
        res.status(500).json({message: 'Connection to DB failed!'})
        return;
    }

    if (req.method === 'POST') {
        const { email, name, text } = req.body

        if (
            !email ||
            !email.includes('@') ||
            !name ||
            name.trim() === '' ||
            !text ||
            text.trim() === ''
        ) {
            res.status(422).json({message: 'Some input validation error!'});
            client.close();
            return;
        }

        const newComment = {
            email,
            name,
            text,
            eventID
        }

        let result;

        try {
            result = await insertDocument(client, 'comments', newComment);
            res.status(201).json({message: 'Addad comment. ', comment: result.insertedId });
        } catch (error) {
            res.status(500).json({message: 'Inserting message failed!'})
        }
    }

    if (req.method === 'GET') {
        let documents;

        try {
            documents = await getAllDocuments(client, 'comments', {_id: -1}, {eventID: eventID} )
            res.status(200).json({comments: documents})
        } catch (error) {
            res.status(500).json({message: 'Getting comments failed!'})
        }
    }

    client.close();
}

export default handler;