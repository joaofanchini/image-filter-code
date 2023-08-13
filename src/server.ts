import express from 'express';
import { Query } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import * as core from 'express-serve-static-core';

import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  interface RequestQueryParam<T extends Query> extends core.Request {
    query: T,
  }

  const enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400
  }

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: express.Request, res: express.Response): Promise<void> => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req: RequestQueryParam<{ image_url: string }>, res: express.Response): Promise<void> => {
    const imageUrl: string = req.query.image_url;

    if (!imageUrl || imageUrl.length === 0) {
      res.status(HttpStatus.BAD_REQUEST)
        .send('Required parameter "image_url')
        .end();

      return;
    }

    const filterImage: string = await filterImageFromURL(imageUrl);

    req.on('close', (): Promise<void> => deleteLocalFiles([filterImage]));

    res.status(HttpStatus.OK)
      .sendFile(filterImage);
  });


  // Start the Server
  app.listen(port, (): void => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();