const http = require('http');
const { readFile } = require('fs').promises;
const path = require('path');2
const { Item } = require('../models');

const server = http.createServer(async (req, res) => {

    const re = /^\/images*/;
    let isImg = re.test(req.url);
    if(isImg) {
        try {
            const fileExtension = path.extname(req.url);
            const imageType = 'image/' + fileExtension.substring(1);
            res.setHeader('Content-Type', imageType); // Use the image type
            const imageFilePath = './assets' + req.url;
            const imageFileContents = await readFile(imageFilePath);
            res.statusCode = 200;
            res.end(imageFileContents);
            return;
        } catch (error) {
            res.statusCode = 404;
            res.end();
            return;
        }
    } else if (req.url === "/items/new") {
        res.setHeader('Content-Type', 'text/html');
        const filePath = './views/add-item.html';
        const txtFileContents = await readFile(filePath);
        res.statusCode = 200;
        res.end(txtFileContents);
        return;
    } else if(req.url === "/items" && req.method === "POST") {
        let body = '';
        for await (let chunk of req) {
            body += chunk;
        }

        const keyValuePairs = body.split('&')
            .map(keyValuePairs => keyValuePairs.split('='))
            .map(([key, value]) => [key, value.replace(/\+/g, ' ')])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        // let firstSplit = body.split("&");
        // let secondSplit = firstSplit.split("=");
        // let thirdSplit = secondSplit.replace(/\+/g, ' ');
        // let fourthSplit = decodeURIComponent(thirdSplit); 
        
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
        return;
    }
    let items = await Item.findAll();
    let length = items.length;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<div><a href="/items/new">Add a new item</a></div> <div>I have ${length} items</div>`);

})
const port = 8081;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
