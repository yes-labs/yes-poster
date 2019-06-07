'use strict';

const fetch = require('node-fetch');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const Koa = require('koa');
const queryString = require('query-string');

const app = new Koa();
const router = new Router();

const SLACK_TOKEN =  process.env.SLACK_TOKEN;
const SLACK_ORG = 'indyref';

async function invite(email) {
  const data = {email, token: SLACK_TOKEN};
  const url = `https://${SLACK_ORG}.slack.com/api/users.admin.invite`;
  const res = await fetch(url, {
    method: 'POST',
    body: queryString.stringify(data),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  });
  const result = await res.json();
  console.log(result);
  return result;
}

router.post('/join', async (ctx) => {
  const body = ctx.request.body;
  const result = await invite(body.email);
  ctx.body = {ok: result.ok};
});

app.use(bodyParser());
app.use(serve(__dirname + '/www/'));
app.use(router.routes());

app.listen(process.env.PORT || 3000);
