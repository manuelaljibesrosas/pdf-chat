## Running Locally

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

This will start the server and open the application in your browser at http://localhost:5173/.

To see a list of available commands, run:

```
npm run
```

## Technical overview

The project was set up using Vite, this made sense considering the scale of the end product, and even though server components are the future of React, this is a highly interactive, client-side-in-nature page, which would also be protected by a login screen in a real-world setting (SEO is not a concern), so even as part of a larger app written in a framework like Next.js, this would probably mostly remain a client-side rendered page.

Components are split into two categories, the `components/ui` directory holds those which in a real-world project would be part of a design system, wereas the `components/app` page stores those which are specific to the application.

There's only one endpoint with which the application communicates, and the responses of said endpoint aren't suitable for a cache, so an async state management solution like `react-query` or `swr` won't really offer that many benefits over using the native Fetch API or something like `axios` directly, which is what the app uses to fetch the data imperatively when the chatbox message is submitted; there are many pitfalls when dealing with async procedures on React, so had I had more time I woud've definitely spent some time integrating one such tool for the sake of consistency with future endpoints which might be integrated at a later time.

## Stretch goals

- **Document highlights**: This was one of the key improvements I noted over pdf.ai, which just highlights the entire page in which the citation is found, but I found it to be quite challenging to produce consistent highlights given the format in which the citation text was included, I had some good results by using the page value to select the corresponding page element and perform a text search over the nodes inside the text layer of the page, but it was still challenging to convert those matches to actual react-pdf-viewer highlights that the highlight plugin could use, I ended up bailing on that effort due to time constraints, but I'm sure that that's the right path to get this feature online.
- **Rich text formatting**: The solution currently used in the app to render text from the model leaves a lot to be desired, as the model will at times output something which includes Markdown artifacts, which would definitely improve display considerably, but I didn't had enough time to check if using a Markdown renderer would produce good results consistently, therefore I decided it'd be best to stick with the current approach for now.
- **Better error handling**: The error handling solution present at the time of writing lacks a crucial "regenerate response" button, unfortunately I didn't really plan ahead on this feature and implementing it would require to set up some changes in how requests are dealt with as we'd need to pass in a method to the `ChatMessage` component to retry the failed request.
- **Further UX improvements**: It's safe to say that most of the time I invested into this was at the design phase, and among the few iterations I managed to put together, there are still some ideas which didn't make the cut, would've loved to have more time to realize those.
