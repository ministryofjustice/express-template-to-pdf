const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks') // eslint-disable-line import/no-extraneous-dependencies
const pdfRenderer = require('../../index')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

nunjucks.configure(path.join(__dirname, 'views'), {
  express: app,
  autoescape: true,
})

app.use(pdfRenderer({}))

app.use('/static', express.static('./examples/css'))

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
  res.renderPDF('helloWorld', { title: 'Hello', message: 'Hello Nunjucks!' }, options)
})

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Listening to port 3001...')
})
