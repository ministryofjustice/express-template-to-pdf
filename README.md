# express-template-to-pdf

[![NPM Version][npm-image]][npm-url]
[![Licence][licence-image]][npm-url]
[![Build][build-image]][build-url]
[![Issues][issues-image]][issues-url]
[![Download][download-image]][npm-url]



Serve PDF documents in express generated from templates

## Installation
```bash
npm install @ministryofjustice/express-template-to-pdf --save
```

## Usage
Specify the location of your views directory
```javascript
const pdfRenderer = require('@ministryofjustice/express-template-to-pdf')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(pdfRenderer())
```

Render a PDF from a template by specifying a template name and passing the data. In this example, the template views/helloWorld.pug will be used

```javascript
app.use('/pdf', (req, res) => {
    res.renderPDF('helloWorld', { message: 'Hello World!' });
})
```


### Customising the output
To set the filename for the PDF when downloaded, pass the options object. The default filename is document.pdf

```javascript
app.use('/pdf', (req, res) => {
    res.renderPDF('helloWorld', { message: 'Hello World!' }, { filename: 'helloWorld.pdf' });
})
```

To customise the PDF document, pass additional pdfOptions. The PDF creation uses https://www.npmjs.com/package/html-pdf.
pdfOptions are passed through to html-pdf

```javascript
const options = {
  filename: 'helloWorld.pdf',
  pdfOptions: {
    format: 'A4',
    border: {
      top: '40px',
      bottom: '20px',
      left: '40px',
      right: '20px',
    },
  },
}

app.use('/pdf', (req, res) => {
    res.renderPDF('helloWorld', { message: 'Hello World!' }, options);
})

```
## How it works
express-template-to-pdf renders your existing templates to formatted html. Then it passes the HTML to html-pdf to generate the PDF.
The PDF is returned in the response as binary data with content type application/pdf

## CSS
html-pdf uses PhantomJS to generate the PDF. PhantomJS needs to be able to see any stylesheets linked in your template.
This means using an absolute url

```jade
doctype html
html(lang="en")
  head
    link(href= "http://domain/path/styles.css", media="print", rel="stylesheet", type="text/css")

  body

    block content

      div
        h1.myStyle
            A styled Heading
```

Or set the host (and port in dev environments) dynamically from environment config

```jade
link(href= "#{domain}/path/styles.css", media="print", rel="stylesheet", type="text/css")
```

Note that PhantomJS will use "print" media CSS rules when rendering PDF. Instead of @page CSS rules, use the PhantomJS paperSize
options to control margins - http://phantomjs.org/api/webpage/property/paper-size.html

## Example
run `node examples/pug/index.js` then browse to http://localhost:3001/pdf


## License

  [MIT](LICENSE)
  
---

_Authors: Alistair Todd, Steven Bapaga_

[npm-image]: https://img.shields.io/npm/v/@ministryofjustice/express-template-to-pdf.svg
[npm-url]: https://www.npmjs.com/package/@ministryofjustice/express-template-to-pdf
[licence-image]: https://img.shields.io/npm/l/@ministryofjustice/express-template-to-pdf.svg
[build-image]: https://img.shields.io/circleci/build/github/ministryofjustice/express-template-to-pdf.svg?token=28e722a92c0624929ca5456f9944c716f0c29ad1
[build-url]: https://circleci.com/gh/ministryofjustice/express-template-to-pdf
[issues-image]: https://img.shields.io/github/issues/ministryofjustice/express-template-to-pdf.svg
[issues-url]: https://github.com/ministryofjustice/express-template-to-pdf/issues
[download-image]: https://img.shields.io/npm/dm/@ministryofjustice/express-template-to-pdf.svg
