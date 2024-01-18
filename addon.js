const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    "id": "org.stremio.helloworld",
    "version": "1.2.1",
    "name": "Latin movies2",
    "description": "Explora un universo de emocionantes películas en español con nuestro complemento Stremio. Desde éxitos de taquilla hasta joyas cinematográficas ocultas, disfruta de una amplia variedad de géneros. Nuestra colección en constante crecimiento ofrece streaming de alta calidad y opciones para todos los gustos. Descubre el cine en español desde la comodidad de tu pantalla. ¡Instala nuestro addon y sumérgete en un mundo de entretenimiento sin límites! 🎬🍿",
    "resources": ["catalog", "stream"],
    "types": ["movie", "series"],
    "catalogs": [
        { type: 'movie', id: 'helloworldmovies1' },
        { type: 'series', id: 'helloworldseries1' }
    ],
    "idPrefixes": ["tt"]
};

const dataset = {
    "tt0281358": {
        name: "A Walk To Remember",
        type: "movie",
        externalUrl: "https://es.stripchat.com/__Special__",
    },
    // Otras películas...
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(function(args) {
    const movie = dataset[args.id];

    if (movie && movie.externalUrl) {
        return Promise.resolve({ streams: [{ externalUrl: movie.externalUrl }] });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

const METAHUB_URL = "https://images.metahub.space";

const generateMetaPreview = function(value, key) {
    const imdbId = key.split(":")[0];
    return {
        id: imdbId,
        type: value.type,
        name: value.name,
        poster: METAHUB_URL + "/poster/medium/" + imdbId + "/img",
    };
};

builder.defineCatalogHandler(function(args, cb) {
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key));

    return Promise.resolve({ metas: metas });
});

module.exports = builder.getInterface();

