const http = require('http');
const { readFile } = require('fs').promises;
const path = require('path');

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
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("I have items");

})
const port = 8081;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
