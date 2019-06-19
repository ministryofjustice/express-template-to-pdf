const pugPdf = require('../../index')
const express = require('express')

const app = express()
app.use(pugPdf({ views: './examples/helloWorld' }))
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

app.use('/pdf', function(req, res) {
  res.pugpdf('helloWorld', { message: 'Hello World!' }, options)
})

app.listen(3001)
