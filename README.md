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

To customise the PDF document, pass additional pdfOptions. The PDF creation uses https://www.npmjs.com/package/pdf-puppeteer.
pdfOptions are passed through to pdf-puppeteer, which in turn passes them to Puppeteer. See the [Puppeteer page.pdf options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions)

```javascript
const options = {
  filename: 'helloWorld.pdf',
  pdfOptions: {
    format: 'A4',
    margin: {
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
express-template-to-pdf renders your existing templates to formatted html. Then it passes the HTML to pdf-puppeteer to generate the PDF.
The PDF is returned in the response as binary data with content type application/pdf

## CSS
pdf-puppeteer uses Puppeteer to generate the PDF. Puppeteer needs to be able to see any stylesheets linked in your template.
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

Note that Puppeteer will use "print" media CSS rules when rendering PDF.
You can use @page CSS rules by setting the preferCSSPageSize option, otherwise use the Puppeteer format and margin options.

### Page breaks
Page breaks can be controlled using css, for example to avoid breaking inside a block or to force a break after, you could use:

```css
.no-break {
    page-break-inside: avoid;
}
.pagebreak {
  page-break-before: always;
}
```

### Headers and footers
You can create repeating headers and footers on each page using the Pupeteer page.pdf options headerTemplate and footerTemplate.

Note that the headers and footers can not see external stylesheets and must use inline styles.

Also note that the headers and footers will not be visible unless you set page margins to ensure that page content does not sit over them.

Puppeteer exposes page numbering classes. See the [Puppeteer page.pdf options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions)

In this example, the header and footer blocks are given a height of 20px, and the top and bottom margins are made bigger than that.

```javascript
const headerFooterStyle =
  'font-family: Arial; font-size: 10px; font-weight: bold; width: 100%; height: 20px; text-align: center;'
  
const options = {
  filename: 'helloWorld.pdf',
  pdfOptions: {
    displayHeaderFooter: true,
    headerTemplate: `<span style="${headerFooterStyle}">Repeating header on every page</span>`,
    footerTemplate: `<span style="${headerFooterStyle}">Repeating footer on page <span class="pageNumber"></span> of <span class="totalPages"></span></span>`,      
    format: 'A4',
    margin: {
      top: '40px',
      bottom: '60px',
      left: '40px',
      right: '20px',
    },
  },
}
```


## Example
run `node examples/pug/index.js` or ``node examples/nunjucks/index.js`` then browse to http://localhost:3001/pdf


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
