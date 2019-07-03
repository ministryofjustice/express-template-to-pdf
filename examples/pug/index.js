const express = require('express')
const path = require('path')

const pdfRenderer = require('../../index')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(pdfRenderer())

app.use('/static', express.static('./examples/css'))

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

app.use('/pdf', (req, res) => {
  res.renderPDF('helloWorld', { message: 'Hello Pug!' }, options)
})

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Listening to port 3001...')
})
