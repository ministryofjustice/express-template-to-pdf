# express-pug-pdf

![npm](https://img.shields.io/npm/v/@ministryofjustice/express-pug-pdf.svg)
![NPM](https://img.shields.io/npm/l/@ministryofjustice/express-pug-pdf.svg)
![GitHub issues](https://img.shields.io/github/issues/ministryofjustice/express-pug-pdf.svg)
![npm](https://img.shields.io/npm/dm/@ministryofjustice/express-pug-pdf.svg)


Serve PDF documents in express generated from a Pug template

## Installation
```bash
npm install @ministryofjustice/express-pug-pdf --save
```

## Usage
Specify the location of your views directory
```javascript
const pugPdf = require('@ministryofjustice/express-pug-pdf')

app.use(pugPdf({ views: path.join(__dirname, 'views') }))
```

Render a PDF from a pug template by specifying a template name and passing the data. In this example, the template views/helloWorld.pug will be used

```javascript
app.use('/pdf', (req, res) => {
    res.pugpdf('helloWorld', { message: 'Hello World!' });
})
```

Using pug templates from the views directory

```jade
html
  body
    h1= message
```

### Customising the output
To set the filename for the PDF when downloaded, pass the options object. The default filename is document.pdf

```javascript
app.use('/pdf', (req, res) => {
    res.pugpdf('helloWorld', { message: 'Hello World!' }, { filename: 'helloWorld.pdf' });
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
    res.pugpdf('helloWorld', { message: 'Hello World!' }, options);
})
```


## How it works
express-pug-pdf uses Pug to render the Pug template into HTML. Then it passes the HTML to html-pdf to generate the PDF.
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
run `node examples/helloWorld/index.js` then browse to http://localhost:3001/pdf
