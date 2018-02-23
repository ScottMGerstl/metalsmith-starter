const Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    layouts = require('metalsmith-layouts'),
    discoverPartials = require('metalsmith-discover-partials'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks'),
    sass = require('metalsmith-sass'),
    Handlebars = require('handlebars'),
    CircularJSON = require('circular-json');

Handlebars.registerHelper('json', function(context) {
    return CircularJSON.stringify(context);
});

Metalsmith(__dirname)
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
    .use(layouts())
    .build(function (err) { if(err) console.log(err) })
