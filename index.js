const puppeteer = require('puppeteer')

module.exports = pdfRenderer

async function send(puppeteerArgs, res, options, html) {
  res.header('Content-Type', 'application/pdf')
  res.header('Content-Transfer-Encoding', 'binary')
  res.header('Content-Disposition', `inline; filename=${options.filename}`)

  const browser = puppeteerArgs ? await puppeteer.launch(puppeteerArgs) : await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdf = await page.pdf(options.pdfOptions)
  await browser.close()

  res.send(pdf)
}

// eslint-disable-next-line no-unused-vars
function render(req, res, next, puppeteerArgs) {
  return (view, pageData, options = { filename: 'document.pdf' }) => {
    res.render(view, pageData, (error, html) => {
      if (error) {
        throw error
      }
      send(puppeteerArgs, res, options, html)
    })
  }
}

function pdfRenderer(puppeteerArgs) {
  return (req, res, next) => {
    res.renderPDF = render(req, res, next, puppeteerArgs)
    next()
  }
}
