# Integration tests

1. Set up Node.js 22+ and Docker.
2. Copy `.env.example` to `.env` and set a strong `API_TOKEN`.
3. Run `docker compose up -d`.
4. Run `npm install && npm run migrate && npm test`.
5. Run `RUN_DB_INTEGRATION=1 node --env-file=.env --test tests/postgres.integration.test.js`.
6. Set `GEMINI_API_KEY` from Google AI Studio.
7. Run `RUN_LLM_INTEGRATION=1 node --env-file=.env --test tests/gemini.integration.test.js`.

Integration tests use a unique tenant identifier and clean their own rows. Never point tests at a production database. A Gemini free tier, if available for your account and model, may have rate and data-usage restrictions. Do not send sensitive code or secrets.

No successful live database/model test is claimed until these commands are executed against real services.
