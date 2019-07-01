const toPdf = require('pdf-puppeteer')

module.exports = pdfRenderer

async function send(res, options, html) {
  res.header('Content-Type', 'application/pdf')
  res.header('Content-Transfer-Encoding', 'binary')
  res.header('Content-Disposition', `inline; filename=${options.filename}`)

  await toPdf(
    html,
    pdf => {
      res.send(pdf)
    },
    options.pdfOptions
  )
}

// eslint-disable-next-line no-unused-vars
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
