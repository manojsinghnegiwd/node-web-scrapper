const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./db');
const { scrapImagesFromPage } = require('./scrapper');
const ImageModel = require('./models/image');
const spider = require('./spider');

const db = new DB('image-search-network');

db.connect()
    .then(() => {
        const app = express();
        app.use(bodyParser.json());
        app.listen('3000', () => console.log('Server is started'));

        app.post('/', async (req, res) => {
            const { url } = req.body;
            const data = await scrapImagesFromPage(url);

            const imageRecords = await ImageModel.insertMany(
                data.map(item => ({...item, url}))
            );

            res.status(200).send(imageRecords);
        })

        app.get('/', async (req, res) => {
            let query = {};

            if (req.query.term) {
                query = {
                    $text: {
                        $search: req.query.term || ''
                    }
                }
            }

            const results = await ImageModel.find(query);
            res.status(200).send(results);
        })

        app.post('/spider', async (req, res) => {
            const { url } = req.body;
            const data = await spider(url);

            res.status(200).send(data);
        })
    })


