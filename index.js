const pug = require('pug')
const path = require('path')
const pdf = require('html-pdf')

module.exports = pugPdf

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

function pugPdf(config) {
  if (!config || !config.views) {
    throw new Error('express-pug-pdf requires the views directory configuration')
  }

  function pdfFromPug(view, pageData, options = { filename: 'document.pdf' }) {
    const res = this
    const pugPath = path.resolve(`${config.views}/${view}.pug`)
    const html = pug.renderFile(pugPath, pageData, null)

    send(res, options, html)
  }

  return (req, res, next) => {
    res.pugpdf = pdfFromPug
    next()
  }
}
