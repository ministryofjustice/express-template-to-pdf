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

### Configuring Puppeteer
Puppeteer launch options (including Chromium flags via the args array) can be passed to the pdfRenderer function and used on every render.
If no options are specified the default options below will be used.

**Note: The default puppeteer launch options pass flags to disable the Chrome sandbox**

This is one way to enable running Puppeteer in Docker but may be a security issue if you are loading untrusted content, in which case you should override these defaults.
See [Puppeteer troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox) for further info on the use of --no-sandbox

Default options:
```javascript
{ args: ['--no-sandbox', '--disable-setuid-sandbox'] }
``` 

Pass options to the pdfRenderer function to replace the defaults. Pass an empty object if you only want to remove the defaults.

For example, to remove the above defaults and change the default Puppeteer timeout, you could pass options like this.
See [Puppeteer launch options](https://github.com/GoogleChrome/puppeteer/blob/v1.18.1/docs/api.md#puppeteerlaunchoptions) for more info.
```javascript
app.use(pdfRenderer( { timeout:60000 } ))
```


### Customising the output
To set the filename for the PDF when downloaded, pass the options object. The default filename is document.pdf

```javascript
app.use('/pdf', (req, res) => {
    res.renderPDF('helloWorld', { message: 'Hello World!' }, { filename: 'helloWorld.pdf' });
})
```

To customise the PDF document, pass additional pdfOptions. The PDF creation uses https://www.npmjs.com/package/puppeteer.
pdfOptions are passed through to Puppeteer. See the [Puppeteer page.pdf options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions)

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

### Using Puppeteer and headless chrome in Docker
The bundled Chromium used by Puppeteer does not have the necessary shared libraries. Running in Docker will require installing the missing
dependencies in your dockerfile. See [Puppeteer troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker)

eg at minimum you will need this in your dockerfile:

```dockerfile
# Install latest chrome dev package libs so that the bundled version of Chromium installed by Puppeteer will work
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
```

Note also that there are difficulties with the Chrome sandbox. If running as the root user, you must use the --no-sandbox option.
The sandbox may also be missing from Linux environments. If you trust the html content you are opening, as is likely to be the case if you 
are rendering your own templates and not accessing external sites or loading user-submitted content, then you can use the --no-sandbox option.
See [Puppeteer troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)


## How it works
express-template-to-pdf renders your existing templates to formatted html. Then it passes the HTML to puppeteer to generate the PDF.
The PDF is returned in the response as binary data with content type application/pdf

## CSS
Puppeteer needs to be able to see any stylesheets linked in your template. This means using an absolute url

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
