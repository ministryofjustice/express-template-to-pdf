const request = require('supertest')
const pugPdf = require('../index')
const express = require('express')

describe('pugPdf', () => {
  let app

  beforeEach(() => {
    app = express()
  })

  it('sets response headers for PDF', () => {
    app.use(pugPdf({ views: './test' }))
    app.use('/pdf', function(req, res) {
      res.pugpdf('helloWorld', { message: 'Hello World!' }, { filename: 'test.pdf' })
    })

    return request(app)
      .get('/pdf')
      .expect(200)
      .expect('Content-Type', 'application/pdf')
      .expect('Content-Transfer-Encoding', 'binary')
      .expect('Content-Disposition', 'inline; filename=test.pdf')
  })

  it('uses default filename if none set', () => {
    app.use(pugPdf({ views: './test' }))
    app.use('/pdf', function(req, res) {
      res.pugpdf('helloWorld', { message: 'Hello World!' })
    })

    return request(app)
      .get('/pdf')
      .expect(200)
      .expect('Content-Disposition', 'inline; filename=document.pdf')
  })

  it('throws if missing views config', () => {
    expect(() => app.use(pugPdf())).to.throw('express-pug-pdf requires the views directory configuration')
  })
})
