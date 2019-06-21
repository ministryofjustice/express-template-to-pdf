const express = require('express')
const path = require('path')

const pdfRenderer = require('../../index')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(pdfRenderer())

app.use('/static', express.static('./examples/helloWorld'))

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
  res.renderPDF('helloWorld', { title: 'Hello', message: 'Hello Pug!' }, options)
})

app.listen(3001, () => {
  // eslint-disable-next-line no-console
  console.log('Listening to port 3001...')
})
