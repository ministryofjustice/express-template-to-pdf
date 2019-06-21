const pdf = require('html-pdf')

module.exports = pdfRenderer

async function send(res, options, html) {
  res.header('Content-Type', 'application/pdf')
  res.header('Content-Transfer-Encoding', 'binary')
  res.header('Content-Disposition', `inline; filename=${options.filename}`)

  await pdf.create(html, options.pdfOptions).toStream((error, stream) => {
    if (error) {
      throw error
    } else {
      stream.pipe(res)
      stream.on('end', () => res.end())
    }
  })
}

function render(req, res, next) {
  return (view, pageData, options = { filename: 'document.pdf' }) => {
    res.render(view, pageData, (error, html) => {
      if (error) {
        throw error
      }
      send(res, options, html)
    })
  }
}

function pdfRenderer() {
  return (req, res, next) => {
    res.renderPDF = render(req, res, next)
    next()
  }
}
