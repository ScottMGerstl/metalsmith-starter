const
    metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    discoverPartials = require('metalsmith-discover-partials'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    sass = require('metalsmith-sass'),
    handlebars = require('handlebars'),
    autoprefixer = require('metalsmith-autoprefixer'),
    browsersync = require('metalsmith-browser-sync'),
    circularJSON = require('circular-json');

const environment = process.argv[2] || 'dev';

handlebars.registerHelper('json', function(context) {
    return circularJSON.stringify(context);
});

const pipeline =
    metalsmith(__dirname)
        .source('src')
        .destination('dist')
        .use(collections({
            pages: {
                pattern: 'content/pages/*.md'
            },
            articles: {
                pattern: 'content/articles/*.md',
                sortBy: 'date'
            }
        }))
        .use(markdown())
        .use(permalinks({
            pattern: ':collections/:title'
        }))
        .use(discoverPartials({
            directory: 'layouts/partials',
            pattern: /\.hbs$/
        }))
        .use(sass())
        .use(autoprefixer())
        .use(layouts());

    if (environment === 'dev') {
        pipeline
            .use(browsersync({
                server: "dist",
                files: [
                    "src/**/*.md",
                    "src/**/*.scss",
                    "layouts/**/*.hbs"
                ]
            }));
    }

    pipeline
        .build(function (err) { if(err) console.log(err) })
