const _ = require('lodash');
const validate = require('express-validation');
const express = require('express');
const pdf = require('./http/pdf-http');
const screenshot = require('./http/screenshot-http')
const config = require('./config');
const logger = require('./util/logger')(__filename);
const {
  renderQuerySchema,
  renderBodySchema,
  sharedQuerySchema
} = require("./util/validation");

const appcode = require("./to-html");
const { buildPage, parseTemplates, endpoints } = appcode;
const axios = require("axios");

function createRouter() {
  const router = express.Router();

  if (!_.isEmpty(config.API_TOKENS)) {
    logger.info('x-api-key authentication required');

    router.use('/*', (req, res, next) => {
      const userToken = req.headers['x-api-key'];
      if (!_.includes(config.API_TOKENS, userToken)) {
        const err = new Error('Invalid API token in x-api-key header.');
        err.status = 401;
        return next(err);
      }

      return next();
    });
  } else {
    logger.warn('Warning: no authentication required to use the API');
  }

  const getRenderSchema = {
    query: renderQuerySchema,
    options: {
      allowUnknownBody: false,
      allowUnknownQuery: false,
    },
  };
  router.get('/api/render', validate(getRenderSchema), pdf.getRender);
  router.get('/api/renderScreenshot', screenshot.getRender)

  const postRenderSchema = {
    body: renderBodySchema,
    query: sharedQuerySchema,
    options: {
      allowUnknownBody: false,
      allowUnknownQuery: false,

      // Without this option, text body causes an error
      // https://github.com/AndrewKeig/express-validation/issues/36
      contextRequest: true,
    },
  };
  router.post('/api/render', validate(postRenderSchema), pdf.postRender);
  router.post('/api/renderScreenshot', screenshot.postRender)
  router.post('/api/cvObject', (req,res,next)=>{
    let { template } = req.body;
    console.log(template);
    sharedImplementation(template)
      .then(cvObject => {
        res.json({ cvObject });
      })
      .catch(next);
  })
  router.post("/api/generate-html", (req, res, next) => {
    let { template, defaults, userData } = req.body;
    console.log(template);
    sharedImplementation(template)
      .then(cvObject => {
        let html = buildPage({ cvObject, defaults, userData });
        res.json({ html });
      })
      .catch(next);
  });
  return router;
}

function sharedImplementation(template){
  return getCvObject(template)
    .then(result => {
      let settings = { showPhoto: true };
      let merged = { ...result.data.defaults, ...result.data };
      var cvObject = merged;
      if (template === settings.name) {
        cvObject = { ...merged, ...settings };
      }
      cvObject = { ...merged, showPhoto: settings.showPhoto };
      return cvObject
    })
}

function getCvObject(template) {
  return axios.get(endpoints.payment + "/templates").then(data => {
    let templates = parseTemplates(data);
    let foundTemplate = templates.find(x => x.name === template);
    return foundTemplate;
  });
}

module.exports = createRouter;
